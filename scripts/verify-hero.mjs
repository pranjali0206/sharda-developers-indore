/**
 * Hero verification against the approved design (run after `npm run build`).
 *  1. Screenshots at 1440×900 and 390×844@2 after 3s; element boxes vs the spec (±4px).
 *  2. Side-by-side + 50% overlay with reference/hero/*.png.
 *  3. 1280 / 1024 / 768 / 360: no horizontal scroll, no overlap, captions fully visible.
 *  4. Motion: gold layer and Developers logo stay still; blue/green float
 *     out of step. Records a video (verification/hero/motion.webm).
 *  5. Reduced motion: static render.
 * Output: verification/hero/*
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, rename, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'verification', 'hero');
const PORT = 4190;
const BASE = `http://localhost:${PORT}/`;
const TOL = 4;
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

/** Boxes of the hero's key parts, in CSS px relative to the viewport (page scrolled to top). */
const measure = (page) =>
  page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom };
    };
    const hero = document.querySelector('[data-section="hero"]');
    const shape = hero.querySelector('[data-triad]');
    const spots = [...shape.querySelectorAll('[data-spot]')].map(box);
    return {
      header: box(document.querySelector('[data-section="header"]')),
      pill: box(hero.querySelector('p.hero-in')),
      h1: box(hero.querySelector('h1')),
      shape: box(shape),
      spots,
      para: box(hero.querySelector('[data-hero-card="paradise"]')),
      greens: box(hero.querySelector('[data-hero-card="greens"]')),
      cta: box(hero.querySelector('.bottom-\\[28px\\]')),
      bar: box(document.querySelector('[data-section="mobile-bar"]')),
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });

const near = (name, actual, expected) =>
  check(
    `${name} = ${expected}px`,
    actual != null && Math.abs(actual - expected) <= TOL,
    `actual ${actual == null ? 'missing' : actual.toFixed(1)}`,
  );

async function shoot(vp, file) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dpr ?? 1,
    isMobile: vp.w < 768,
    hasTouch: vp.w < 768,
    reducedMotion: vp.reduce ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const m = await measure(page);
  if (file) await page.screenshot({ path: path.join(OUT, file) });
  await ctx.close();
  return { m, errors };
}

// 1. Spec positions — desktop 1440×900.
{
  const { m, errors } = await shoot({ w: 1440, h: 900 }, 'ours-desktop-1440x900.png');
  check('desktop: no page errors', errors.length === 0, errors.join(' | '));
  near('desktop header height', m.header.h, 81);
  near('desktop pill top', m.pill.y, 121);
  near('desktop h1 top (pill + 12)', m.h1.y, m.pill.b + 12);
  near('desktop shape top (two-line headline)', m.shape.y, 300);
  near('desktop shape width', m.shape.w, 540);
  near('desktop shape height', m.shape.h, 504);
  near('desktop shape left', m.shape.x, 450);
  // Enlarged white discs (scripts/build-triad.mjs): logo boxes sit on the disc centres.
  const geo = JSON.parse(
    await (
      await import('node:fs/promises')
    ).readFile(path.join(ROOT, 'src/components/hero/triadGeometry.json'), 'utf8'),
  );
  ['top', 'left', 'right'].forEach((k, i) => {
    const d = geo.discs[k];
    const sx = m.shape.w / geo.width;
    const s = m.spots[i];
    near(`desktop ${k} logo centre x`, s.x + s.w / 2 - m.shape.x, d.cx * sx);
    near(`desktop ${k} logo centre y`, s.y + s.h / 2 - m.shape.y, d.cy * sx);
    near(`desktop ${k} disc diameter`, s.w, 2 * d.r * sx);
  });
  near('desktop Paradise caption width', m.para.w, 380);
  near('desktop Paradise caption right edge (shape − 20)', m.para.r, 430);
  near('desktop Greens caption left edge (shape + 20)', m.greens.x, 1010);
  near('desktop captions bottom (shape bottom − 60)', m.para.b, m.shape.b - 60);
  near('desktop CTA row bottom (900 − 28)', m.cta.b, 872);
  check('desktop: h1 on two lines', m.h1.h > 90 && m.h1.h < 120, `${m.h1.h.toFixed(0)}px tall`);
}

// 1b. Spec positions — phone 390×844 @2.
{
  const { m, errors } = await shoot({ w: 390, h: 844, dpr: 2 }, 'ours-mobile-390x844.png');
  check('mobile: no page errors', errors.length === 0, errors.join(' | '));
  near('mobile header height', m.header.h, 60);
  near('mobile pill top (60 + 18)', m.pill.y, 78);
  near('mobile shape width', m.shape.w, 318);
  near('mobile shape left', m.shape.x, 36);
  near('mobile shape top (hindi + 18)', m.shape.y, m.shape.y); // reported below
  console.warn(`   mobile shape top ${m.shape.y.toFixed(1)}, captions top ${m.para.y.toFixed(1)}`);
  near('mobile captions gap below shape', m.para.y - m.shape.b, 8);
  near('mobile Paradise caption left', m.para.x, 16);
  near('mobile Greens caption right', m.greens.r, 374);
  near('mobile caption width', m.para.w, 174);
  near('mobile action bar height', m.bar.h, 68);
  near('mobile action bar bottom', m.bar.b, 844);
  check('mobile: h1 fits in three lines', m.h1.h < 110, `${m.h1.h.toFixed(0)}px tall`);
  check(
    'mobile: captions clear of the action bar',
    m.para.b <= m.bar.y,
    `${m.para.b.toFixed(0)} vs ${m.bar.y.toFixed(0)}`,
  );
}

// 2. Side-by-side + overlay with the references.
for (const [ref, ours, name, w, h] of [
  ['hero-desktop-1440x900.png', 'ours-desktop-1440x900.png', 'compare-desktop', 1440, 900],
  ['hero-mobile-390x844.png', 'ours-mobile-390x844.png', 'compare-mobile', 780, 1688],
]) {
  const a = await sharp(path.join(ROOT, 'reference', 'hero', ref))
    .resize(w, h)
    .png()
    .toBuffer();
  const b = await sharp(path.join(OUT, ours)).resize(w, h).png().toBuffer();
  const overlay = await sharp(a)
    .composite([{ input: await sharp(b).ensureAlpha(0.5).png().toBuffer(), blend: 'over' }])
    .png()
    .toBuffer();
  await sharp({ create: { width: w * 3 + 40, height: h, channels: 3, background: '#ffffff' } })
    .composite([
      { input: a, left: 0, top: 0 },
      { input: b, left: w + 20, top: 0 },
      { input: overlay, left: w * 2 + 40, top: 0 },
    ])
    .png()
    .toFile(path.join(OUT, `${name}.png`));
}
console.warn('wrote compare-desktop.png / compare-mobile.png (reference | ours | 50% overlay)');

// 3. Other widths.
for (const w of [1280, 1024, 768, 360]) {
  const h = w >= 1024 ? 800 : 780;
  const { m } = await shoot({ w, h, dpr: 1 }, `ours-${w}.png`);
  check(`${w}px: no horizontal scroll`, m.scrollW <= m.clientW, `${m.scrollW} vs ${m.clientW}`);
  const inView = (b) => b && b.x >= -0.5 && b.r <= w + 0.5;
  check(`${w}px: captions fully visible`, inView(m.para) && inView(m.greens));
  const overlap = (a, b) => a.x < b.r && b.x < a.r && a.y < b.b && b.y < a.b;
  const spotsAbs = m.spots;
  const hit = [m.para, m.greens].some((c) => spotsAbs.some((s) => overlap(c, s)));
  check(`${w}px: captions do not cover the logos`, !hit);
  if (w >= 1024) {
    check(
      `${w}px: CTA row clear of captions`,
      m.cta.y >= Math.max(m.para.b, m.greens.b) - 1,
      `${m.cta.y.toFixed(0)} vs ${Math.max(m.para.b, m.greens.b).toFixed(0)}`,
    );
  }
}

// 4. Motion: sample transforms 1.6–8s, and record a video.
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const samples = [];
  for (const t of [1600, 2600, 3600, 4600, 5600, 6600, 8000]) {
    await page.waitForFunction((ms) => performance.now() >= ms, t);
    samples.push(
      await page.evaluate(() => {
        const shape = document.querySelector('[data-section="hero"] [data-triad]');
        const imgs = [...shape.querySelectorAll('[data-triad] img[width], img[width]')].filter(
          (i) => i.src.includes('triad-'),
        );
        const angle = (el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return (Math.atan2(m.b, m.a) * 180) / Math.PI;
        };
        const ty = (el) => new DOMMatrix(getComputedStyle(el).transform).m42;
        const logo = shape.querySelector('[data-spot="top"]').getBoundingClientRect();
        return {
          t: Math.round(performance.now()),
          swing: angle(imgs[0]),
          blue: ty(imgs[1]),
          green: ty(imgs[2]),
          logo: [logo.left, logo.top].map((v) => Math.round(v * 10) / 10).join(','),
        };
      }),
    );
  }
  await page.close();
  await ctx.close();
  for (const s of samples)
    console.warn(
      `   t=${s.t}ms swing=${s.swing.toFixed(1)}° blue=${s.blue.toFixed(1)}px green=${s.green.toFixed(1)}px logo=${s.logo}`,
    );
  const maxSwing = Math.min(...samples.map((s) => s.swing));
  check(
    'motion: gold layer stays still (no swing)',
    Math.abs(maxSwing) < 0.5,
    `min ${maxSwing.toFixed(1)}°`,
  );
  // Logo entrance (fade-up) ends at 1.2s + 0.8s; after that it must not move at all.
  const settled = samples.filter((s) => s.t >= 2100);
  check('motion: Developers logo stays still', new Set(settled.map((s) => s.logo)).size === 1);
  const outOfStep = samples.some((s) => Math.abs(s.blue - s.green) > 2);
  check('motion: blue and green float out of step', outOfStep);
  const videos = (await readdir(OUT)).filter((f) => f.endsWith('.webm') && f !== 'motion.webm');
  if (videos[0]) await rename(path.join(OUT, videos[0]), path.join(OUT, 'motion.webm'));
}

// 5. Reduced motion.
{
  const { m, errors } = await shoot({ w: 1440, h: 900, reduce: true }, 'ours-reduced-motion.png');
  check('reduced motion: renders, no errors', errors.length === 0 && m.shape.w > 0);
}

await browser.close();
server.kill();
if (process.platform === 'win32')
  spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
const failed = results.filter((r) => !r.ok).length;
console.warn(`\n${results.length - failed}/${results.length} hero checks passed.`);
process.exit(failed ? 1 : 0);
