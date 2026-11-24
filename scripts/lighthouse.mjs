/**
 * Lighthouse (mobile, default throttling) against the built site, served the way a
 * real static host would serve it (gzip + clean URLs). Run `npm run build` first.
 * Reports → verification/lighthouse/*.html, summary → verification/lighthouse/summary.json
 */
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'verification', 'lighthouse');
const PORT = 4180;
const PAGES = process.env.LH_PAGES
  ? process.env.LH_PAGES.split(',')
  : ['/', '/sharda-paradise', '/sharda-greens'];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [clean, `${clean}.html`, path.posix.join(clean, 'index.html')];
  for (const c of candidates) {
    const f = path.join(DIST, c);
    if (!f.startsWith(DIST)) continue;
    try {
      if ((await stat(f)).isFile()) return f;
    } catch {
      /* try next */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? '/');
  const target = file ?? path.join(DIST, '404.html');
  const ext = path.extname(target);
  let body = await readFile(target);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
  if (target.includes(`${path.sep}assets${path.sep}`))
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  if (
    /\.(html|js|css|json|svg|txt|xml)$/.test(ext) &&
    /gzip/.test(req.headers['accept-encoding'] ?? '')
  ) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(file ? 200 : 404, headers);
  res.end(body);
});
await new Promise((r) => server.listen(PORT, r));
await mkdir(OUT, { recursive: true });

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
const summary = {};
try {
  for (const p of PAGES) {
    const result = await lighthouse(`http://localhost:${PORT}${p}`, {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    const cats = result.lhr.categories;
    const audits = result.lhr.audits;
    summary[p] = {
      performance: Math.round(cats.performance.score * 100),
      accessibility: Math.round(cats.accessibility.score * 100),
      bestPractices: Math.round(cats['best-practices'].score * 100),
      seo: Math.round(cats.seo.score * 100),
      LCP: audits['largest-contentful-paint'].displayValue,
      CLS: audits['cumulative-layout-shift'].displayValue,
      TBT: audits['total-blocking-time'].displayValue,
    };
    const name = p === '/' ? 'home' : p.slice(1);
    await writeFile(path.join(OUT, `${name}.html`), result.report);
    console.warn(p, JSON.stringify(summary[p]));
    const failing = Object.values(audits)
      .filter(
        (a) =>
          a.score !== null &&
          a.score < 0.9 &&
          a.scoreDisplayMode !== 'informative' &&
          a.scoreDisplayMode !== 'manual',
      )
      .map((a) => `${a.id}(${a.score})`);
    if (failing.length) console.warn('   below 0.9:', failing.join(', '));
  }
} finally {
  await chrome.kill();
  server.close();
}
await writeFile(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
const low = Object.entries(summary).filter(([, s]) =>
  [s.performance, s.accessibility, s.bestPractices, s.seo].some((v) => v < 90),
);
console.warn(
  low.length
    ? `\nBelow 90 on: ${low.map(([p]) => p).join(', ')}`
    : '\nAll pages ≥ 90 in every category.',
);
process.exit(low.length ? 1 : 0);
