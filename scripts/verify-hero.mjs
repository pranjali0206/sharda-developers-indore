/**
 * Hero verification (run after `npm run build`).
 *  - 1440×900 and 390×844@2: headline, Hindi quote, CTA, both project panels present,
 *    panels link to their pages, panels never cover the copy, all inside the hero.
 *  - 1280 / 1024 / 768 / 360: no horizontal scroll, panels fully visible, no overlap.
 *  - Reduced motion renders cleanly.
 * Screenshots → verification/hero/
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'verification', 'hero');
const PORT = 4190;
const BASE = `http://localhost:${PORT}/`;
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.warn(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT,
  shell: true,
  stdio: 'ignore',
});
for (let i = 0; i < 80; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {
    /* starting */
  }
  await new Promise((r) => setTimeout(r, 250));
}
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

const measure = (page) =>
  page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom };
    };
    const hero = document.querySelector('[data-section="hero"]');
    const card = (s) => hero.querySelector(`[data-hero-card="${s}"]`);
    return {
      hero: box(hero),
      h1: box(hero.querySelector('h1')),
      h1Text: hero.querySelector('h1')?.textContent,
      hindi: box(hero.querySelector('[data-hindi-quote]')),
      hindiText: hero.querySelector('[data-hindi-quote]')?.textContent,
      cta: box(hero.querySelector('a[href="#visit"]')),
      para: box(card('paradise')),
      greens: box(card('greens')),
      paraHref: card('paradise')?.getAttribute('href'),
      greensHref: card('greens')?.getAttribute('href'),
      imgsLoaded: [...hero.querySelectorAll('[data-hero-card] img')].every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
      bar: box(document.querySelector('[data-section="mobile-bar"]')),
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });

const overlap = (a, b) =>
  a && b && a.x < b.r - 1 && b.x < a.r - 1 && a.y < b.b - 1 && b.y < a.b - 1;

async function shoot({ w, h, dpr = 1, reduce = false }, file) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: dpr,
    isMobile: w < 768,
    hasTouch: w < 768,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const m = await measure(page);
  if (file) await page.screenshot({ path: path.join(OUT, file) });
  await ctx.close();
  return { m, errors };
}

for (const vp of [
  { w: 1440, h: 900, name: 'desktop', file: 'ours-desktop-1440x900.png' },
  { w: 390, h: 844, dpr: 2, name: 'mobile', file: 'ours-mobile-390x844.png' },
]) {
  const { m, errors } = await shoot(vp, vp.file);
  const n = vp.name;
  check(`${n}: no page errors`, errors.length === 0, errors.join(' | '));
  check(
    `${n}: headline text`,
    m.h1Text?.includes('Sharda Developers') && m.h1Text.includes('A promise of excellence.'),
  );
  check(`${n}: Hindi quote`, m.hindiText?.includes('जहाँ ख़्वाबों को उनकी छत मिलती है।'));
  check(
    `${n}: panels link to project pages`,
    m.paraHref === '/sharda-paradise' && m.greensHref === '/sharda-greens',
  );
  check(`${n}: gate images loaded`, m.imgsLoaded);
  for (const [k, b] of [
    ['h1', m.h1],
    ['hindi', m.hindi],
    ['cta', m.cta],
  ]) {
    check(`${n}: panels clear of ${k}`, !overlap(b, m.para) && !overlap(b, m.greens));
  }
  check(
    `${n}: panels inside the hero`,
    m.para.b <= m.hero.b && m.greens.b <= m.hero.b,
    `${Math.round(Math.max(m.para.b, m.greens.b))} vs ${Math.round(m.hero.b)}`,
  );
  if (vp.w >= 1024) {
    check(
      `${n}: copy left, panels right`,
      m.h1.r <= m.para.x + 1,
      `h1 right ${Math.round(m.h1.r)}, panel left ${Math.round(m.para.x)}`,
    );
    check(`${n}: hero fits the first screen`, m.hero.b <= vp.h + 1, `${Math.round(m.hero.b)}`);
  } else {
    check(`${n}: copy above the panels`, m.cta.b <= Math.min(m.para.y, m.greens.y) + 1);
    check(`${n}: action bar 68px`, Math.abs(m.bar.h - 68) <= 2, `${m.bar.h}`);
  }
}

for (const w of [1280, 1024, 768, 360]) {
  const { m } = await shoot({ w, h: w >= 1024 ? 800 : 780 }, `ours-${w}.png`);
  check(`${w}px: no horizontal scroll`, m.scrollW <= m.clientW, `${m.scrollW} vs ${m.clientW}`);
  const inView = (b) => b && b.x >= -0.5 && b.r <= w + 0.5;
  check(`${w}px: panels fully visible`, inView(m.para) && inView(m.greens));
  check(
    `${w}px: panels clear of the copy`,
    ![m.h1, m.hindi, m.cta].some((b) => overlap(b, m.para) || overlap(b, m.greens)),
  );
}

{
  const { m, errors } = await shoot({ w: 1440, h: 900, reduce: true }, 'ours-reduced-motion.png');
  check('reduced motion: renders, no errors', errors.length === 0 && m.para.w > 0);
}

await browser.close();
server.kill();
if (process.platform === 'win32')
  spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
const failed = results.filter((r) => !r.ok).length;
console.warn(`\n${results.length - failed}/${results.length} hero checks passed.`);
process.exit(failed ? 1 : 0);
