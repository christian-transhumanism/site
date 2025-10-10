const fs = require('fs');
const path = require('path');

const rawFlag = process.env.SKIP_REMOTE_FEEDS ?? process.env.SKIP_REMOTE_FETCH ?? '';
const normalizedFlag = String(rawFlag).trim().toLowerCase();
const skipRemoteFetch = ['1', 'true', 'yes', 'on'].includes(normalizedFlag);

const CACHE_DIR = path.join(process.cwd(), '.cache');

function ensureCacheDir() {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (_) {
    /* noop */
  }
}

function cacheFile(name) {
  return path.join(CACHE_DIR, name);
}

function readCacheJSON(name) {
  try {
    const file = cacheFile(name);
    if (!fs.existsSync(file)) return null;
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt);
  } catch (_) {
    return null;
  }
}

function writeCacheJSON(name, data) {
  try {
    ensureCacheDir();
    fs.writeFileSync(cacheFile(name), JSON.stringify(data, null, 2), 'utf8');
  } catch (_) {
    /* noop */
  }
}

function logSkip(context) {
  if (skipRemoteFetch) {
    console.warn(`[offline] SKIP_REMOTE_FEEDS active – skipping remote fetch for ${context}`);
  }
}

function logFailure(context, error) {
  const message = error && error.message ? error.message : error;
  console.warn(`[offline] Failed to fetch ${context}: ${message}`);
}

module.exports = {
  skipRemoteFetch,
  shouldFetchRemote: !skipRemoteFetch,
  cacheFile,
  readCacheJSON,
  writeCacheJSON,
  logSkip,
  logFailure,
};
