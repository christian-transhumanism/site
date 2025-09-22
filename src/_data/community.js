const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

// Default site image to use as last resort fallback
const DEFAULT_SITE_IMAGE = '/assets/images/cta_logo_standalone.png';

// Generate a data URL for an SVG placeholder image
function generatePlaceholderImage(feedTitle) {
    // Clean and truncate the feed title
    const title = (feedTitle || 'Blog')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .substring(0, 20);
    
    // Generate two words for two lines if possible
    const words = title.split(/\s+/);
    const line1 = words.slice(0, Math.ceil(words.length/2)).join(' ');
    const line2 = words.slice(Math.ceil(words.length/2)).join(' ');
    
    // Create a deterministic color pair from the title
    function hashStringToColor(str, seed) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
        }
        h = (h + (seed || 0)) >>> 0;
        // convert to H (0-360)
        const hue = h % 360;
        return `hsl(${hue} 65% 45%)`;
    }

    const colorA = hashStringToColor(title, 1);
    const colorB = hashStringToColor(title, 2);

    // Derive initials from the title (up to 2 letters)
    const initials = words.length === 1
        ? (words[0].substring(0,2)).toUpperCase()
        : (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();

    // Create SVG with improved, modern design
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="${colorA}" stop-opacity="1" />
              <stop offset="100%" stop-color="${colorB}" stop-opacity="1" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <rect rx="28" ry="28" width="800" height="400" fill="url(#g)" />
          <rect rx="28" ry="28" width="800" height="400" fill="rgba(0,0,0,0.06)" />

          <!-- Left badge -->
          <g transform="translate(64,100)">
            <rect width="240" height="200" rx="20" ry="20" fill="rgba(255,255,255,0.12)" filter="url(#shadow)" />
            <circle cx="120" cy="100" r="56" fill="rgba(255,255,255,0.12)" />
            <text x="120" y="122" font-family="Inter, Roboto, Arial, sans-serif" font-size="64" fill="white" text-anchor="middle" font-weight="700">${initials}</text>
          </g>

          <!-- Title text on the right -->
          <text x="420" y="150" font-family="Inter, Roboto, Arial, sans-serif" font-size="44" fill="white" font-weight="700">${line1}</text>
          <text x="420" y="210" font-family="Inter, Roboto, Arial, sans-serif" font-size="34" fill="rgba(255,255,255,0.92)" >${line2}</text>
          <text x="420" y="300" font-family="Inter, Roboto, Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.75)">Christian Transhumanist Community</text>
        </svg>
    `.trim();

    // Convert to compact data URL safely
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/\"/g, "%22");
    return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

// Helper function to check if a URL is an image
function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.endsWith(ext));
}

    // Helper function to get image from media object
    function getMediaImageUrl(mediaObj) {
        if (!mediaObj) return null;
        
        try {
            // WordPress.com RSS feed structure (media:content)
            if (mediaObj.$ && mediaObj.$.url && mediaObj.$.medium === 'image') {
                return isImageUrl(mediaObj.$.url) ? mediaObj.$.url : null;
            }
            
            // WordPress.com thumbnail structure
            if (mediaObj.$ && mediaObj.$.url) {
                return isImageUrl(mediaObj.$.url) ? mediaObj.$.url : null;
            }
            
            // Generic media URL
            if (mediaObj.url) {
                return isImageUrl(mediaObj.url) ? mediaObj.url : null;
            }
            
            return null;
        } catch (e) {
            console.warn('Error getting media URL:', e);
            return null;
        }
    }// Configure the parser to look for media content
const parser = new Parser({
    customFields: {
        feed: [
            ['image', 'feedImage'],
            ['webfeeds:icon', 'webfeedsIcon'],
            ['webfeeds:logo', 'webfeedsLogo'],
            ['itunes:image', 'itunesImage']
        ],
        item: [
            ['media:content', 'media'],
            ['media:thumbnail', 'thumbnail'],
            ['enclosure', 'enclosure'],
            ['image', 'image'],
            // Substack specific fields
            ['content:encoded', 'contentEncoded'],
            ['description', 'description']
        ]
    }
});

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

    // Get feed-level image from feed data
    function getFeedImage(feed) {
        if (!feed) return null;
        
        let feedImage = null;
        
        try {
            // Try different possible image locations
            feedImage = feed.feedImage?.url ||  // Standard RSS image
                       feed.feedImage?.href ||   // Alternative format
                       feed.webfeedsLogo ||      // WebFeeds logo
                       feed.webfeedsIcon ||      // WebFeeds icon
                       feed.itunesImage?.href || // iTunes image
                       feed.image?.url ||        // Another possible format
                       null;
        } catch (e) {
            console.warn('Error extracting feed image:', e);
            return null;
        }
        
        return feedImage && isImageUrl(feedImage) ? feedImage : null;
    }

    const feeds = await Promise.allSettled(
        feedUrls.map(url => 
            parser.parseURL(url)
                .catch(error => {
                    console.warn(`Failed to fetch feed: ${url}`, error.message);
                    return { items: [] };
                })
        )
    );

    const items = feeds
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.items)
        .flat();

    // Helper function to extract image from HTML content
    function extractImageFromHTML(html) {
        if (!html || typeof html !== 'string') return null;
        try {
            const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
            const imageSrc = imgMatch ? imgMatch[1] : null;
            return imageSrc && isImageUrl(imageSrc) ? imageSrc : null;
        } catch (e) {
            console.warn('Error extracting image from HTML:', e);
            return null;
        }
    }

    // Process feeds to extract feed-level images
    const feedImages = new Map();
    feeds.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const feedUrl = feedUrls[index];
            const feed = result.value;
            console.log('Processing feed:', {
                url: feedUrl,
                title: feed.title,
                hasImage: !!getFeedImage(feed)
            });

            const feedImage = getFeedImage(feed);
            if (feedImage) {
                console.log('Using feed image:', feedImage);
                feedImages.set(feedUrl, feedImage);
            } else {
                // Generate placeholder image using feed title
                const feedTitle = feed.title || 
                                feed.description?.split(' - ')[0] ||
                                new URL(feedUrl).hostname.split('.')[0];
                console.log('Generating placeholder for:', feedTitle);
                const placeholderImage = generatePlaceholderImage(feedTitle);
                feedImages.set(feedUrl, placeholderImage);
            }
        }
    });

    // Process each item to get the correct image URL
    return items.map(item => {
        // Find the matching feed URL for this item
        const itemFeedUrl = feedUrls.find(url => {
            try {
                // Normalize hostnames (strip leading www.) to match feeds with/without www
                const normalizeHost = host => (host || '').toString().replace(/^www\./i, '').toLowerCase();
                const itemDomain = normalizeHost(new URL(item.link).hostname);
                const feedDomain = normalizeHost(new URL(url).hostname);
                return itemDomain === feedDomain;
            } catch (e) {
                return false;
            }
        });

        console.log('Processing item:', {
            title: item.title,
            feedUrl: itemFeedUrl,
            hasDirectImage: !!(getMediaImageUrl(item.media) || 
                             getMediaImageUrl(item.thumbnail) ||
                             getMediaImageUrl(item.enclosure) ||
                             getMediaImageUrl(item.image)),
            hasFeedImage: !!feedImages.get(itemFeedUrl)
        });

        // Try to get image from various sources
        const featuredImage = getMediaImageUrl(item.media) || 
                            getMediaImageUrl(item.thumbnail) ||
                            getMediaImageUrl(item.enclosure) ||
                            getMediaImageUrl(item.image) ||
                            extractImageFromHTML(item.contentEncoded) ||
                            extractImageFromHTML(item.content) ||
                            extractImageFromHTML(item.description) ||
                            (itemFeedUrl && feedImages.get(itemFeedUrl)) ||  // Use feed image as fallback
                            DEFAULT_SITE_IMAGE;  // Use site default as last resort
        
        return {
            ...item,
            feedUrl: itemFeedUrl,  // Store the matched feed URL
            featuredImage,
            feedImage: itemFeedUrl && feedImages.get(itemFeedUrl) // Store feed image separately
        };
    });
};