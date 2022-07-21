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

  eleventyConfig.addShortcode("timestamp", function(created_at) { 
    var regex = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(.*)/g;
    var repl = "$1$2$3$4$5$6";
    var x = created_at.replace(regex, repl);
    // var v = new Date(created_at);
    // var y = v.getFullYear();
    // var m = v.getMonth();
    // var d = v.getMinutes();
    // var h = v.getHours();
    // var n = v.getMinutes();
    // var s = v.getSeconds();
    // var e = y + m + d + h + n + s;
    return x;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes"
    },
    "rootUrl" : "https://www.christiantranshumanism.com",
    "disqusShortname" : "christiantranshumanism",
  }
};



