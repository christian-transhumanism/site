const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const cacheDir = path.join(projectRoot, '.cache');
const removeAllVideoCaches = process.argv.includes('--all');

function listVideoCacheFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir)
    .filter(name => {
      if (name === 'videos-data.json') return true;
      if (!removeAllVideoCaches) return false;
      return /^videos-.*\.json$/.test(name);
    })
    .map(name => path.join(dir, name));
}

function main() {
  const files = listVideoCacheFiles(cacheDir);

  if (files.length === 0) {
    console.log(removeAllVideoCaches ? 'No video cache files found.' : 'No rendered video cache file found.');
    return;
  }

  for (const file of files) {
    fs.unlinkSync(file);
  }

  const mode = removeAllVideoCaches ? 'all video cache files' : 'rendered video cache';
  console.log(`Removed ${files.length} ${mode}:`);
  for (const file of files) {
    console.log(`- ${path.relative(projectRoot, file)}`);
  }
}

main();
