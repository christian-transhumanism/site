const Parser = require('rss-parser');

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

module.exports = async function () {
  const feed = await parser.parseURL('http://brickcaster.com/christiantranshumanist.rss');
  const showImage = (feed && feed.itunes && feed.itunes.image) || (feed && feed.image && feed.image.url) || null;
  const showTitle = (feed && feed.title) || 'Christian Transhumanist Podcast';

  return feed.items.map((item) => {
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
};
