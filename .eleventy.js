const markdownIt = require("markdown-it");
const markdownItFootnote = require('markdown-it-footnote');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');

const format = require('date-fns/format')
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
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

  return {
    dir: {
      input: "src",
      includes: "_includes"
    },
    "rootUrl" : "https://www.christiantranshumanism.com",
    "disqusShortname" : "christiantranshumanism",
  }
};



