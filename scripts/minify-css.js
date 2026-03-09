const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, '_site', 'stylesheets');
const cssMinifier = new CleanCSS({
  level: {
    1: {
      all: true,
    },
    2: {
      all: false,
    },
  },
});

function minifyFile(fileName) {
  const filePath = path.join(outputDir, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const result = cssMinifier.minify(source);

  if (result.errors.length > 0) {
    throw new Error(`CSS minification failed for ${fileName}: ${result.errors.join('; ')}`);
  }

  fs.writeFileSync(filePath, result.styles, 'utf8');

  return {
    fileName,
    originalBytes: Buffer.byteLength(source),
    minifiedBytes: Buffer.byteLength(result.styles),
  };
}

function main() {
  if (!fs.existsSync(outputDir)) {
    console.warn(`Skipping CSS minification because ${outputDir} does not exist.`);
    return;
  }

  const cssFiles = fs.readdirSync(outputDir)
    .filter((fileName) => fileName.endsWith('.css'))
    .sort();

  const results = cssFiles
    .map(minifyFile)
    .filter(Boolean);

  if (results.length === 0) {
    console.warn(`No CSS files found in ${outputDir}.`);
    return;
  }

  for (const result of results) {
    console.log(
      `${result.fileName}: ${result.originalBytes} -> ${result.minifiedBytes} bytes`
    );
  }
}

main();
