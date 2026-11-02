import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import sharp from 'sharp';

const SRC = join(process.cwd(), 'src', 'content', 'diets');
const OUT = join(process.cwd(), 'public', 'images', 'diets', 'og');

const colors = {
  A: '#5A7E5E',
  B: '#7A9E7E',
  C: '#C88A5C',
  D: '#E07A5F'
};
const gradeLabel = {
  A: 'STRONG EVIDENCE',
  B: 'MODERATE EVIDENCE',
  C: 'LIMITED EVIDENCE',
  D: 'INSUFFICIENT EVIDENCE'
};

function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  const title = m[1].match(/title:\s*"([^"]*)"/);
  const grade = m[1].match(/evidenceGrade:\s*"([^"]*)"/);
  const carb = m[1].match(/carb:\s*(\d+)/);
  const prot = m[1].match(/protein:\s*(\d+)/);
  const fat = m[1].match(/fat:\s*(\d+)/);
  if (title) fm.title = title[1];
  if (grade) fm.grade = grade[1];
  if (carb) fm.carb = +carb[1];
  if (prot) fm.prot = +prot[1];
  if (fat) fm.fat = +fat[1];
  return fm;
}

function wrap(text, maxChars) {
  const words = String(text).split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = cur + ' ' + w;
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines.slice(0, 3);
}

function svgFor(fm) {
  const grade = (fm.grade || 'B')[0];
  const accent = colors[grade] || colors.B;
  const lines = wrap(fm.title || 'Diet Guide', 34);
  const lineHeight = 64;
  const startY = 300;
  const titleEls = lines
    .map((l, i) => `<text x="90" y="${startY + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#2C3E2D">${l}</text>`)
    .join('');
  const barW = 460;
  const c = fm.carb ?? 45;
  const p = fm.prot ?? 20;
  const f = fm.fat ?? 35;
  const total = c + p + f || 100;
  const cw = Math.round((c / total) * barW);
  const pw = Math.round((p / total) * barW);
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FAF6EE"/>
  <circle cx="1050" cy="90" r="260" fill="${accent}" opacity="0.12"/>
  <circle cx="120" cy="590" r="180" fill="#E8A87C" opacity="0.10"/>
  <rect x="0" y="0" width="12" height="630" fill="${accent}"/>
  <text x="90" y="150" font-family="Arial, sans-serif" font-size="26" letter-spacing="6" font-weight="700" fill="${accent}">COOKTWO DIET EVIDENCE</text>
  <g>
    <rect x="90" y="185" width="440" height="44" rx="22" fill="${accent}"/>
    <text x="112" y="214" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF">EVIDENCE GRADE ${grade.toUpperCase()} · ${gradeLabel[grade]}</text>
  </g>
  ${titleEls}
  <g>
    <rect x="90" y="470" width="${barW}" height="30" rx="15" fill="#F5F0E6" stroke="#E5E1DA"/>
    <rect x="91" y="471" width="${Math.max(cw, 1)}" height="28" rx="14" fill="#7A9E7E"/>
    <rect x="${91 + cw}" y="471" width="${Math.max(pw, 1)}" height="28" rx="0" fill="#C88A5C"/>
    <rect x="${91 + cw + pw}" y="471" width="${Math.max(barW - cw - pw - 2, 1)}" height="28" rx="14" fill="#6B7B6C"/>
    <text x="90" y="530" font-family="Arial, sans-serif" font-size="20" fill="#6B7B6C">${c}% carbs · ${p}% protein · ${f}% fat — typical plate</text>
  </g>
  <text x="90" y="585" font-family="Arial, sans-serif" font-size="22" fill="#6B7B6C">What the research actually shows — cooktwo.com/diets</text>
</svg>`;
}

mkdirSync(OUT, { recursive: true });

let generated = 0;
for (const file of readdirSync(SRC).filter((f) => f.endsWith('.mdx'))) {
  const fm = frontmatter(readFileSync(join(SRC, file), 'utf-8'));
  if (!fm.title) continue;
  const slug = basename(file, '.mdx');
  const svg = Buffer.from(svgFor(fm));
  const outPath = join(OUT, `${slug}.webp`);
  await sharp(svg).webp({ quality: 88 }).toFile(outPath);
  generated++;
}

const hubFm = { title: 'Any Sensible Diet Can Work - What the Evidence Says', grade: 'A', carb: 50, prot: 18, fat: 32 };
await sharp(Buffer.from(svgFor(hubFm))).webp({ quality: 88 }).toFile(join(OUT, 'diet-hub.webp'));
generated++;

console.log(`OG images generated: ${generated} -> public/images/diets/og/`);
