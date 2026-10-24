/**
 * build-info.mjs — stamps dist/ with the truth about what was built.
 *
 * Cloudflare Pages records the HEAD sha on every deployment. That label is a
 * lie whenever the tree is dirty: on 2026-10-21 it reported `f63f9a4` while
 * production was serving uncommitted changes, which is precisely how a fixed
 * VSL banner reverted without anyone being able to prove what was live.
 *
 * This file travels with the artifact, so
 *
 *     curl -s https://cooktwo.com/_build-info.json
 *
 * answers "is production stale, and was it built from a dirty tree?" in one
 * request — no git, no dashboard, no trusting the deploy label.
 *
 * Runs as the last step of `npm run build`.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('./');
const distDir = resolve('./dist');

if (!existsSync(distDir)) {
  console.error('build-info: dist/ not found — run this as part of `npm run build`');
  process.exit(1);
}

function git(args) {
  // Strip trailing newlines only. A .trim() here would eat the leading space of
  // the first `git status --porcelain` line (" M path" -> "M path") and corrupt
  // the filename extracted from it.
  return execSync(`git ${args}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] })
    .replace(/\r/g, '')
    .replace(/\n+$/, '');
}

let sha = 'unknown';
let branch = 'unknown';
let dirty = null;
let changed = [];

try {
  // Resolve the repo root first: this script runs with cwd=website/, but git
  // status paths are repo-relative. Asking for "website/src" from inside
  // website/ silently matched nothing and reported a dirty tree as clean.
  const toplevel = git('rev-parse --show-toplevel');
  sha = git('rev-parse HEAD');
  branch = git('rev-parse --abbrev-ref HEAD');
  const status = git(`-C "${toplevel}" status --porcelain -- website/src website/astro.config.mjs`);
  dirty = status.length > 0;
  changed = status
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .filter((file) => file && !file.includes('dist/'))
    .slice(0, 100);
} catch {
  console.warn('build-info: git unavailable — recording sha as unknown');
}

// The reveal values this build baked into the pages. Three copies of these
// numbers is what caused the drift this file exists to prevent.
let vslReveal = null;
const revealPath = resolve('./src/data/vsl-reveal.json');
if (existsSync(revealPath)) {
  try {
    vslReveal = JSON.parse(readFileSync(revealPath, 'utf-8'));
  } catch {
    console.warn('build-info: could not parse src/data/vsl-reveal.json');
  }
}

const info = {
  sha,
  shortSha: sha.slice(0, 7),
  branch,
  dirty,
  changedCount: changed.length,
  changed,
  builtAt: new Date().toISOString(),
  node: process.version,
  vslReveal,
};

writeFileSync(resolve(distDir, '_build-info.json'), `${JSON.stringify(info, null, 2)}\n`);

const flag = dirty ? `  DIRTY — ${changed.length} uncommitted file(s) in src` : '  clean';
console.log(`build-info: ${info.shortSha} on ${branch}${flag}`);

if (dirty) {
  console.warn(`build-info: the deployed artifact will NOT match ${sha.slice(0, 7)}.`);
  console.warn('  Commit or stash before deploying, or production will ship');
  console.warn(`  changes that no commit records. First few: ${changed.slice(0, 3).join(', ')}`);
}
