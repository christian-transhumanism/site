const slugify = require('slugify');

const WIKI_SEGMENT = 'cta-wiki';
const BOARD_PREFIX = '/board/';

function toSlugBase(str) {
  const s = slugify(String(str || '').replace(/[–—]/g, '-'), { lower: true, strict: true });
  return s || 'note';
}

function humanizeTitle(str) {
  const base = String(str || '')
    .replace(/[\-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!base) return 'Untitled';
  return base.replace(/\b\w/g, c => c.toUpperCase());
}

function normalizePermalink(permalink) {
  if (permalink === undefined || permalink === null) return '';
  let value = String(permalink).trim();
  if (!value) return '';

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value)) {
    try {
      const parsed = new URL(value);
      value = parsed.pathname || '/';
    } catch (_) {
      const schemeIdx = value.indexOf('//');
      if (schemeIdx !== -1) {
        const slashIdx = value.indexOf('/', schemeIdx + 2);
        value = slashIdx !== -1 ? value.slice(slashIdx) : '/';
      }
    }
  }

  value = value.split('#')[0].split('?')[0];
  if (!value) return '';
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/{2,}/g, '/');
  if (/\/index\.html$/i.test(value)) {
    value = value.replace(/\/index\.html$/i, '/');
  }
  if (value !== '/' && !value.endsWith('/')) value = `${value}/`;
  return value;
}

function computeDefaultPermalink(data) {
  const stem = (data.page && data.page.filePathStem) ? String(data.page.filePathStem) : '';
  const parts = stem.replace(/^\/+/, '').split('/');
  const wikiIdx = parts.indexOf(WIKI_SEGMENT);
  const after = wikiIdx >= 0 ? parts.slice(wikiIdx + 1) : parts;

  if (after.length === 0) return '/wiki/';

  if (after[0] && after[0].toLowerCase() === 'board') {
    const segs = after.slice(1);
    const slugged = segs.map(s => toSlugBase(s));
    return `/board/${slugged.join('/')}/`;
  }

  const fileSeg = after[after.length - 1];
  const slug = toSlugBase(fileSeg);
  return `/wiki/${slug}/`;
}

function isBoardSubPermalink(permalink) {
  const normalized = normalizePermalink(permalink);
  if (!normalized) return false;
  if (!normalized.startsWith(BOARD_PREFIX)) return false;
  return normalized !== BOARD_PREFIX;
}

module.exports = {
  // Default layout for CTA wiki notes when none is provided
  layout: 'resourcePage',

  eleventyComputed: {
    // Flag: does this page define an explicit permalink in frontmatter?
    hasExplicitPermalink: (data) => {
      // If frontmatter provided a permalink, it will be present here before this computed permalink runs
      return !!data.permalink;
    },
    // Provide a reasonable default title if none is set
    title: (data) => {
      if (data.title) return data.title;
      const stem = (data.page && data.page.filePathStem) ? String(data.page.filePathStem) : '';
      const parts = stem.replace(/^\/+/, '').split('/');
      const wikiIdx = parts.indexOf(WIKI_SEGMENT);
      const after = wikiIdx >= 0 ? parts.slice(wikiIdx + 1) : parts;
      const fileSeg = after[after.length - 1] || 'Note';
      return humanizeTitle(fileSeg);
    },
    // Compute a permalink only if one is not explicitly provided in the page data
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      return computeDefaultPermalink(data);
    },
    isBoardSubpage: (data) => {
      if (typeof data.isBoardSubpage === 'boolean') return data.isBoardSubpage;
      const target = data.permalink ? data.permalink : computeDefaultPermalink(data);
      return isBoardSubPermalink(target);
    },
    metaRobots: (data) => {
      if (data.metaRobots) return data.metaRobots;
      const target = data.permalink ? data.permalink : computeDefaultPermalink(data);
      return isBoardSubPermalink(target) ? 'noindex, nofollow' : undefined;
    },
    searchExclude: (data) => {
      if (typeof data.searchExclude !== 'undefined') return data.searchExclude;
      const target = data.permalink ? data.permalink : computeDefaultPermalink(data);
      return isBoardSubPermalink(target);
    },
  },
};
