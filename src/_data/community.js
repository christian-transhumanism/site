const Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function() {

	let feed = await parser.parseURL('https://www.christiantranshumanism.org/blog/community.rss');
	return feed.items;
	
};