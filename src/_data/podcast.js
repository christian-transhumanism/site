const Parser = require('rss-parser');
const remoteToggle = require('./_helpers/remoteToggle');

const parser = new Parser({
  customFields: {
    item: [
      ['social:guest_name', 'guestName'],
      ['social:guest_twitter', 'guestTwitter'],
      ['social:video_url', 'videoUrl'],
      ['social:recorded_at', 'recordedAt']
    ]
  }
});

function revivePodcastItems(items) {
  return (items || []).map((item) => {
    const normalized = { ...item };
    if (!normalized.isoDate && normalized.pubDate) {
      const iso = new Date(normalized.pubDate);
      if (!Number.isNaN(iso.getTime())) {
        normalized.isoDate = iso.toISOString();
        normalized.isoDateObject = iso;
      }
    }
    if (normalized.isoDate && !normalized.isoDateObject) {
      const iso = new Date(normalized.isoDate);
      if (!Number.isNaN(iso.getTime())) {
        normalized.isoDateObject = iso;
      }
    }
    return normalized;
  });
}

function getOfflinePodcastItems() {
  const cached = remoteToggle.readCacheJSON('podcast-feed.json');
  if (Array.isArray(cached) && cached.length) {
    return revivePodcastItems(cached);
  }
  return [];
}

module.exports = async function () {
  if (remoteToggle.skipRemoteFetch) {
    remoteToggle.logSkip('podcast feed');
    return getOfflinePodcastItems();
  }

  let feed;
  try {
    feed = await parser.parseURL('http://brickcaster.com/christiantranshumanist.rss');
  } catch (error) {
    remoteToggle.logFailure('podcast feed', error);
    return getOfflinePodcastItems();
  }

  const showImage = (feed && feed.itunes && feed.itunes.image) || (feed && feed.image && feed.image.url) || null;
  const showTitle = (feed && feed.title) || 'Christian Transhumanist Podcast';

  const items = (feed && Array.isArray(feed.items) ? feed.items : []).map((item) => {
    const normalized = { ...item };

    if (!normalized.videoUrl && normalized.itunes && normalized.itunes.video) {
      normalized.videoUrl = normalized.itunes.video;
    }

    if (!normalized.guestName && typeof normalized.author === 'string') {
      const parts = normalized.author.split(',');
      if (parts.length > 1) {
        normalized.guestName = parts.slice(1).join(',').trim();
      }
    }

    if (!normalized.isoDate && normalized.pubDate) {
      const iso = new Date(normalized.pubDate);
      if (!Number.isNaN(iso.getTime())) {
        normalized.isoDate = iso.toISOString();
        normalized.isoDateObject = iso;
      }
    }

    if (normalized.isoDate && !normalized.isoDateObject) {
      const iso = new Date(normalized.isoDate);
      if (!Number.isNaN(iso.getTime())) {
        normalized.isoDateObject = iso;
      }
    }

    normalized.fileSizeBytes = Number(normalized.enclosure && normalized.enclosure.length) || null;

    if (!normalized.itunes) normalized.itunes = {};

    if (showImage && !normalized.showImage) {
      normalized.showImage = showImage;
    }

    if (!normalized.showTitle) {
      normalized.showTitle = showTitle;
    }

    if (normalized.recordedAt) {
      const recordedDate = new Date(normalized.recordedAt);
      if (!Number.isNaN(recordedDate.getTime())) {
        normalized.recordedAtObject = recordedDate;
      }
    }

    return normalized;
  });

  const cacheReady = items.map(({ isoDateObject, ...rest }) => rest);
  remoteToggle.writeCacheJSON('podcast-feed.json', cacheReady);

  return items;
};
