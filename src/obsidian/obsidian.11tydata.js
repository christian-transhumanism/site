const slugify = require('slugify');

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

module.exports = {
  // Default layout for Obsidian notes when none is provided
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
      const obsidianIdx = parts.indexOf('obsidian');
      const after = obsidianIdx >= 0 ? parts.slice(obsidianIdx + 1) : parts;
      const fileSeg = after[after.length - 1] || 'Note';
      return humanizeTitle(fileSeg);
    },
    // Compute a permalink only if one is not explicitly provided in the page data
    permalink: (data) => {
      if (data.permalink) return data.permalink; // respect explicit frontmatter

      // Determine from file path and name
      const stem = (data.page && data.page.filePathStem) ? String(data.page.filePathStem) : '';
      // Example stems:
      //  - '/obsidian/about'                 => '/wiki/about/'
      //  - '/obsidian/board/2024/notes'      => '/board/2024/notes/'
      //  - '/obsidian/mission/faith/foo-bar' => '/wiki/foo-bar/' (only filename for non-board)

      // Extract last segment (filename without extension) and any folders under obsidian/
      const parts = stem.replace(/^\/+/, '').split('/'); // e.g. ['obsidian','board','2024','notes']
      const obsidianIdx = parts.indexOf('obsidian');
      const after = obsidianIdx >= 0 ? parts.slice(obsidianIdx + 1) : parts;

      if (after.length === 0) return '/wiki/';

      // Special case: mirror nested path under /board/ when file lives under obsidian/board/
      if (after[0] && after[0].toLowerCase() === 'board') {
        const segs = after.slice(1); // everything after 'board'
        const slugged = segs.map(s => toSlugBase(s));
        return `/board/${slugged.join('/')}/`;
      }

      // Default: kebab-case the filename only under /wiki/
      const fileSeg = after[after.length - 1];
      const slug = toSlugBase(fileSeg);
      return `/wiki/${slug}/`;
    },
  },
};
