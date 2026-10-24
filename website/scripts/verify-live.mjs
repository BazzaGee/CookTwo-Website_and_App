/**
 * verify-live.mjs — proves production is the build you just made.
 *
 * The mechanism is Astro's content-hashed filenames: `VslPlayer.DUaNm_dj.css`
 * is derived from the file's contents, so if the live page references a hash
 * that local dist/ does not contain, they are different builds. That comparison
 * is immune to the two traps that make git-based checks useless here — a dirty
 * tree, and a stale `dist/`.
 *
 * Also compares `_build-info.json`, which carries the git sha and the dirty
 * flag the artifact was actually built from.
 *
 * Exit code 1 on any mismatch. Run after `wrangler pages deploy`.
 *
 *   node scripts/verify-live.mjs                 # checks cooktwo.com
 *   node scripts/verify-live.mjs https://preview.pages.dev
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = (process.argv[2] || 'https://cooktwo.com').replace(/\/$/, '');
const PAGES = ['/video/couples/', '/video/solo/', '/'];

const distDir = resolve('./dist');

if (!existsSync(distDir)) {
  console.error('verify-live: dist/ not found — run `npm run build` first');
  process.exit(1);
}

function localPageHtml(pathname) {
  const rel = pathname.replace(/^\//, '').replace(/\/$/, '');
  const file = resolve(distDir, rel === '' ? 'index.html' : `${rel}/index.html`);
  return existsSync(file) ? readFileSync(file, 'utf-8') : null;
}

function assetHashes(html) {
  if (!html) return new Set();
  return new Set(
    [...html.matchAll(/\/_astro\/[A-Za-z0-9_.-]+\.(?:css|js|woff2)/g)].map((m) => m[0]),
  );
}

const failures = [];
const report = [];

for (const page of PAGES) {
  let liveHtml;
  try {
    const res = await fetch(`${BASE}${page}`, { headers: { 'accept': 'text/html' } });
    if (!res.ok) {
      failures.push(`${page} — live returned HTTP ${res.status}`);
      continue;
    }
    liveHtml = await res.text();
  } catch (err) {
    failures.push(`${page} — fetch failed: ${err.message}`);
    continue;
  }

  const live = assetHashes(liveHtml);
  const local = assetHashes(localPageHtml(page));

  const onlyLive = [...live].filter((a) => !local.has(a));
  const onlyLocal = [...local].filter((a) => !live.has(a));

  if (onlyLive.length === 0 && onlyLocal.length === 0) {
    report.push(`  ok   ${page} — ${live.size} asset(s), live == dist`);
  } else {
    failures.push(
      `${page} — live and dist disagree\n` +
        (onlyLive.length ? `       live has but dist does not: ${onlyLive.join(', ')}\n` : '') +
        (onlyLocal.length ? `       dist has but live does not: ${onlyLocal.join(', ')}` : ''),
    );
  }
}

// Provenance: does the deployed artifact agree with the one we just built?
try {
  const [liveRes, localText] = [
    await fetch(`${BASE}/_build-info.json`),
    existsSync(resolve(distDir, '_build-info.json'))
      ? readFileSync(resolve(distDir, '_build-info.json'), 'utf-8')
      : null,
  ];

  if (!localText) {
    report.push('  warn /_build-info.json — not present in local dist, skipping provenance check');
  } else if (!liveRes.ok) {
    report.push('  warn /_build-info.json — not live yet (first deploy of build-info will fix this)');
  } else {
    const liveInfo = await liveRes.json();
    const localInfo = JSON.parse(localText);
    if (liveInfo.sha === localInfo.sha && liveInfo.builtAt === localInfo.builtAt) {
      report.push(
        `  ok   /_build-info.json — sha ${liveInfo.shortSha}` +
          `${liveInfo.dirty ? ' (DIRTY TREE)' : ''}, built ${liveInfo.builtAt}`,
      );
    } else {
      failures.push(
        `/_build-info.json — live is ${liveInfo.shortSha} built ${liveInfo.builtAt}, ` +
          `local is ${localInfo.shortSha} built ${localInfo.builtAt}`,
      );
    }
  }
} catch (err) {
  report.push(`  warn /_build-info.json — provenance check skipped: ${err.message}`);
}

console.log(`verify-live: ${BASE}`);
for (const line of report) console.log(line);

if (failures.length > 0) {
  console.error('\nverify-live: FAILED');
  for (const f of failures) console.error(`  ${f}`);
  console.error('\nProduction is not the build you just made. Do not call this deploy done.');
  process.exit(1);
}

console.log('\nverify-live: PASS — production matches dist/');
