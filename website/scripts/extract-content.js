import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function getAllFiles(dir, extensions) {
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.includes(extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function readJSON(filePath, fallback) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Remove JSX/Astro expression blocks, innermost first, so nested .map()
// callbacks do not leave `))}` debris in the extracted prose.
function stripExpressions(text) {
  let current = text;
  let previous;
  do {
    previous = current;
    current = current.replace(/\{[^{}]*\}/g, ' ');
  } while (current !== previous);
  return current;
}

function stripAstroContent(content) {
  let text = content;
  // Frontmatter delimiters are lines that contain exactly three dashes — not
  // the `// ---- section ----` comments used inside page scripts.
  text = text.replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '');
  text = text.replace(/<!--[\s\S]*?-->/g, ' ');
  text = text.replace(/import\s+.*?from\s+['"][^'"]*['"];?\n?/g, '');
  text = text.replace(/export\s+interface\s+[\s\S]*?\n}/g, '');
  text = text.replace(/export\s+const\s+.*?=\s*[\s\S]*?;\n/g, '');
  text = text.replace(/<script[\s\S]*?<\/script>/g, ' ');
  text = text.replace(/<style[\s\S]*?<\/style>/g, ' ');
  text = text.replace(/<[^>]*>/g, ' ');
  text = stripExpressions(text);
  text = decodeEntities(text);
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function readJsString(source, name) {
  const match = source.match(new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`));
  if (!match) return '';
  let i = match.index + match[0].length;
  while (i < source.length && /\s/.test(source[i])) i++;
  const quote = source[i];
  if (!["'", '"', '`'].includes(quote)) return '';
  i++;
  let out = '';
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') {
      const next = source[i + 1] || '';
      if (next === quote || next === '\\') { out += next; i += 2; continue; }
      out += ch + next;
      i += 2;
      continue;
    }
    if (ch === quote) break;
    out += ch;
    i++;
  }
  return out.replace(/\\n/g, ' ').replace(/\\t/g, ' ').trim();
}

function extractPageMeta(content) {
  const meta = { title: '', description: '' };
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter) {
    meta.title = readJsString(frontmatter[1], 'title');
    meta.description = readJsString(frontmatter[1], 'description');
  }
  const layoutMatch = content.match(/<BaseLayout\s+([^>]*)>/);
  if (layoutMatch && !meta.title) {
    const attrs = layoutMatch[1];
    const titleMatch = attrs.match(/title\s*=\s*\{?"?([^"}]+)"?\}?/);
    const descMatch = attrs.match(/description\s*=\s*\{"?([\s\S]+?)"?\}/);
    if (titleMatch) meta.title = titleMatch[1].trim();
    if (descMatch && !meta.description) meta.description = descMatch[1].trim();
  }
  const fmTitle = content.match(/^---[\s\S]*?title:\s*['"]?([^'"\n]+)['"]?[\s\S]*?---/m);
  if (!meta.title && fmTitle) meta.title = fmTitle[1].trim();
  return meta;
}

function extractAstroPage(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const meta = extractPageMeta(content);
  const text = stripAstroContent(content);
  const rel = filePath.split(join(rootDir, 'src', 'pages'))[1].replace(/\\/g, '/').replace(/^\//, '');
  const slug = rel.replace(/\.astro$/, '').replace(/\/?index$/, '') || '/';

  // Thin Astro routes (e.g. app-guide.astro) only render a content-collection
  // entry, so their title and description live in src/content/pages/<slug>.
  let fallback = { data: {} };
  if (!meta.title || meta.title === slug) {
    for (const ext of ['.mdx', '.md']) {
      try {
        fallback = parseFrontmatter(readFileSync(join(rootDir, 'src', 'content', 'pages', `${slug}${ext}`), 'utf-8'));
        if (fallback.data.title) break;
      } catch { /* no matching content entry */ }
    }
  }

  return {
    slug,
    title: meta.title || fallback.data.title || slug,
    description: meta.description || fallback.data.description || '',
    content: text.substring(0, 8000),
  };
}

console.log('Extracting CookTwo site content for chatbot knowledge base...');

const dataDir = join(rootDir, 'src', 'data');

const faqRaw = readJSON(join(dataDir, 'faq.json'), { faq: [] });
const featuresRaw = readJSON(join(dataDir, 'features.json'), { features: [], steps: [] });
const comparisonRaw = readJSON(join(dataDir, 'comparison.json'), { comparison: { categories: [], competitors: [] } });
const navigationRaw = readJSON(join(dataDir, 'navigation.json'), { navigation: {} });

const faq = [];
for (const cat of faqRaw.faq || []) {
  for (const item of (cat.questions || [])) {
    faq.push({ category: cat.category, question: item.q, answer: item.a });
  }
}

const features = (featuresRaw.features || []).map((f) => ({
  id: f.id,
  title: f.title,
  badge: f.badge,
  description: f.description,
  highlights: f.highlights || [],
  href: f.href,
}));

const steps = (featuresRaw.steps || []).map((s) => ({
  number: s.number,
  title: s.title,
  description: s.description,
  detail: s.detail,
}));

const comparison = {
  categories: comparisonRaw.comparison?.categories || [],
  competitors: comparisonRaw.comparison?.competitors || [],
};

const pageFiles = getAllFiles(join(rootDir, 'src', 'pages'), ['.astro']);
const pages = pageFiles
  .filter((f) => !f.includes(`${join('src', 'pages', '404.astro')}`))
  .map((f) => extractAstroPage(f));

function parseFrontmatter(content) {
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: normalized };
  const data = {};
  const yaml = match[1];
  const lines = yaml.split('\n');
  let currentKey = null;
  let currentArray = null;
  for (const line of lines) {
    const arrayItem = line.match(/^\s*-\s+(.*)$/);
    if (arrayItem && currentArray) {
      currentArray.push(arrayItem[1].replace(/^['"]|['"]$/g, '').trim());
      continue;
    }
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let val = kv[2].trim();
      if (val === '') {
        currentArray = [];
        data[key] = currentArray;
        currentKey = key;
        continue;
      }
      if (/^['"].*['"]$/.test(val)) val = val.slice(1, -1);
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d{4}-\d{2}-\d{2}/.test(val)) val = val;
      data[key] = val;
      currentKey = null;
      currentArray = null;
    }
  }
  return { data, body: match[2] };
}

function extractContentFile(filePath, type) {
  const content = readFileSync(filePath, 'utf-8');
  const { data, body } = parseFrontmatter(content);
  const rel = filePath.split(join(rootDir, 'src', 'content'))[1].replace(/\\/g, '/').replace(/^\//, '');
  let slug = rel.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
  // Content pages render at the site root, not under /pages/.
  if (type === 'page') slug = slug.replace(/^pages\//, '');
  const text = decodeEntities(
    stripExpressions(
      body
        .replace(/<[^>]*>/g, ' ')
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\n?/g, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\s+/g, ' ')
        .trim(),
    ),
  );
  return {
    type,
    slug,
    title: data.title || slug,
    description: data.description || '',
    pubDate: data.pubDate || null,
    updatedDate: data.updatedDate || null,
    pillar: data.pillar || null,
    seoMode: data.seoMode || null,
    targetKeyword: data.targetKeyword || null,
    tags: data.tags || [],
    evidenceGrade: data.evidenceGrade || null,
    category: data.category || null,
    bestFor: data.bestFor || null,
    hardestPart: data.hardestPart || null,
    medicalCaution: data.medicalCaution || null,
    draft: data.draft === true,
    content: text.substring(0, 30000)
  };
}

const blogFiles = getAllFiles(join(rootDir, 'src', 'content', 'blog'), ['.md', '.mdx']);
const pageContentFiles = getAllFiles(join(rootDir, 'src', 'content', 'pages'), ['.md', '.mdx']);
const dietContentFiles = getAllFiles(join(rootDir, 'src', 'content', 'diets'), ['.md', '.mdx']);
const blogPosts = blogFiles
  .map((f) => extractContentFile(f, 'post'))
  .filter((p) => p.draft !== true);
const pillarPages = pageContentFiles
  .map((f) => extractContentFile(f, 'page'))
  .filter((p) => p.draft !== true);
const dietPages = dietContentFiles
  .map((f) => extractContentFile(f, 'diet'))
  .filter((d) => d.draft !== true);

const whatIs = faq.find((q) => /what is cooktwo/i.test(q.question));
const business = {
  name: 'CookTwo',
  url: 'https://cooktwo.com',
  pwaUrl: 'https://cooktwo.app',
  description:
    whatIs?.answer ||
    'CookTwo is a collaborative adaptive nutrition app for couples — a shared kitchen operating system with one grocery list, one pantry, one meal plan, but personalised portions for each partner.',
};

const siteContent = {
  business,
  faq,
  features,
  steps,
  comparison,
  pages,
  blogPosts,
  pillarPages,
  dietPages,
  navigation: navigationRaw.navigation || {},
  generatedAt: new Date().toISOString(),
};

const outputDir = join(rootDir, 'public', 'data');
mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, 'site-content.json');
writeFileSync(outputPath, JSON.stringify(siteContent, null, 2));

// Inline the same content into the Cloudflare Pages Function bundle so
// /api/chat answers from the repo files alone (no network fetch, no web search).
const functionsApiDir = join(rootDir, 'functions', 'api');
mkdirSync(functionsApiDir, { recursive: true });
writeFileSync(
  join(functionsApiDir, '_chatKnowledge.js'),
  '// GENERATED by scripts/extract-content.js on every build — do not edit.\n' +
  'export const SITE_CONTENT = ' + JSON.stringify(siteContent) + ';\n',
);

const size = (JSON.stringify(siteContent).length / 1024).toFixed(1);
console.log(`Content extracted: ${size}KB written to ${outputPath}`);
console.log(`  FAQ items: ${faq.length}`);
console.log(`  Features: ${features.length}`);
console.log(`  Onboarding steps: ${steps.length}`);
console.log(`  Competitors compared: ${comparison.competitors.length}`);
console.log(`  Pages: ${pages.length}`);
console.log(`  Blog posts: ${blogPosts.length}`);
console.log(`  Pillar pages: ${pillarPages.length}`);
console.log(`  Diet guides: ${dietPages.length}`);
console.log('Done!');
