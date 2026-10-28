// Fails if the web build (dist/) references any external host (AGENTS.md §7: no CDN, fonts, analytics).
// Usage: node scripts/check-no-external-urls.mjs [dir]   (default: dist)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');

// Hosts that appear only as string literals in libraries and are never fetched:
// XML namespaces (SVG), React minified-error links, and doc/issue links inside expo-router and
// React Native error messages (checked in E-01). Runtime network is blocked by the CSP (connect-src 'self', E-07).
const ALLOWED_HOSTS = new Set(['www.w3.org', 'react.dev', 'reactjs.org', 'github.com', 'docs.expo.dev']);

const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.txt']);
const URL_RE = /\bhttps?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi;

if (!fs.existsSync(root)) {
  console.error(`check-no-external-urls: ${root} not found. Run "npm run build:web" first.`);
  process.exit(2);
}

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (TEXT_EXT.has(path.extname(e.name))) yield full;
  }
}

const findings = new Map(); // host -> Set(files)
for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(URL_RE)) {
    const host = m[1].toLowerCase();
    if (ALLOWED_HOSTS.has(host)) continue;
    if (!findings.has(host)) findings.set(host, new Set());
    findings.get(host).add(path.relative(root, file));
  }
}

if (findings.size === 0) {
  console.log(`check-no-external-urls: OK (${root})`);
} else {
  console.error('check-no-external-urls: external hosts found:');
  for (const [host, files] of findings) console.error(`  ${host}: ${[...files].join(', ')}`);
  process.exit(1);
}
