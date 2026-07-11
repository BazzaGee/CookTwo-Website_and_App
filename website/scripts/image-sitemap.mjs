import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const distDir = resolve('./dist');
const sitemapPath = resolve(distDir, 'sitemap-0.xml');

if (!existsSync(sitemapPath)) {
  process.exit(0);
}

let sitemap = readFileSync(sitemapPath, 'utf-8');

if (sitemap.includes('image:image')) {
  process.exit(0);
}

const urlRegex = /<url>[\s\S]*?<\/url>/g;
const locRegex = /<loc>(https:\/\/cooktwo\.com[^<]*)<\/loc>/;
const imgRegex = /<img[^>]*src="(\/[^"]*\.(?:webp|png|jpg|jpeg))"[^>]*>/g;

const urlMatches = [...sitemap.matchAll(urlRegex)];
let updatedUrlCount = 0;

for (const urlMatch of urlMatches) {
  const urlBlock = urlMatch[0];
  const locMatch = urlBlock.match(locRegex);
  if (!locMatch) continue;

  const pageUrl = locMatch[1];
  const pagePath = pageUrl.replace('https://cooktwo.com', '').replace(/^\//, '').replace(/\/$/, '');
  const htmlPath = resolve(distDir, pagePath, 'index.html');
  if (!existsSync(htmlPath)) continue;

  const html = readFileSync(htmlPath, 'utf-8');
  const images = [...html.matchAll(imgRegex)];
  const contentImages = images.filter(m => !m[1].includes('/logo/'));

  if (contentImages.length === 0) continue;

  const imageXml = contentImages.map(m => {
    const alt = m[0].match(/alt="([^"]*)"/)?.[1] || '';
    return `    <image:image>\n      <image:loc>https://cooktwo.com${m[1]}</image:loc>\n      <image:title><![CDATA[${alt}]]></image:title>\n    </image:image>`;
  }).join('\n');

  const updatedUrlBlock = urlBlock.replace('</url>', `\n${imageXml}\n  </url>`);
  sitemap = sitemap.replace(urlBlock, updatedUrlBlock);
  updatedUrlCount++;
}

if (updatedUrlCount > 0) {
  sitemap = sitemap.replace(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  );
  writeFileSync(sitemapPath, sitemap, 'utf-8');
}
