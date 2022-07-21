const markdownIt = require("markdown-it");
const markdownItFootnote = require('markdown-it-footnote');

module.exports = function(eleventyConfig) {
  eleventyConfig.addLiquidFilter('sortByDate', (collection) => {
        return collection.slice().sort((a, b) => a.data.date.localeCompare(b.data.date))
    });
  eleventyConfig.addLiquidFilter("reverse", (collection) => {
        return [...collection];
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
  let markdownLibrary = markdownIt(options).use(markdownItFootnote);
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



