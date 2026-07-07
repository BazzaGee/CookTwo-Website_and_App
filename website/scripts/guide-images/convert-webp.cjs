// Convert PNG screenshots to webp
const sharp = require('C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/app/frontend/node_modules/sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebp(input, output, maxWidth = 1200) {
  const img = sharp(input);
  const meta = await img.metadata();
  let pipeline = img;
  if (meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth });
  }
  await pipeline
    .webp({ quality: 88, effort: 6 })
    .toFile(output);
  const stat = fs.statSync(output);
  console.log(`Saved ${output} (${(stat.size / 1024).toFixed(1)} KB)`);
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node convert-webp.cjs <input.png> <output.webp> [maxWidth]');
    process.exit(1);
  }
  const [input, output, maxWidth] = args;
  await convertToWebp(input, output, parseInt(maxWidth || '1200', 10));
})();
