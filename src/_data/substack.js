const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const remoteToggle = require('./_helpers/remoteToggle');

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }); } catch (_) {} }
function hash(s) { return crypto.createHash('sha1').update(s).digest('hex'); }
function readCache(fp) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (_) { return null; } }
function writeCache(fp, body) { try { fs.writeFileSync(fp, JSON.stringify({ t: Date.now(), body }), 'utf8'); } catch (_) {} }

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchText(res.headers.location));
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        let data = '';
        res.setEncoding('utf8');
        res.on('data', c => (data += c));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function fetchCached(url, maxAgeMs) {
  const dir = path.join(process.cwd(), '.cache');
  ensureDir(dir);
  const file = path.join(dir, `substack-${hash(url)}.json`);
  const rec = readCache(file);
  const hasBody = rec && !!rec.body;
  const isFresh = hasBody && (Date.now() - (rec.t || 0) < maxAgeMs);
  if (remoteToggle.skipRemoteFetch) {
    remoteToggle.logSkip(`substack feed ${url}`);
    return hasBody ? rec.body : '';
  }
  if (isFresh) return rec.body;
  const body = await fetchText(url);
  writeCache(file, body);
  return body;
}

function pick(re, s) { const m = s.match(re); return m ? m[1] : ''; }
function stripCdata(s) { return (s || '').replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, ''); }
function decode(s) {
  return (s || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function parseSubstackRSS(xml) {
  const items = [];
  const entryRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = entryRe.exec(xml))) {
    const it = m[1];
    const title = decode(stripCdata(pick(/<title>([\s\S]*?)<\/title>/, it)));
    const link = decode(stripCdata(pick(/<link>([^<]+)<\/link>/, it)));
    const pubDate = decode(stripCdata(pick(/<pubDate>([^<]+)<\/pubDate>/, it)));
    const rawContent = stripCdata(pick(/<content:encoded>([\s\S]*?)<\/content:encoded>/, it)) || stripCdata(pick(/<description>([\s\S]*?)<\/description>/, it));
    const content = decode(rawContent);
    // Try to find first image
    const img = pick(/<img[^>]+src=["']([^"']+)["']/i, content) || '';
    if (title && link) items.push({ title, url: link, published: pubDate, image: img, content });
  }
  // sort desc by date when possible
  items.sort((a,b) => (Date.parse(b.published||0)||0) - (Date.parse(a.published||0)||0));
  return items;
}

function readJSONSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return null; }
}

function getOfflineItems() {
  const cached = remoteToggle.readCacheJSON('substack-feed.json');
  return Array.isArray(cached) ? cached : [];
}

module.exports = async function() {
  // Prefer local file config over env var
  const cfgPath = path.join(__dirname, 'substackFeed.json');
  const cfg = readJSONSafe(cfgPath) || {};
  const feedFromFile = (cfg.feed || cfg.url || '').trim();
  const feed = feedFromFile || (process.env.SUBSTACK_FEED || '').trim();
  if (!feed) return [];
  if (remoteToggle.skipRemoteFetch) {
    remoteToggle.logSkip('substack feed');
    const offline = getOfflineItems();
    if (offline.length) return offline;
  }
  try {
    const xml = await fetchCached(feed, 1000 * 60 * 15); // 15m cache
    const items = parseSubstackRSS(xml).slice(0, 10);
    remoteToggle.writeCacheJSON('substack-feed.json', items);
    return items;
  } catch (error) {
    remoteToggle.logFailure('substack feed', error);
    if (remoteToggle.skipRemoteFetch) {
      return getOfflineItems();
    }
    const fallback = getOfflineItems();
    if (fallback.length) return fallback;
    return [];
  }
};
