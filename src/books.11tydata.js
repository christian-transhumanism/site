const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function toArray(value) {
  if (!value && value !== 0) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (item === undefined || item === null ? '' : String(item)))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return String(value)
    .split(/\s*(?:,|;|&|\band\b)\s*/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getBodyFromFile(inputPath) {
  if (!inputPath) return '';
  try {
    const abs = path.isAbsolute(inputPath)
      ? inputPath
      : path.join(process.cwd(), inputPath);
    // Ensure file exists and parse markdown front matter
    if (!fs.existsSync(abs)) return '';
    const raw = fs.readFileSync(abs, 'utf8');
    const parsed = matter(raw);
    return (parsed && parsed.content) ? parsed.content.trim() : '';
  } catch (err) {
    console.warn('[books] Failed to read body for', inputPath, err);
    return '';
  }
}

module.exports = {
  eleventyComputed: {
    books: (data) => {
      const collection = (data && data.collections && data.collections.books) || [];
      return collection.map((item) => {
        const front = (item && item.data) || {};
        const authors = toArray(front.authors).length ? toArray(front.authors) : toArray(front.author);
        const editors = toArray(front.editors).length ? toArray(front.editors) : toArray(front.editor);
        const contributors = toArray(front.contributors);
        const tagList = Array.isArray(front.tags)
          ? front.tags.filter((tag) => String(tag).toLowerCase() !== 'book')
          : [];

        return {
          title: front.title,
          url: front.url,
          image: front.image,
          imageAlt: front.imageAlt,
          tags: tagList,
          author: authors.join(', '),
          editor: editors.join(', '),
          authors,
          editors,
          contributors,
          publisher: front.publisher,
          year: front.year,
          series: front.series,
          isbn: front.isbn,
          body: getBodyFromFile(item && item.inputPath),
          wikiUrl: item && item.url,
        };
      });
    },
  },
};
