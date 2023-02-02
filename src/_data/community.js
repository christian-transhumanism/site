const Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function() {
	let feeds = [];

    return feeds.map(x => x.items).flat();	
};