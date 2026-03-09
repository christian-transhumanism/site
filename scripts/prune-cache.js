const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const cacheDir = path.join(projectRoot, '.cache');
const maxAgeDays = Number.parseInt(process.env.CACHE_MAX_AGE_DAYS || '30', 10);
const maxAgeMs = (Number.isFinite(maxAgeDays) && maxAgeDays > 0 ? maxAgeDays : 30) * 24 * 60 * 60 * 1000;
const now = Date.now();

function removeStaleEntries(dir) {
  const removed = [];
  if (!fs.existsSync(dir)) {
    return removed;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const stats = fs.statSync(fullPath);

    if (entry.isDirectory()) {
      removed.push(...removeStaleEntries(fullPath));
      const remaining = fs.readdirSync(fullPath);
      if (remaining.length === 0) {
        fs.rmdirSync(fullPath);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (now - stats.mtimeMs > maxAgeMs) {
      fs.unlinkSync(fullPath);
      removed.push(path.relative(projectRoot, fullPath));
    }
  }

  return removed;
}

function main() {
  const removed = removeStaleEntries(cacheDir);

  if (removed.length === 0) {
    console.log(`No stale cache files older than ${Math.round(maxAgeMs / (24 * 60 * 60 * 1000))} days.`);
    return;
  }

  console.log(`Removed ${removed.length} stale cache file(s):`);
  for (const file of removed) {
    console.log(`- ${file}`);
  }
}

main();
