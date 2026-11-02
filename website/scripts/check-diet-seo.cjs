const fs = require('fs');
const path = require('path');

function walk(dir, out) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (f === 'index.html') out.push(p);
  }
  return out;
}

const files = walk('dist/diets', []);
let bad = 0;
const summary = [];
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types = [];
  for (const b of blocks) {
    try {
      const obj = JSON.parse(b);
      types.push(obj['@type']);
      if (obj['@type'] === 'Article' && !obj.headline) bad++;
    } catch (e) {
      bad++;
      console.log('INVALID JSON-LD:', path.relative('dist', f), e.message);
    }
  }
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const og = (html.match(/property="og:image" content="([^"]*)"/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const slug = path.relative('dist', path.dirname(f));
  const issues = [];
  if (!title || title.includes('undefined')) issues.push('title');
  if (!desc || desc.length < 50 || desc.length > 200) issues.push('desc(' + (desc || '').length + ')');
  if (!og || !og.includes('og/')) issues.push('og:' + og);
  if (!types.includes('Article')) issues.push('no-article');
  if (!types.includes('BreadcrumbList')) issues.push('no-breadcrumb');
  if (!types.includes('FAQPage')) issues.push('no-faq');
  summary.push([slug, issues.join('|')].join('  '));
}
summary.forEach((s) => console.log(s));
console.log('jsonld parse failures:', bad);
