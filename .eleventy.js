const markdownIt = require("markdown-it");
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');

const format = require('date-fns/format')
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
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
        const regex = /.*\/christiantranshumanist\/(.*)/;
        const found = value.match(regex);
        if(found && found[1]) {
          return found[1];
        } else {
          return value;
        }
    });

  // Text excerpt helper: strips HTML/Markdown links and truncates by words
  eleventyConfig.addFilter('excerpt', function (value, wordCount = 55) {
    if (!value || typeof value !== 'string') return '';
    let text = value
      // Strip HTML tags
      .replace(/<[^>]*>/g, ' ')
      // Convert Markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Collapse whitespace
      .replace(/\s+/g, ' ')
      .trim();
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '…';
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

  // Collection: all Obsidian notes
  eleventyConfig.addCollection('obsidian', (collectionApi) => {
    const items = collectionApi.getAll().filter(item => {
      const ip = (item && item.inputPath) ? String(item.inputPath).replace(/\\/g, '/') : '';
      if (!ip.includes('/src/obsidian/')) return false;
      // Ignore anything under src/obsidian/templates/
      if (ip.includes('/src/obsidian/templates/')) return false;
      // Exclude the index page itself if present
      if (ip.endsWith('/src/obsidian/index.njk') || ip.endsWith('/src/obsidian/index.md')) return false;
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
  function toSlugBase(str) {
    const s = slugify(String(str || '').replace(/[–—]/g, '-'), { lower: true, strict: true });
    return s || 'note';
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
              // If file is under obsidian/board, mirror nested path under /board/
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

  const obsidianIndex = buildObsidianIndex('src/obsidian');

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
            // Normalize to workspace-relative posix path like 'src/obsidian/…'
            const rel = path.relative(process.cwd(), full).replace(/\\/g, '/');
            // Ignore files under src/obsidian/templates/
            if (rel.includes('/src/obsidian/templates/')) continue;
            meta.set(rel, { hasExplicitPermalink });
          } catch (_) { /* ignore */ }
        }
      }
    }
    walk(base);
    return meta;
  }

  const obsidianFileMeta = buildObsidianFileMeta('src/obsidian');

  eleventyConfig.addFilter('obsidianHasExplicitPermalink', function(inputPath) {
    if (!inputPath) return false;
    const key = String(inputPath).replace(/^[.][/\\]/, '').replace(/\\/g, '/');
    const m = obsidianFileMeta.get(key);
    return !!(m && m.hasExplicitPermalink);
  });

  // Build backlinks for Obsidian notes based on wikilinks
  function buildObsidianBacklinks(rootDir, index) {
    const base = path.join(process.cwd(), rootDir);
    const backlinks = new Map(); // targetUrl -> [{ url, title }]

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
        return { url, title, content: parsed.content || '' };
      } catch (_) {
        return null;
      }
    }

    function addBacklink(targetUrl, fromItem) {
      if (!targetUrl || !fromItem) return;
      const arr = backlinks.get(targetUrl) || [];
      // Deduplicate by URL
      if (!arr.some(x => x.url === fromItem.url)) arr.push({ url: fromItem.url, title: fromItem.title });
      backlinks.set(targetUrl, arr);
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
          // Wikilinks [[...]]
          const rx = /\[\[([^\]]+)\]\]/g;
          let m;
          while ((m = rx.exec(content)) !== null) {
            let target = m[1] || '';
            const pipe = target.indexOf('|');
            if (pipe !== -1) target = target.slice(0, pipe);
            const hash = target.indexOf('#');
            if (hash !== -1) target = target.slice(0, hash);
            const key = target.trim();
            if (!key) continue;
            const url = index.get(key) || index.get(key.toLowerCase()) || index.get(toSlugBase(key));
            if (url && url !== from.url) addBacklink(url, from);
          }

          // Markdown links [text](href) — skip images ![alt](href)
          const md = /(!)?\[[^\]]+\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g;
          let m2;
          while ((m2 = md.exec(content)) !== null) {
            if (m2[1] === '!') continue; // image
            const href = m2[2];
            const norm = normalizeHref(href);
            if (norm && norm !== from.url) addBacklink(norm, from);
          }
        }
      }
    }

    walk(base);
    return backlinks;
  }

  const obsidianBacklinks = buildObsidianBacklinks('src/obsidian', obsidianIndex);

  eleventyConfig.addFilter('obsidianBacklinks', function(pageUrl) {
    if (!pageUrl) return [];
    try {
      let key = String(pageUrl).split('#')[0].split('?')[0];
      if (!key.endsWith('/')) key = key + '/';
      const results = [];
      const seen = new Set();
      function pushAll(list) {
        if (!Array.isArray(list)) return;
        for (const item of list) {
          const sig = item && item.url ? item.url : JSON.stringify(item);
          if (!seen.has(sig)) { seen.add(sig); results.push(item); }
        }
      }
      // Direct key
      pushAll(obsidianBacklinks.get(key));
      // Cross-prefix fallback between /wiki/ and /obsidian/
      if (key.includes('/wiki/')) {
        pushAll(obsidianBacklinks.get(key.replace('/wiki/', '/obsidian/')));
      } else if (key.includes('/obsidian/')) {
        pushAll(obsidianBacklinks.get(key.replace('/obsidian/', '/wiki/')));
      }
      return results.sort((a, b) => a.title.localeCompare(b.title));
    } catch (_) {
      return [];
    }
  });

  // Replace Obsidian-style wikilinks [[Page|Text]] and [[Page#Anchor]] in final HTML
  eleventyConfig.addTransform('obsidian-wikilinks', function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html') || typeof content !== 'string') return content;

    function resolveTarget(target) {
      // Split alias text
      let display = null;
      let page = target;
      const pipe = target.indexOf('|');
      if (pipe !== -1) {
        page = target.slice(0, pipe);
        display = target.slice(pipe + 1);
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
      const exists = !!url;
      const href = exists ? (url + (anchor ? `#${toSlugBase(anchor)}` : '')) : '#';
      const text = (display && display.trim()) || key;
      return { href, text, exists, key };
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
