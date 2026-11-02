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

const files = walk('dist', []);
const allSet = new Set(files.map((f) => path.relative('dist', path.dirname(f)).replace(/\\/g, '/')));
const broken = {};
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const href = m[1];
    if (href.startsWith('/cdn-cgi') || href.startsWith('//')) continue;
    if (href === '/') continue;
    if (!allSet.has(href.replace(/^\//, ''))) {
      const key = href + '  <-  ' + path.relative('dist', f).replace(/\\/g, '/');
      broken[key] = (broken[key] || 0) + 1;
    }
  }
}
const entries = Object.entries(broken).filter(([k]) => !/(_astro|manifest|favicon|images\/|dist\/)/.test(k));
console.log('broken internal page links:', entries.length);
entries.forEach(([k, v]) => console.log(' ', k));
