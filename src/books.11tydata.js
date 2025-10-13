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

function toYearValue(value) {
  if (value === undefined || value === null) return Number.NEGATIVE_INFINITY;
  const match = String(value).match(/\d{3,4}/);
  if (!match) return Number.NEGATIVE_INFINITY;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

const CATEGORY_ORDER = ['technology', 'faith', 'cta'];

function getCategoryPriority(tags) {
  if (!Array.isArray(tags) || !tags.length) return CATEGORY_ORDER.length;
  const lowerTags = tags.map((tag) => String(tag).toLowerCase());
  for (let i = 0; i < CATEGORY_ORDER.length; i += 1) {
    if (lowerTags.indexOf(CATEGORY_ORDER[i]) !== -1) {
      return i;
    }
  }
  return CATEGORY_ORDER.length;
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
      }).sort((a, b) => {
        const aCategory = getCategoryPriority(a.tags);
        const bCategory = getCategoryPriority(b.tags);
        if (aCategory !== bCategory) {
          return aCategory - bCategory;
        }
        const aYear = toYearValue(a.year);
        const bYear = toYearValue(b.year);
        if (aYear !== bYear) {
          return bYear - aYear;
        }
        const aTitle = a.title || '';
        const bTitle = b.title || '';
        return aTitle.localeCompare(bTitle);
      });
    },
  },
};
