const Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function() {
    const feedUrls = [
        // 'https://members.christiantranshumanism.org/blog/community.rss',
        // 'http://jaygary.com/feed/',
        // 'http://mikemorrell.org/feed',
        // 'https://turingchurch.net/feed',
        // 'https://www.aitheology.com/feed/',
        'http://feeds.metacannon.net/LincolnCannon',
        'http://glassdimly.com/rss.xml',
        'http://www.blaireostler.com/journal?format=RSS',
        'http://www.christopherbenek.com/?feed=rss2',
        'https://josiahredding.com/feed/',
        'https://ryanhauck1.wordpress.com/rss',
        'https://thesingularity.com/?feed=rss',
        'https://www.micahredding.com/blog.rss',
        'https://www.turingchurch.com/feed',
        'https://anchor.fm/s/d5e30910/podcast/rss',
        'https://manyworlds2017.wordpress.com/feed/'
    ];

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