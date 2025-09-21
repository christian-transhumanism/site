const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
let parser = new Parser();

module.exports = async function() {
    // Feeds that have died or many no longer be relevant
        // "https://members.christiantranshumanism.org/blog/community.rss",
        // "http://jaygary.com/feed/",
        // "http://mikemorrell.org/feed",
        // "https://turingchurch.net/feed",
        // "https://www.aitheology.com/feed/",
        // "http://www.blaireostler.com/journal?format=RSS",
        // "https://anchor.fm/s/d5e30910/podcast/rss",
        // "http://rundown.live/rss",
        // "http://bibleandprayer.com/rss",
        // "http://feeds.feedburner.com/Exotheologyorg",
        // "https://artoonsolutions.com/feed/",
        // "https://successdunia.com/feed/",
        // "https://theanglicangazette.podbean.com/feed.xml",

    // Read feed URLs from the JSON file
    const feedsPath = path.join(__dirname, 'community-feeds.json');
    const feedUrls = JSON.parse(fs.readFileSync(feedsPath, 'utf8'));

    const feeds = await Promise.allSettled(
        feedUrls.map(url => 
            parser.parseURL(url)
                .catch(error => {
                    console.warn(`Failed to fetch feed: ${url}`, error.message);
                    return { items: [] };
                })
        )
    );

    return feeds
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.items)
        .flat();
};