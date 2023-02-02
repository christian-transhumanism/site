const Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function() {
	let feeds = [];
	// feeds[0] = await parser.parseURL('https://members.christiantranshumanism.org/blog/community.rss');
    feeds[1] = await parser.parseURL('http://feeds.metacannon.net/LincolnCannon');
    feeds[2] = await parser.parseURL('http://glassdimly.com/rss.xml');
    // feeds[3] = await parser.parseURL('http://jaygary.com/feed/');
    // feeds[4] = await parser.parseURL('http://mikemorrell.org/feed');
    feeds[7] = await parser.parseURL('http://www.blaireostler.com/journal?format=RSS');
    feeds[8] = await parser.parseURL('http://www.christopherbenek.com/?feed=rss2');
    feeds[10] = await parser.parseURL('https://josiahredding.com/feed/');
    feeds[11] = await parser.parseURL('https://ryanhauck1.wordpress.com/rss');
    feeds[14] = await parser.parseURL('https://thesingularity.com/?feed=rss');
    // feeds[15] = await parser.parseURL('https://turingchurch.net/feed');
    // feeds[17] = await parser.parseURL('https://www.aitheology.com/feed/');
    feeds[19] = await parser.parseURL('https://www.micahredding.com/blog.rss');
    feeds[20] = await parser.parseURL('https://www.turingchurch.com/feed');
    feeds[21] = await parser.parseURL('https://anchor.fm/s/d5e30910/podcast/rss');
    feeds[22] = await parser.parseURL('https://manyworlds2017.wordpress.com/feed/');

    return feeds.map(x => x.items).flat();	
};