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
    
    // Create SVG with modern, branded design
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#337ab7;stop-opacity:1" />
                </linearGradient>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                </pattern>
            </defs>
            <rect width="800" height="400" fill="url(#grad)"/>
            <rect width="800" height="400" fill="url(#grid)"/>
            <text x="400" y="160" 
                font-family="Arial, sans-serif" 
                font-size="48" 
                fill="white" 
                text-anchor="middle"
                font-weight="bold">${line1}</text>
            <text x="400" y="220" 
                font-family="Arial, sans-serif" 
                font-size="48" 
                fill="white" 
                text-anchor="middle"
                font-weight="bold">${line2}</text>
            <text x="400" y="300" 
                font-family="Arial, sans-serif" 
                font-size="24" 
                fill="rgba(255,255,255,0.7)" 
                text-anchor="middle">Christian Transhumanist Community</text>
        </svg>
    `.trim();
    
    // Convert SVG to data URL
    const encoded = encodeURIComponent(svg)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
    
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
                return mediaObj.$.url;
            }
            
            // WordPress.com thumbnail structure
            if (mediaObj.$ && mediaObj.$.url) {
                return mediaObj.$.url;
            }
            
            // Generic media URL
            if (mediaObj.url) {
                return mediaObj.url;
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
                // Try to match by domain
                const itemDomain = new URL(item.link).hostname;
                const feedDomain = new URL(url).hostname;
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