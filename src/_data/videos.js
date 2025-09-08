const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Fetch URL over HTTPS, return Promise<string>
function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow redirects
          return resolve(fetchText(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

// Simple on-disk cache
function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }); } catch (_) {} }
function hash(s) { return crypto.createHash('sha1').update(s).digest('hex'); }
function readCache(fp) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (_) { return null; } }
function writeCache(fp, body) { try { fs.writeFileSync(fp, JSON.stringify({ t: Date.now(), body }), 'utf8'); } catch (_) {} }

async function fetchCached(url, maxAgeMs) {
  const dir = path.join(process.cwd(), '.cache');
  ensureDir(dir);
  const file = path.join(dir, `videos-${hash(url)}.json`);
  const rec = readCache(file);
  if (rec && (Date.now() - (rec.t || 0) < maxAgeMs) && rec.body) {
    return rec.body;
  }
  const body = await fetchText(url);
  writeCache(file, body);
  return body;
}

// Very small XML parser for YouTube RSS entries
function parseYouTubeFeed(xml, labelFallback) {
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml))) {
    const entry = match[1];
    const id = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
    const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const author = (entry.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/) || [])[1];
    const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1];
    // Try to read duration from yt:duration seconds or media:content duration
    const dur1 = (entry.match(/<yt:duration[^>]*seconds=\"(\d+)\"/i) || [])[1];
    const dur2 = (entry.match(/<media:content[^>]*duration=\"(\d+)\"/i) || [])[1];
    const seconds = dur1 ? parseInt(dur1, 10) : (dur2 ? parseInt(dur2, 10) : null);
    if (id) {
      items.push({ id, title: decodeEntities(title || ''), channel: author || labelFallback || 'YouTube', published, seconds });
    }
  }
  return items;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchChannel({ channelId, user, handle, label }) {
  const base = 'https://www.youtube.com/feeds/videos.xml';
  // Try channel_id feed first if provided
  if (channelId) {
    const xml = await fetchCached(`${base}?channel_id=${encodeURIComponent(channelId)}`, 1000 * 60 * 60); // 1h
    return parseYouTubeFeed(xml, label).map(v => ({ ...v, channel: label || v.channel }));
  }
  // Try resolving from handle (e.g., @ChristianTranshumanism) to channelId
  if (handle) {
    const id = await resolveChannelIdFromHandle(handle);
    if (id) {
      const xml = await fetchText(`${base}?channel_id=${encodeURIComponent(id)}`);
      return parseYouTubeFeed(xml, label || handle.replace(/^@/, '')).map(v => ({ ...v, channel: label || v.channel }));
    }
  }
  // Fallback to legacy user feed if present
  if (user) {
    const xml = await fetchText(`${base}?user=${encodeURIComponent(user)}`);
    return parseYouTubeFeed(xml, label || user).map(v => ({ ...v, channel: label || v.channel }));
  }
  return [];
}

// Optional: YouTube Data API v3 for deeper history
function readJSONSafe(p) {
  try {
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch (_) {
    return null;
  }
}

function getYouTubeApiConfig() {
  const cfgPath = path.join(__dirname, 'youtubeApi.json');
  const cfg = readJSONSafe(cfgPath) || {};
  // Prefer environment variable over file to ease local/CI secrets management
  const apiKey = (process.env.YOUTUBE_API_KEY || cfg.apiKey || '').trim();
  const maxPerChannel = Number.parseInt(process.env.MAX_VIDEOS_PER_CHANNEL || cfg.maxPerChannel || '100', 10);
  return { apiKey, maxPerChannel: Number.isFinite(maxPerChannel) && maxPerChannel > 0 ? maxPerChannel : 100 };
}

function parseISODurationToSeconds(dur) {
  if (!dur || typeof dur !== 'string') return null;
  // e.g., PT1H2M3S
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = parseInt(m[1] || '0', 10);
  const mi = parseInt(m[2] || '0', 10);
  const s = parseInt(m[3] || '0', 10);
  return h * 3600 + mi * 60 + s;
}

async function fetchJSON(url) {
  const txt = await fetchCached(url, 1000 * 60 * 30); // 30m cache
  try { return JSON.parse(txt); } catch (_) { return null; }
}

async function fetchChannelViaAPI(channelId, label, apiKey, maxPerChannel) {
  try {
    // 1) Get uploads playlist id
    const chUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
    const ch = await fetchJSON(chUrl);
    const uploads = ch && ch.items && ch.items[0] && ch.items[0].contentDetails && ch.items[0].contentDetails.relatedPlaylists && ch.items[0].contentDetails.relatedPlaylists.uploads;
    if (!uploads) return [];
    // 2) Page through playlistItems to collect videoIds
    let ids = [];
    let pageToken = '';
    while (ids.length < maxPerChannel) {
      const piUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=${Math.min(50, maxPerChannel - ids.length)}&playlistId=${encodeURIComponent(uploads)}${pageToken ? `&pageToken=${pageToken}` : ''}&key=${encodeURIComponent(apiKey)}`;
      const pi = await fetchJSON(piUrl);
      const batch = (pi && pi.items ? pi.items : []).map(it => it.contentDetails && it.contentDetails.videoId).filter(Boolean);
      ids.push(...batch);
      if (!pi || !pi.nextPageToken || !batch.length) break;
      pageToken = pi.nextPageToken;
    }
    if (!ids.length) return [];
    // 3) Fetch details in batches
    const items = [];
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50);
      const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${encodeURIComponent(chunk.join(','))}&key=${encodeURIComponent(apiKey)}`;
      const data = await fetchJSON(vUrl);
      const list = (data && data.items ? data.items : []).map(x => {
        const id = x.id;
        const title = (x.snippet && x.snippet.title) || '';
        const channel = label || (x.snippet && x.snippet.channelTitle) || 'YouTube';
        const published = (x.snippet && x.snippet.publishedAt) || '';
        const seconds = parseISODurationToSeconds(x.contentDetails && x.contentDetails.duration);
        return { id, title, channel, published, seconds };
      }).filter(v => v.id);
      items.push(...list);
    }
    return items;
  } catch (_) {
    return [];
  }
}

// Fetch a video's meta from the watch/shorts page, cached
async function fetchVideoMeta(id) {
  try {
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    const html = await fetchCached(url, 1000 * 60 * 60 * 24 * 7); // 7d
    let seconds = null;
    // Try both escaped and unescaped JSON patterns for robustness
    let m = html.match(/\"lengthSeconds\"\s*:\s*\"(\d+)\"/);
    if (!m) m = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
    if (m && m[1]) seconds = parseInt(m[1], 10);
    if (seconds == null) {
      let m2 = html.match(/\"approxDurationMs\"\s*:\s*\"(\d+)\"/);
      if (!m2) m2 = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
      if (m2 && m2[1]) seconds = Math.round(parseInt(m2[1], 10) / 1000);
    }
    // Detect shorts via multiple hints
    const isShorts = (
      /youtube\.com\/shorts\//i.test(html) ||
      /rel=\"canonical\"[^>]+href=\"[^\"]*\/shorts\//i.test(html) ||
      /"isShorts"\s*:\s*true/i.test(html) ||
      /"isShortFormContent"\s*:\s*true/i.test(html) ||
      /shortFormVideoRenderer/i.test(html)
    );
    return { seconds, isShorts };
  } catch (_) {
    return { seconds: null, isShorts: null };
  }
}

async function fillVideoMeta(items) {
  const tasks = items.map(async v => {
    if (!v || !v.id) return;
    // Only fetch meta when we need it: missing seconds or potentially short-length
    const needMeta = typeof v.seconds !== 'number' || (v.seconds <= 90);
    if (!needMeta) return;
    const meta = await fetchVideoMeta(v.id);
    if (typeof meta.seconds === 'number' && isFinite(meta.seconds)) v.seconds = meta.seconds;
    if (typeof meta.isShorts === 'boolean') v.isShorts = meta.isShorts;
  });
  try { await Promise.all(tasks); } catch (_) {}
}

async function resolveChannelIdFromHandle(handle) {
  try {
    const h = handle.startsWith('@') ? handle : `@${handle}`;
    const url = `https://www.youtube.com/${h}`;
    const html = await fetchCached(url, 1000 * 60 * 60 * 24 * 7); // 7d
    // Try several patterns
    const m1 = html.match(/"channelId"\s*:\s*"(UC[^"]+)"/);
    if (m1 && m1[1]) return m1[1];
    const m2 = html.match(/\"externalId\"\s*:\s*\"(UC[^"]+)\"/);
    if (m2 && m2[1]) return m2[1];
    const m3 = html.match(/youtube\.com\/channel\/(UC[\w-]+)/);
    if (m3 && m3[1]) return m3[1];
  } catch (_) {
    return '';
  }
  return '';
}

module.exports = async function () {
  const dataDir = __dirname; // src/_data
  const seedPath = path.join(dataDir, 'videos.json');
  const sourcesPath = path.join(dataDir, 'videoSources.json');

  const seed = readJSONSafe(seedPath) || [];
  const sources = readJSONSafe(sourcesPath) || [];

  const { apiKey, maxPerChannel } = getYouTubeApiConfig();

  // Map sources to fetchers
  const tasks = sources.map(src => {
    const chanId = src.channelId || '';
    const label = src.label || src.user || src.handle;
    if (apiKey && chanId) {
      // Prefer API for deeper history
      return fetchChannelViaAPI(chanId, label, apiKey, maxPerChannel).catch(() => []);
    }
    return fetchChannel({ channelId: chanId, user: src.user || '', handle: src.handle || '', label })
      .then(items => items)
      .catch(() => []);
  });

  let fetched = [];
  try {
    fetched = (await Promise.all(tasks)).flat();
  } catch (_) {
    fetched = [];
  }

  // Merge seed + fetched, backfill meta (duration/shorts) when missing, then filter out Shorts and de-dupe by id
  const merged = [...seed, ...fetched];
  await fillVideoMeta(merged);
  const filtered = merged.filter(v => {
    if (v && v.isShorts === true) return false;
    if (v && typeof v.seconds === 'number') return v.seconds > 60;
    const t = (v.title || '').toLowerCase();
    return !t.includes('#shorts');
  });
  const byId = new Map();
  for (const v of filtered) {
    if (!v || !v.id) continue;
    // Prefer fetched entries that include published/seconds
    const existing = byId.get(v.id);
    if (!existing || (v.published && !existing.published)) byId.set(v.id, v);
  }
  const list = Array.from(byId.values());
  // Sort by published desc when available
  list.sort((a, b) => {
    const da = Date.parse(a.published || 0) || 0;
    const db = Date.parse(b.published || 0) || 0;
    return db - da;
  });
  const max = Number.parseInt(process.env.VIDEO_LIMIT || '100', 10);
  return (Number.isFinite(max) && max > 0) ? list.slice(0, max) : list;
};
