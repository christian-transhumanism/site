const markdownIt = require("markdown-it");
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');

const WIKI_ROOT = 'src/cta-wiki';
const WIKI_SEGMENT = 'cta-wiki';
const WIKI_RAW_PREFIX = `/${WIKI_SEGMENT}/`;
const WIKI_ASSET_OUTPUT_DIR = 'wiki-assets';
const WIKI_ASSET_URL_PREFIX = `/${WIKI_ASSET_OUTPUT_DIR}/`;
const WIKI_ASSET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.mp3', '.mp4', '.pdf']);

function posixPath(str) {
  return String(str).replace(/\\/g, '/');
}

function toSlugBase(str) {
  const s = slugify(String(str || '').replace(/[–—]/g, '-'), { lower: true, strict: true });
  return s || 'note';
}

function decodeHtmlEntities(str) {
  return String(str || '').replace(/&(#x?[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g, (match, entity) => {
    switch (entity) {
      case 'amp': return '&';
      case 'lt': return '<';
      case 'gt': return '>';
      case 'quot': return '"';
      case 'apos': return "'";
    }
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (entity.startsWith('#')) {
      const code = parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return match;
  });
}

function normalizeListInput(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) {
    return value
      .map(v => (v === undefined || v === null ? '' : String(v)))
      .map(v => v.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const trimmed = String(value).trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

function splitContributorNames(value) {
  if (value === undefined || value === null) return [];
  return String(value)
    .split(/\s*(?:,|;|&|\/|\band\b|\bwith\b)\s*/i)
    .map(part => part.trim())
    .filter(Boolean);
}

function gatherContributorNames(book) {
  const names = [];
  const seen = new Set();

  const addName = (name) => {
    if (name === undefined || name === null) return;
    const trimmed = String(name).trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (seen.has(lower)) return;
    seen.add(lower);
    names.push(trimmed);
  };

  const processValue = (value) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach(processValue);
      return;
    }
    addName(value);
    splitContributorNames(value).forEach(addName);
  };

  if (book && typeof book === 'object') {
    processValue(book.author);
    processValue(book.editor);
    processValue(book.contributors);
  }

  return names;
}

const format = require('date-fns/format')
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  const wikiAssetLookup = new Map();
  // Ignore CTA wiki template scaffolds from being processed as pages
  try { eleventyConfig.ignores.add(`${WIKI_ROOT}/templates/`); } catch (_) {}
  try { eleventyConfig.addWatchIgnore(`${WIKI_ROOT}/templates/`); } catch (_) {}
  // Lightweight .env loader (no dependency on dotenv)
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        if (!line || /^\s*#/.test(line)) continue;
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        let [, key, val] = m;
        // Remove surrounding quotes if present
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) process.env[key] = val;
      }
    }
  } catch (_) {}
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter('date', function (date, dateFormat) {
    return format(date, dateFormat)
  });
  eleventyConfig.addFilter('sortByPubDate', (collection) => {
    return collection.slice().sort((a, b) => Date.parse(a.pubDate) - Date.parse(b.pubDate))
  });
  eleventyConfig.addLiquidFilter('sortByDate', (collection) => {
        return collection.slice().sort((a, b) => a.data.date.localeCompare(b.data.date))
    });
  eleventyConfig.addLiquidFilter("reverse", (collection) => {
        return [...collection];
    });
  // Take first N items from an array (works in Nunjucks + Liquid)
  eleventyConfig.addFilter('take', (arr, n) => Array.isArray(arr) ? arr.slice(0, n) : []);

  // Extract the first image from HTML content
  eleventyConfig.addFilter('getFirstImage', (content) => {
    if (!content) return null;
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  });
  eleventyConfig.addLiquidFilter('take', (arr, n) => Array.isArray(arr) ? arr.slice(0, n) : []);

  // Simple string containment check for Nunjucks templates
  eleventyConfig.addFilter('stringContains', (value, substr) => {
    if (typeof value !== 'string' || typeof substr !== 'string') return false;
    return value.indexOf(substr) !== -1;
  });

  // Map local asset image paths to Cloudinary delivery URLs when needed
  function cdnImageImpl(src, transform) {
    if (!src || typeof src !== 'string') return '';
    const cloud = process.env.CLOUDINARY_CLOUD_NAME || 'christian-transhumanist-association';
    const base = `https://res.cloudinary.com/${cloud}/image/upload/`;
    const tf = (transform && typeof transform === 'string' && transform.trim()) ? transform.trim() : '';
    // Absolute URL
    if (/^https?:\/\//i.test(src)) {
      // If it's a Cloudinary URL, inject transform after /upload/
      if (src.includes(`/image/upload/`) && tf) {
        return src.replace('/image/upload/', `/image/upload/${tf}/`);
      }
      return src;
    }
    // Local asset path -> Cloudinary URL
    // strip leading slashes and common asset prefixes
    const file = src.replace(/^\/+/, '').replace(/^assets\/images\//, '').replace(/^src\/assets\/images\//, '');
    return tf ? `${base}${tf}/${file}` : `${base}${file}`;
  }
  eleventyConfig.addFilter('cdnImage', cdnImageImpl);
  eleventyConfig.addLiquidFilter('cdnImage', cdnImageImpl);
  eleventyConfig.addFilter("nameFromRSSAuthor", function(value) { 
        const regex = /\((.*)\)/;
        const found = value.match(regex);
        if(found && found[1]) {
          return found[1];
        } else {
          return value;
        }
    });

  eleventyConfig.addFilter("episodeNumberFromRSSGUID", function(value) { 
        if (!value) return '';
        try {
          const parsed = new URL(String(value));
          return parsed.pathname
            .replace(/^\/+/, '')
            .replace(/^christiantranshumanist\//, '')
            .replace(/\/+$/, '');
        } catch (e) {
          const regex = /.*\/christiantranshumanist\/(.*)/;
          const found = String(value).match(regex);
          if(found && found[1]) {
            return found[1].replace(/\/+$/, '');
          } else {
            return String(value).replace(/\/+$/, '');
          }
        }
    });

  // Text excerpt helper: strips HTML/Markdown links and truncates by words
  eleventyConfig.addFilter('excerpt', function (value, wordCount = 55) {
    if (!value || typeof value !== 'string') return '';
    let text = value
      // Strip HTML tags
      .replace(/<[^>]*>/g, ' ')
      // Convert wikilinks [[Page]] or [[Page|Text]] -> Text or Page
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, p1, p2) => (p2 || p1 || ''))
      // Convert Markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Collapse whitespace
      .replace(/\s+/g, ' ')
      .trim();
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '…';
  });

  eleventyConfig.addFilter('filterBooks', function (bookList, options = {}) {
    if (!Array.isArray(bookList)) return [];
    const opts = options && typeof options === 'object' ? options : {};
    let result = bookList.slice();

    const tagCriteria = normalizeListInput(opts.tag !== undefined ? opts.tag : opts.tags).map(tag => tag.toLowerCase());
    if (tagCriteria.length) {
      result = result.filter(book => {
        const bookTags = Array.isArray(book && book.tags) ? book.tags.map(tag => String(tag).toLowerCase()) : [];
        if (!bookTags.length) return false;
        return tagCriteria.some(tag => bookTags.includes(tag));
      });
    }

    const contributorCriteria = normalizeListInput(opts.contributor !== undefined ? opts.contributor : opts.contributors).map(name => name.toLowerCase());
    if (contributorCriteria.length) {
      result = result.filter(book => {
        const pool = gatherContributorNames(book).map(name => name.toLowerCase());
        if (!pool.length) return false;
        return contributorCriteria.some(target => pool.some(name => name.includes(target)));
      });
    }

    const shouldSort = opts.sort !== false;
    if (shouldSort) {
      result.sort((a, b) => {
        const at = String(a && a.title ? a.title : '').toLowerCase();
        const bt = String(b && b.title ? b.title : '').toLowerCase();
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      });
    }

    const limit = parseInt(opts.limit, 10);
    if (Number.isFinite(limit) && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  });

  eleventyConfig.setTemplateFormats([
    "md",
    "njk",
    "css" // css is not yet a recognized template extension in Eleventy
    ]);

  let options = {
    html: true,
    breaks: true
    };
  let markdownLibrary = markdownIt(options).use(markdownItFootnote).use(markdownItAttrs).use(markdownItAnchor);
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Render arbitrary Markdown strings inside templates (for YAML-provided content)
  const renderMarkdown = (str) => {
    try { return markdownLibrary.render(String(str || '')); }
    catch (_) { return String(str || ''); }
  };
  eleventyConfig.addFilter('md', renderMarkdown);
  eleventyConfig.addLiquidFilter('md', renderMarkdown);

  eleventyConfig.addShortcode('renderMarkdownFile', function(relPath) {
    try {
      if (!relPath) return '';
      const fullPath = path.join(process.cwd(), String(relPath));
      const raw = fs.readFileSync(fullPath, 'utf8');
      const parsed = matter(raw);
      const body = parsed && typeof parsed.content === 'string' ? parsed.content : raw;
      return renderMarkdown(body);
    } catch (_) {
      return '';
    }
  });

  // Inline Markdown (no surrounding <p>), for headings and labels
  const renderMarkdownInline = (str) => {
    try { return markdownLibrary.renderInline(String(str || '')); }
    catch (_) { return String(str || ''); }
  };
  eleventyConfig.addFilter('mdInline', renderMarkdownInline);
  eleventyConfig.addLiquidFilter('mdInline', renderMarkdownInline);

  // Collection: all Obsidian notes
  eleventyConfig.addCollection('obsidian', (collectionApi) => {
    const items = collectionApi.getAll().filter(item => {
      const ip = (item && item.inputPath) ? String(item.inputPath).replace(/\\/g, '/') : '';
      if (!ip.includes(`/src/${WIKI_SEGMENT}/`)) return false;
      // Ignore anything under the wiki templates directory
      if (ip.includes(`/src/${WIKI_SEGMENT}/templates/`)) return false;
      // Exclude any blog posts mirrored into the vault (they'll still be linkable via the index)
      if (ip.includes(`/src/${WIKI_SEGMENT}/posts/`)) return false;
      // Exclude internal board notes from public wiki listings
      if (ip.includes(`/src/${WIKI_SEGMENT}/board/`)) return false;
      // Exclude the index page itself if present
      if (ip.endsWith(`/src/${WIKI_SEGMENT}/index.njk`) || ip.endsWith(`/src/${WIKI_SEGMENT}/index.md`)) return false;
      return true;
    });
    // Sort by computed title then by URL for stability
    items.sort((a, b) => {
      const at = (a.data && a.data.title ? a.data.title : a.fileSlug || '').toLowerCase();
      const bt = (b.data && b.data.title ? b.data.title : b.fileSlug || '').toLowerCase();
      if (at < bt) return -1; if (at > bt) return 1;
      const au = (a.url || '').toLowerCase();
      const bu = (b.url || '').toLowerCase();
      if (au < bu) return -1; if (au > bu) return 1; return 0;
    });
    return items;
  });

  // --- Obsidian Wikilink support ---
  function collectWikiAssets(rootDir) {
    const base = path.join(process.cwd(), rootDir);
    const assets = [];

    function walk(dir) {
      const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          if (ent.name && ent.name.toLowerCase() === 'templates') continue;
          walk(full);
        } else if (ent.isFile()) {
          const ext = path.extname(ent.name).toLowerCase();
          if (!WIKI_ASSET_EXTENSIONS.has(ext)) continue;
          const relFromBase = posixPath(path.relative(base, full));
          const relFromRoot = posixPath(path.relative(process.cwd(), full));
          const outputRelative = posixPath(path.posix.join(WIKI_ASSET_OUTPUT_DIR, relFromBase));
          const href = WIKI_ASSET_URL_PREFIX + relFromBase.split('/').map(encodeURIComponent).join('/');
          const stem = path.basename(ent.name, ext);
          const keys = new Set([
            relFromBase,
            relFromBase.toLowerCase(),
            ent.name,
            ent.name.toLowerCase(),
            stem,
            stem.toLowerCase(),
            toSlugBase(stem),
          ]);
          assets.push({ relFromBase, relFromRoot, outputRelative, href, keys });
        }
      }
    }

    walk(base);
    return assets;
  }

  function findWikiAssetHref(key) {
    if (!key) return null;
    const trimmed = key.trim();
    if (!trimmed) return null;
    const direct = wikiAssetLookup.get(trimmed);
    if (direct) return direct;
    const lower = wikiAssetLookup.get(trimmed.toLowerCase());
    if (lower) return lower;
    if (!trimmed.includes('.')) {
      const slugged = toSlugBase(trimmed);
      if (wikiAssetLookup.has(slugged)) return wikiAssetLookup.get(slugged);
    }
    return null;
  }

  // Build a lookup of Obsidian note names -> output URLs
  function buildObsidianIndex(rootDir) {
    const base = path.join(process.cwd(), rootDir);
    const index = new Map();

    function walk(dir) {
      const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          // Skip templates directory
          if (ent.name && ent.name.toLowerCase() === 'templates') continue;
          walk(full);
        } else if (ent.isFile() && /\.md$/i.test(ent.name)) {
          try {
            const raw = fs.readFileSync(full, 'utf8');
            const parsed = matter(raw);
            const rel = path.relative(base, full);
            const nameNoExt = path.basename(ent.name, path.extname(ent.name));
            const relNorm = String(rel).replace(/\\/g, '/');
            // Ignore files under templates/
            if (relNorm.toLowerCase().startsWith('templates/')) continue;

            // Determine output URL
            let url = '';
            if (parsed.data && typeof parsed.data.permalink === 'string' && parsed.data.permalink.trim()) {
              const p = parsed.data.permalink.trim();
              url = p.startsWith('/') ? p : `/${p}`;
              // Ensure trailing slash for clean URLs
              if (!url.endsWith('/')) url = url + '/';
            } else {
              // Default URL logic
              // If file is under cta-wiki/board, mirror nested path under /board/
              if (relNorm.toLowerCase().startsWith('board/')) {
                const withoutExt = relNorm.replace(/\.md$/i, '');
                const segs = withoutExt.split('/').slice(1); // skip leading 'board'
                const slugged = segs.map(s => toSlugBase(s));
                url = `/board/${slugged.join('/')}/`;
              } else {
                // Otherwise put under /wiki/
                let slug = toSlugBase(nameNoExt);
                url = `/wiki/${slug}/`;
              }
            }

            const keys = new Set([
              nameNoExt,
              nameNoExt.toLowerCase(),
              toSlugBase(nameNoExt),
            ]);
            if (parsed.data && typeof parsed.data.title === 'string' && parsed.data.title.trim()) {
              const t = parsed.data.title.trim();
              keys.add(t);
              keys.add(t.toLowerCase());
              keys.add(toSlugBase(t));
            }
            // Also allow matching by relative path without extension (last segment)
            const relNoExt = rel.replace(/\\/g, '/').replace(/\.md$/i, '');
            const lastSeg = relNoExt.split('/').pop();
            if (lastSeg) {
              keys.add(lastSeg);
              keys.add(lastSeg.toLowerCase());
              keys.add(toSlugBase(lastSeg));
            }

            for (const k of keys) {
              if (!index.has(k)) index.set(k, url);
            }
          } catch (_) {
            // ignore parse errors for non-front-matter files
          }
        }
      }
    }

    walk(base);
    return index;
  }

  const obsidianIndex = buildObsidianIndex(WIKI_ROOT);

  const wikiAssets = collectWikiAssets(WIKI_ROOT);
  for (const asset of wikiAssets) {
    eleventyConfig.addPassthroughCopy({ [asset.relFromRoot]: asset.outputRelative });
    for (const key of asset.keys) {
      if (!key) continue;
      if (!wikiAssetLookup.has(key)) wikiAssetLookup.set(key, asset.href);
    }
  }

  // Build a quick lookup to know if a given Obsidian file set an explicit permalink in frontmatter
  function buildObsidianFileMeta(rootDir) {
    const base = path.join(process.cwd(), rootDir);
    const meta = new Map(); // key: normalized inputPath (posix), value: { hasExplicitPermalink }
    function walk(dir) {
      const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          if (ent.name && ent.name.toLowerCase() === 'templates') continue;
          walk(full);
        } else if (ent.isFile() && /\.md$/i.test(ent.name)) {
          try {
            const raw = fs.readFileSync(full, 'utf8');
            const parsed = matter(raw);
            const hasExplicitPermalink = !!(parsed.data && typeof parsed.data.permalink === 'string' && parsed.data.permalink.trim());
            // Normalize to workspace-relative posix path like 'src/cta-wiki/…'
            const rel = path.relative(process.cwd(), full).replace(/\\/g, '/');
            // Ignore files under the wiki templates directory
            if (rel.includes(`/src/${WIKI_SEGMENT}/templates/`)) continue;
            meta.set(rel, { hasExplicitPermalink });
          } catch (_) { /* ignore */ }
        }
      }
    }
    walk(base);
    return meta;
  }

  const obsidianFileMeta = buildObsidianFileMeta(WIKI_ROOT);

  eleventyConfig.addFilter('obsidianHasExplicitPermalink', function(inputPath) {
    if (!inputPath) return false;
    const key = String(inputPath).replace(/^[.][/\\]/, '').replace(/\\/g, '/');
    const m = obsidianFileMeta.get(key);
    return !!(m && m.hasExplicitPermalink);
  });

  // Build backlinks for Obsidian notes based on wikilinks
  function buildObsidianBacklinks(rootDir, index) {
    const base = path.join(process.cwd(), rootDir);
    const backlinks = new Map(); // targetUrl -> [{ url, title, count, snippets, anchorTexts }]
    const outbound = new Map(); // sourceUrl -> [{ url, count, snippets, anchorTexts }]
    const pageMeta = new Map(); // url -> { title }

    function toUrlForFile(fullPath) {
      try {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const parsed = matter(raw);
        const rel = path.relative(base, fullPath).replace(/\\/g, '/');
        const nameNoExt = path.basename(fullPath, path.extname(fullPath));
        let url = '';
        if (parsed.data && typeof parsed.data.permalink === 'string' && parsed.data.permalink.trim()) {
          const p = parsed.data.permalink.trim();
          url = p.startsWith('/') ? p : `/${p}`;
          if (!url.endsWith('/')) url = url + '/';
        } else {
          if (rel.toLowerCase().startsWith('board/')) {
            const withoutExt = rel.replace(/\.md$/i, '');
            const segs = withoutExt.split('/').slice(1);
            const slugged = segs.map(s => toSlugBase(s));
            url = `/board/${slugged.join('/')}/`;
          } else {
            url = `/wiki/${toSlugBase(nameNoExt)}/`;
          }
        }
        const title = (parsed.data && typeof parsed.data.title === 'string' && parsed.data.title.trim())
          ? parsed.data.title.trim()
          : nameNoExt;
        const dataText = (() => {
          const acc = [];
          function collect(v) {
            if (!v) return;
            if (typeof v === 'string') { acc.push(v); return; }
            if (Array.isArray(v)) { for (const x of v) collect(x); return; }
            if (typeof v === 'object') { for (const k of Object.keys(v)) collect(v[k]); }
          }
          collect(parsed.data);
          return acc.join('\n\n');
        })();
        const meta = { url, title, content: parsed.content || '', dataText };
        if (url) pageMeta.set(url, { title });
        return meta;
      } catch (_) {
        return null;
      }
    }

    function makeSnippet(sourceText, index, length) {
      if (!sourceText) return '';
      try {
        // Strip simple Markdown constructs BEFORE slicing to avoid cutting mid-syntax
        let cleanText = sourceText
          .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
          .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, p1, p2) => (p2 || p1 || ''))
          .replace(/\[[^\]]+\]\([^)]*\)/g, (m) => {
            const inner = m.match(/\[([^\]]+)\]/);
            return inner && inner[1] ? inner[1] : '';
          });
        const radius = 140;
        const start = Math.max(0, index - radius);
        const end = Math.min(cleanText.length, index + length + radius);
        let snippet = cleanText.slice(start, end).replace(/\s+/g, ' ').trim();
        if (!snippet) return '';
        if (start > 0) snippet = '…' + snippet;
        if (end < cleanText.length) snippet = snippet + '…';
        return snippet;
      } catch (_) {
        return '';
      }
    }

    function registerLink(fromItem, targetUrl, meta = {}) {
      if (!targetUrl || !fromItem || !fromItem.url) return;

      const payload = {
        snippet: meta.snippet || '',
        anchorText: meta.anchorText || '',
        type: meta.type || 'link'
      };

      // Inbound storage (backlinks)
      const inboundList = backlinks.get(targetUrl) || [];
      let inboundEntry = inboundList.find(x => x.url === fromItem.url);
      if (!inboundEntry) {
        inboundEntry = {
          url: fromItem.url,
          title: fromItem.title,
          count: 0,
          snippets: [],
          anchorTexts: [],
          types: [],
        };
        inboundList.push(inboundEntry);
      }
      inboundEntry.count += 1;
      if (payload.snippet) inboundEntry.snippets.push(payload.snippet);
      if (payload.anchorText) inboundEntry.anchorTexts.push(payload.anchorText);
      if (payload.type && !inboundEntry.types.includes(payload.type)) inboundEntry.types.push(payload.type);
      inboundEntry.snippet = inboundEntry.snippets[0] || '';
      inboundEntry.anchorText = inboundEntry.anchorTexts[inboundEntry.anchorTexts.length - 1] || '';
      inboundEntry.score = inboundEntry.count;
      backlinks.set(targetUrl, inboundList);

      // Outbound storage (links from the current page)
      const outboundList = outbound.get(fromItem.url) || [];
      let outboundEntry = outboundList.find(x => x.url === targetUrl);
      if (!outboundEntry) {
        outboundEntry = {
          url: targetUrl,
          count: 0,
          snippets: [],
          anchorTexts: [],
          types: [],
        };
        outboundList.push(outboundEntry);
      }
      outboundEntry.count += 1;
      if (payload.snippet) outboundEntry.snippets.push(payload.snippet);
      if (payload.anchorText) outboundEntry.anchorTexts.push(payload.anchorText);
      if (payload.type && !outboundEntry.types.includes(payload.type)) outboundEntry.types.push(payload.type);
      outboundEntry.snippet = outboundEntry.snippets[0] || '';
      outboundEntry.anchorText = outboundEntry.anchorTexts[outboundEntry.anchorTexts.length - 1] || '';
      outboundEntry.score = outboundEntry.count;
      outbound.set(fromItem.url, outboundList);
    }

    function normalizeHref(href) {
      try {
        let h = String(href || '').trim();
        // Strip protocol/host if absolute to our own domain (best effort: keep path from first '/')
        const firstSlash = h.indexOf('/');
        if (/^https?:\/\//i.test(h) && firstSlash !== -1) {
          h = h.slice(h.indexOf('/', h.indexOf('//') + 2));
        }
        if (!h.startsWith('/')) return null; // only consider site-root links
        // Drop any query or hash
        h = h.split('#')[0].split('?')[0];
        if (!h.endsWith('/')) h = h + '/';
        return h;
      } catch (_) { return null; }
    }

    function walk(dir) {
      const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          if (ent.name && ent.name.toLowerCase() === 'templates') continue;
          walk(full);
        } else if (ent.isFile() && /\.md$/i.test(ent.name)) {
          // Ignore files under templates/
          const relFromBase = path.relative(base, full).replace(/\\/g, '/');
          if (relFromBase.toLowerCase().startsWith('templates/')) continue;
          const from = toUrlForFile(full);
          if (!from) continue;
          const content = String(from.content);
          const extra = String(from.dataText || '');
          const fromUrl = from.url;
          const fromTitle = from.title;
          if (fromUrl) {
            if (!pageMeta.has(fromUrl)) pageMeta.set(fromUrl, { title: fromTitle });
          }
          // Wikilinks [[...]]
          const rx = /\[\[([^\]]+)\]\]/g;
          let m;
          while ((m = rx.exec(content)) !== null) {
            let target = m[1] || '';
            let display = '';
            const pipe = target.indexOf('|');
            if (pipe !== -1) {
              display = target.slice(pipe + 1);
              target = target.slice(0, pipe);
            }
            const hash = target.indexOf('#');
            if (hash !== -1) target = target.slice(0, hash);
            const key = target.trim();
            if (!key) continue;
            const url = index.get(key) || index.get(key.toLowerCase()) || index.get(toSlugBase(key));
            if (url && url !== from.url) {
              const anchorText = (display && display.trim()) || key;
              const snippet = makeSnippet(content, m.index, m[0].length);
              registerLink(from, url, { anchorText, snippet, type: 'wikilink' });
            }
          }

          // Markdown links [text](href) — skip images ![alt](href)
          const md = /(!)?\[[^\]]+\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g;
          let m2;
          while ((m2 = md.exec(content)) !== null) {
            if (m2[1] === '!') continue; // image
            const href = m2[2];
            const norm = normalizeHref(href);
            if (norm && norm !== from.url) {
              const anchorText = (() => {
                try {
                  const textMatch = m2[0].match(/\[([^\]]+)\]/);
                  return textMatch && textMatch[1] ? textMatch[1] : '';
                } catch (_) { return ''; }
              })();
              const snippet = makeSnippet(content, m2.index, m2[0].length);
              registerLink(from, norm, { anchorText, snippet, type: 'markdown' });
            }
          }

          // Also parse front matter strings (e.g., FAQ answers/questions)
          if (extra) {
            let m3;
            const rx2 = /\[\[([^\]]+)\]\]/g;
            while ((m3 = rx2.exec(extra)) !== null) {
              let target = m3[1] || '';
              let display = '';
              const pipe = target.indexOf('|');
              if (pipe !== -1) {
                display = target.slice(pipe + 1);
                target = target.slice(0, pipe);
              }
              const hash = target.indexOf('#');
              if (hash !== -1) target = target.slice(0, hash);
              const key = target.trim();
              if (!key) continue;
              const url = index.get(key) || index.get(key.toLowerCase()) || index.get(toSlugBase(key));
              if (url && url !== from.url) {
                const anchorText = (display && display.trim()) || key;
                const snippet = makeSnippet(extra, m3.index, m3[0].length);
                registerLink(from, url, { anchorText, snippet, type: 'wikilink' });
              }
            }
            const md2 = /(!)?\[[^\]]+\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g;
            let m4;
            while ((m4 = md2.exec(extra)) !== null) {
              if (m4[1] === '!') continue;
              const href = m4[2];
              const norm = normalizeHref(href);
              if (norm && norm !== from.url) {
                const anchorText = (() => {
                  try {
                    const textMatch = m4[0].match(/\[([^\]]+)\]/);
                    return textMatch && textMatch[1] ? textMatch[1] : '';
                  } catch (_) { return ''; }
                })();
                const snippet = makeSnippet(extra, m4.index, m4[0].length);
                registerLink(from, norm, { anchorText, snippet, type: 'markdown' });
              }
            }
          }
        }
      }
    }

    walk(base);
    return { backlinks, outbound, pageMeta };
  }

  const { backlinks: obsidianBacklinks, outbound: obsidianOutbound, pageMeta: obsidianPageMeta } = buildObsidianBacklinks(WIKI_ROOT, obsidianIndex);

  function normalizeUrlKey(url) {
    if (!url) return '';
    let key = String(url).split('#')[0].split('?')[0];
    if (!key.endsWith('/')) key = key + '/';
    return key;
  }

  function mergeEntry(target, source) {
    if (!source) return target;
    target.title = target.title || source.title;
    target.count = (target.count || 0) + (source.count || 0) || 1;
    target.score = (target.score || 0) + (source.score || source.count || 0) || target.count;
    if (Array.isArray(source.snippets) && source.snippets.length) {
      target.snippets = (target.snippets || []).concat(source.snippets);
    } else if (source.snippet) {
      target.snippets = (target.snippets || []).concat([source.snippet]);
    }
    if (Array.isArray(source.anchorTexts) && source.anchorTexts.length) {
      target.anchorTexts = (target.anchorTexts || []).concat(source.anchorTexts);
    } else if (source.anchorText) {
      target.anchorTexts = (target.anchorTexts || []).concat([source.anchorText]);
    }
    const existingTypes = new Set(target.types || []);
    if (Array.isArray(source.types)) {
      for (const t of source.types) existingTypes.add(t);
    } else if (source.type) {
      existingTypes.add(source.type);
    }
    target.types = Array.from(existingTypes);
    target.snippet = target.snippet || (target.snippets && target.snippets[0]) || '';
    target.anchorText = target.anchorText || (target.anchorTexts && target.anchorTexts[target.anchorTexts.length - 1]) || '';
    return target;
  }

  function collectFromMap(map, key) {
    if (!map || !key) return [];
    const list = map.get(key);
    return Array.isArray(list) ? list : [];
  }

  eleventyConfig.addFilter('obsidianBacklinks', function(pageUrl) {
    if (!pageUrl) return [];
    try {
      const key = normalizeUrlKey(pageUrl);
      const variants = [key];
      if (key.includes('/wiki/')) variants.push(key.replace('/wiki/', WIKI_RAW_PREFIX));
      else if (key.includes(WIKI_RAW_PREFIX)) variants.push(key.replace(WIKI_RAW_PREFIX, '/wiki/'));

      const seen = new Map();
      for (const variant of variants) {
        const list = collectFromMap(obsidianBacklinks, variant);
        for (const rawItem of list) {
          if (!rawItem || !rawItem.url) continue;
          const normalizedUrl = normalizeUrlKey(rawItem.url);
          const existing = seen.get(normalizedUrl) || { url: normalizedUrl };
          mergeEntry(existing, JSON.parse(JSON.stringify(rawItem)));
          seen.set(normalizedUrl, existing);
        }
      }

      const outboundSeen = new Map();
      for (const variant of variants) {
        const list = collectFromMap(obsidianOutbound, variant);
        for (const raw of list) {
          if (!raw || !raw.url) continue;
          const normalizedUrl = normalizeUrlKey(raw.url);
          const existing = outboundSeen.get(normalizedUrl) || { url: normalizedUrl };
          mergeEntry(existing, JSON.parse(JSON.stringify(raw)));
          outboundSeen.set(normalizedUrl, existing);
        }
      }

      const results = Array.from(seen.values()).map(entry => {
        entry.count = entry.count || 1;
        entry.snippet = entry.snippet || '';
        entry.score = entry.score || entry.count;
        const outboundEntry = outboundSeen.get(entry.url);
        entry.outboundCount = outboundEntry ? outboundEntry.count || 0 : 0;
        entry.isMutual = !!outboundEntry;
        if (entry.isMutual) entry.score += Math.max(1, entry.outboundCount);
        entry.isStrong = entry.count >= 2;
        entry.isFeatured = entry.isStrong || entry.isMutual;
        entry.badgeCount = entry.count > 1 ? entry.count : null;
        return entry;
      });

      results.sort((a, b) => {
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
        const at = (a.title || '').toLowerCase();
        const bt = (b.title || '').toLowerCase();
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      });

      return results;
    } catch (_) {
      return [];
    }
  });

  eleventyConfig.addFilter('obsidianOutbound', function(pageUrl) {
    if (!pageUrl) return [];
    try {
      const key = normalizeUrlKey(pageUrl);
      const variants = [key];
      if (key.includes('/wiki/')) variants.push(key.replace('/wiki/', WIKI_RAW_PREFIX));
      else if (key.includes(WIKI_RAW_PREFIX)) variants.push(key.replace(WIKI_RAW_PREFIX, '/wiki/'));

      const seen = new Map();
      for (const variant of variants) {
        const list = collectFromMap(obsidianOutbound, variant);
        for (const raw of list) {
          if (!raw || !raw.url) continue;
          const normalizedUrl = normalizeUrlKey(raw.url);
          const existing = seen.get(normalizedUrl) || { url: normalizedUrl };
          mergeEntry(existing, JSON.parse(JSON.stringify(raw)));
          seen.set(normalizedUrl, existing);
        }
      }

      const results = Array.from(seen.values()).map(entry => {
        const meta = obsidianPageMeta.get(entry.url);
        entry.title = entry.title || (meta && meta.title) || entry.title || (function deriveTitle(url) {
          const parts = (url || '').split('/').filter(Boolean);
          if (!parts.length) return url || '';
          const last = parts[parts.length - 1].replace(/[-_]/g, ' ');
          return last.charAt(0).toUpperCase() + last.slice(1);
        })(entry.url);
        entry.count = entry.count || 1;
        entry.score = entry.score || entry.count;
        entry.snippet = entry.snippet || '';
        entry.badgeCount = entry.count > 1 ? entry.count : null;
        entry.isStrong = entry.count >= 2;
        entry.isFeatured = entry.isStrong;
        return entry;
      });

      results.sort((a, b) => {
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
        const at = (a.title || '').toLowerCase();
        const bt = (b.title || '').toLowerCase();
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      });

      return results;
    } catch (_) {
      return [];
    }
  });

  // Expose a filter to resolve Obsidian-style wikilinks in arbitrary strings
  function resolveWikilinksInHtml(content) {
    if (!content || typeof content !== 'string') return content;

    function resolveTarget(target) {
      const decoded = decodeHtmlEntities(target);
      let display = null;
      let page = decoded;
      const pipe = decoded.indexOf('|');
      if (pipe !== -1) {
        page = decoded.slice(0, pipe);
        display = decoded.slice(pipe + 1);
      }
      let anchor = '';
      const hash = page.indexOf('#');
      if (hash !== -1) {
        anchor = page.slice(hash + 1).trim();
        page = page.slice(0, hash);
      }
      const key = page.trim();
      const url = obsidianIndex.get(key) || obsidianIndex.get(key.toLowerCase()) || obsidianIndex.get(toSlugBase(key));
      const assetHref = findWikiAssetHref(key);
      const hasUrl = !!url;
      const href = hasUrl ? (url + (anchor ? `#${toSlugBase(anchor)}` : '')) : (assetHref || '#');
      const text = (display && display.trim()) || key;
      const exists = hasUrl || !!assetHref;
      return { href, text, exists, key, isAsset: !hasUrl && !!assetHref };
    }

    // Images: ![[file|alt]] or ![[file]]
    content = content.replace(/!\[\[([^\]]+)\]\]/g, (m, inner) => {
      const { href } = resolveTarget(inner);
      if (/^\//.test(href)) {
        return `<img src="${href}" alt="" />`;
      }
      return m;
    });

    // Links: [[Page]] or [[Page|Text]] or with anchors
    content = content.replace(/\[\[([^\]]+)\]\]/g, (m, inner) => {
      const { href, text, exists, key } = resolveTarget(inner);
      if (exists) {
        return `<a href="${href}">${text}</a>`;
      }
      return `<span class="wikilink-missing" title="Missing note: ${key}">${text}</span>`;
    });

    // Convert .md links to proper URLs
    content = content.replace(/<a\s+([^>]*?)href=\"([^\"]+?\.md)(#[^\"]*)?\"([^>]*)>(.*?)<\/a>/gi, (m, pre, href, frag = '', post, text) => {
      try {
        const decoded = decodeURIComponent(href);
        const file = decoded.replace(/^.*\//, '');
        const nameNoExt = file.replace(/\.md$/i, '');
        const url = obsidianIndex.get(nameNoExt) || obsidianIndex.get(nameNoExt.toLowerCase()) || obsidianIndex.get(toSlugBase(nameNoExt));
        if (url) {
          const finalHref = url + (frag ? frag : '');
          return `<a ${pre}href="${finalHref}"${post}>${text}</a>`;
        }
      } catch (_) {}
      return m;
    });

    return content;
  }
  eleventyConfig.addFilter('wikilinks', resolveWikilinksInHtml);
  eleventyConfig.addLiquidFilter('wikilinks', resolveWikilinksInHtml);

  // Replace Obsidian-style wikilinks [[Page|Text]] and [[Page#Anchor]] in final HTML
  eleventyConfig.addTransform('obsidian-wikilinks', function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html') || typeof content !== 'string') return content;

    function resolveTarget(target) {
      const decoded = decodeHtmlEntities(target);
      // Split alias text
      let display = null;
      let page = decoded;
      const pipe = decoded.indexOf('|');
      if (pipe !== -1) {
        page = decoded.slice(0, pipe);
        display = decoded.slice(pipe + 1);
      }
      // Extract anchor if present
      let anchor = '';
      const hash = page.indexOf('#');
      if (hash !== -1) {
        anchor = page.slice(hash + 1).trim();
        page = page.slice(0, hash);
      }
      const key = page.trim();
      const url = obsidianIndex.get(key) || obsidianIndex.get(key.toLowerCase()) || obsidianIndex.get(toSlugBase(key));
      const assetHref = findWikiAssetHref(key);
      const hasUrl = !!url;
      const href = hasUrl ? (url + (anchor ? `#${toSlugBase(anchor)}` : '')) : (assetHref || '#');
      const text = (display && display.trim()) || key;
      const exists = hasUrl || !!assetHref;
      return { href, text, exists, key, isAsset: !hasUrl && !!assetHref };
    }

    // Images: ![[file|alt]] or ![[file]] — best-effort: map to /assets or pass through as-is
    content = content.replace(/!\[\[([^\]]+)\]\]/g, (m, inner) => {
      const { href } = resolveTarget(inner);
      // If href points to a page, we can't embed as image; return original
      if (/^\//.test(href)) {
        return `<img src="${href}" alt="" />`;
      }
      return m;
    });

    // Links: [[Page]] or [[Page|Text]] or with anchors
    content = content.replace(/\[\[([^\]]+)\]\]/g, (m, inner) => {
      const { href, text, exists, key } = resolveTarget(inner);
      if (exists) {
        return `<a href="${href}">${text}</a>`;
      }
      // Missing target: render a styled non-link indicator
      return `<span class="wikilink-missing" title="Missing note: ${key}">${text}</span>`;
    });

    // Convert .md links produced by Obsidian exports to proper URLs
    // Example: <a href="Theological%20Mission.md"> -> <a href="/mission-2/theological/">
    content = content.replace(/<a\s+([^>]*?)href=\"([^\"]+?\.md)(#[^\"]*)?\"([^>]*)>(.*?)<\/a>/gi, (m, pre, href, frag = '', post, text) => {
      try {
        const decoded = decodeURIComponent(href);
        const file = decoded.replace(/^.*\//, ''); // strip any relative path
        const nameNoExt = file.replace(/\.md$/i, '');
        const url = obsidianIndex.get(nameNoExt) || obsidianIndex.get(nameNoExt.toLowerCase()) || obsidianIndex.get(toSlugBase(nameNoExt));
        if (url) {
          const finalHref = url + (frag ? frag : '');
          return `<a ${pre}href="${finalHref}"${post}>${text}</a>`;
        }
      } catch (_) { /* ignore */ }
      return m;
    });

    return content;
  });

  // Static assets passthrough (images, downloads, etc.)
  // Place files under `src/assets/` and reference them at `/assets/...` in templates.
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  return {
    dir: {
      input: "src",
      includes: "_includes"
    },
    "rootUrl" : "https://www.christiantranshumanism.com",
    "disqusShortname" : "christiantranshumanism",
  }
};
