const Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function() {

	let feed = await parser.parseURL('http://brickcaster.com/christiantranshumanist.rss');
	return feed.items;
	
};
