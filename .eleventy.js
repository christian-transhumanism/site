const markdownIt = require("markdown-it");
const fs = require('fs');
const path = require('path');
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
