/**
 * Static pre-rendering. After the client + SSR builds, renders every route to
 * dist/<route>/index.html (plus dist/404.html) so visitors and crawlers get real
 * HTML immediately; the client bundle then hydrates it.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR = path.join(ROOT, 'dist-ssr', 'entry-server.js');

// Vite exposes VITE_* only inside the bundle; read the same sources here.
async function readEnv() {
  const env = { ...process.env };
  for (const f of ['.env', '.env.production', '.env.local', '.env.production.local']) {
    try {
      const txt = await readFile(path.join(ROOT, f), 'utf8');
      for (const line of txt.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in process.env)) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
      }
    } catch {
      /* file not present */
    }
  }
  return env;
}

const env = await readEnv();
const SITE_URL = (env.VITE_SITE_URL ?? '').replace(/\/$/, '');

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
const { render, ROUTES, images } = await import(pathToFileURL(SSR).href);
// Home hero: preload the two project-card gate photos (sizes match the cards).
const sizesFor = (name) => images[name].widths;
const set = (name) =>
  sizesFor(name)
    .map((w) => `/assets/optimized/${name}-${w}.avif ${w}w`)
    .join(', ');
const heroPreload = [
  `<link rel="preload" as="image" type="image/avif" imagesrcset="${set('paradise-gate')}" imagesizes="(min-width: 1024px) 720px, (min-width: 640px) 60vw, 100vw" fetchpriority="high">`,
  `<link rel="preload" as="image" type="image/avif" imagesrcset="${set('g-gate-day')}" imagesizes="(min-width: 1024px) 720px, (min-width: 640px) 60vw, 100vw">`,
].join('\n');

function page(url) {
  const { html, head } = render(url);
  let out = template
    .replace('<!--app-head-->', head + (url === '/' ? `\n${heroPreload}` : ''))
    .replace('<!--app-html-->', html);
  // Helmet owns <title>; drop any duplicate empty one.
  out = out.replace(/<title><\/title>/, '');
  return out;
}

for (const url of ROUTES) {
  const html = page(url);
  if (url === '/') {
    await writeFile(path.join(DIST, 'index.html'), html);
  } else {
    // Both /route.html and /route/index.html, so any static host (Netlify, Vercel,
    // Cloudflare Pages, nginx try_files, vite preview) serves /route without a redirect.
    await mkdir(path.join(DIST, url.slice(1)), { recursive: true });
    await writeFile(path.join(DIST, url.slice(1), 'index.html'), html);
    await writeFile(path.join(DIST, `${url.slice(1)}.html`), html);
  }
  console.warn(`prerendered ${url}`);
}
await writeFile(path.join(DIST, '404.html'), page('/404'));
console.warn('prerendered /404 → 404.html');

// robots.txt + sitemap.xml
const indexable = ROUTES.filter((r) => r !== '/thank-you');
let robots = 'User-agent: *\nAllow: /\nDisallow: /thank-you\n';
if (SITE_URL) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = indexable
    .map(
      (r) =>
        `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${
          r === '/' ? '1.0' : r.startsWith('/sharda') ? '0.9' : '0.3'
        }</priority></url>`,
    )
    .join('\n');
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  robots += `\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  console.warn('wrote sitemap.xml');
} else {
  console.warn(
    '⚠ VITE_SITE_URL not set — skipped sitemap.xml and canonical URLs (TODO: client domain).',
  );
}
await writeFile(path.join(DIST, 'robots.txt'), robots);

await rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
