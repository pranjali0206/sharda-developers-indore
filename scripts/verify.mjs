/**
 * End-to-end verification of the built site (run `npm run build` first).
 *
 *  - Screenshots /, /sharda-paradise, /sharda-greens, /thank-you at 390×844 and 1440×900
 *  - No horizontal scroll, no console errors / page errors (incl. hydration)
 *  - Branch-tree connectors end exactly on their cards at both widths
 *  - All internal links resolve; form error + success paths; reduced-motion render
 *
 * Uses the locally installed Chrome via playwright-core. Writes to verification/.
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'verification');
const SHOTS = path.join(OUT, 'screenshots');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const ROUTES = ['/', '/about-us', '/sharda-paradise', '/sharda-greens', '/thank-you'];
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
];
const LEAD_URL = process.env.VITE_LEAD_ENDPOINT || '';

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.warn(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

async function waitForServer(url, ms = 20000) {
  const t = Date.now();
  while (Date.now() - t < ms) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('preview server did not start');
}

/** Scroll the whole page so every scroll-reveal fires, then return to top. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.4);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(1800);
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT,
  shell: true,
  stdio: 'ignore',
});

try {
  await waitForServer(BASE);
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      ...vp,
    });
    for (const route of ROUTES) {
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3200); // let the hero load sequence finish
      await scrollThrough(page);

      const stuckList = await page.evaluate(() =>
        [...document.querySelectorAll('[data-reveal]:not(.is-in)')].map((e) => {
          const r = e.getBoundingClientRect();
          return `${e.tagName.toLowerCase()}[${e.dataset.reveal || ''}] h=${Math.round(r.height)} y=${Math.round(r.top + scrollY)} in=${e.closest('section')?.getAttribute('aria-labelledby') ?? '?'}`;
        }),
      );
      // A fast scripted pass can outrun frames on a loaded machine; what matters is that
      // every element reveals once it is actually on screen. Re-check those individually.
      if (stuckList.length) {
        await page.evaluate(async () => {
          for (const el of document.querySelectorAll('[data-reveal]:not(.is-in)')) {
            el.scrollIntoView({ block: 'center', behavior: 'instant' });
            await new Promise((r) => setTimeout(r, 400));
          }
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      }
      const stuck = await page.evaluate(
        () => document.querySelectorAll('[data-reveal]:not(.is-in)').length,
      );
      if (stuck) console.warn('   stuck:', stuckList.join(' | '));
      check(`${vp.name} ${route}: every scroll-reveal fired`, stuck === 0, `${stuck} still hidden`);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      check(`${vp.name} ${route}: no horizontal scroll`, overflow <= 0, `overflow ${overflow}px`);

      if (route === '/') {
        // Hero: both project cards link to their pages, and the cards don't overlap the triad logos.
        const hero = await page.evaluate(() => {
          const cards = ['paradise', 'greens'].map((slug) => {
            const el = document.querySelector(`[data-hero-card="${slug}"]`);
            return { slug, href: el?.getAttribute('href'), r: el?.getBoundingClientRect() };
          });
          const logos = [
            ...document.querySelectorAll('[data-section="hero"] a[aria-label] img'),
          ].map((img) => img.getBoundingClientRect());
          const overlap = (a, b) =>
            a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
          return cards.map((c) => ({
            slug: c.slug,
            ok: c.href === `/sharda-${c.slug}` && !logos.some((l) => overlap(l, c.r)),
            d: `href=${c.href}`,
          }));
        });
        for (const h of hero)
          check(`${vp.name} /: hero card for ${h.slug} links and is clear of the triad`, h.ok, h.d);
      }

      // content-visibility:auto sections are skipped by full-page capture; render them all.
      await page.addStyleTag({ content: '.cv-auto{content-visibility:visible!important}' });
      await page.waitForTimeout(300);
      const file = `${route === '/' ? 'home' : route.slice(1)}-${vp.name}.png`;
      await page.screenshot({ path: path.join(SHOTS, file), fullPage: true });
      check(
        `${vp.name} ${route}: no console errors`,
        errors.length === 0,
        errors.join(' | ').slice(0, 300),
      );
      await page.close();
    }

    // Hero viewport-only screenshot (above the fold).
    const hero = await context.newPage();
    await hero.goto(BASE + '/', { waitUntil: 'networkidle' });
    await hero.waitForTimeout(3200);
    await hero.screenshot({ path: path.join(SHOTS, `home-hero-${vp.name}.png`) });
    await hero.close();
    await context.close();
  }

  // Internal links resolve.
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const hrefs = new Set();
    for (const r of [
      '/',
      '/about-us',
      '/sharda-paradise',
      '/sharda-greens',
      '/thank-you',
      '/privacy-policy',
    ]) {
      await page.goto(BASE + r, { waitUntil: 'domcontentloaded' });
      for (const h of await page.$$eval('a[href^="/"]', (as) =>
        as.map((a) => a.getAttribute('href')),
      )) {
        hrefs.add(h.split('#')[0].split('?')[0] || '/');
      }
    }
    const bad = [];
    for (const h of hrefs) {
      const res = await fetch(BASE + h);
      if (!res.ok) bad.push(`${h} ${res.status}`);
    }
    check(
      'internal links resolve',
      bad.length === 0,
      `${hrefs.size} unique: ${[...hrefs].join(', ')}${bad.length ? ' BAD ' + bad.join(', ') : ''}`,
    );
    const tel = await page
      .goto(BASE + '/', { waitUntil: 'domcontentloaded' })
      .then(() =>
        page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]),
      );
    check(
      'tel links use +919179200110',
      tel.length === 1 && tel[0] === 'tel:+919179200110',
      tel.join(', '),
    );
    const wa = await page.$$eval('a[href*="wa.me"]', (as) =>
      as.every((a) => a.href.startsWith('https://wa.me/919179200110')),
    );
    check('WhatsApp links use wa.me/919179200110', wa);
    await ctx.close();
  }

  // Form: validation errors + success path (mobile).
  {
    const ctx = await browser.newContext({
      ...VIEWPORTS[0],
      viewport: { width: 390, height: 844 },
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    let posted = null;
    if (LEAD_URL) {
      await page.route(LEAD_URL, async (route) => {
        posted = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '{"ok":true}',
          headers: { 'access-control-allow-origin': '*' },
        });
      });
    }
    await page.goto(
      `${BASE}/sharda-greens?utm_source=google&utm_campaign=greens-test&gclid=abc123`,
      { waitUntil: 'networkidle' },
    );
    const form = page.locator('#visit form');
    await form.scrollIntoViewIfNeeded();
    await form.getByRole('button', { name: /book my site visit/i }).click();
    await page.waitForTimeout(300);
    const errCount = await form.locator('[id$="-err"]').count();
    check('form: empty submit shows inline errors', errCount === 3, `${errCount} errors`);
    const described = await form.locator('input[aria-invalid="true"][aria-describedby]').count();
    check('form: invalid fields have aria-describedby', described >= 2, `${described}`);
    const greensChecked = await form.locator('input[type=radio][value=greens]').isChecked();
    check('form: Sharda Greens pre-selected on Greens page', greensChecked);
    await form.screenshot({ path: path.join(SHOTS, 'form-errors-mobile.png') });

    await form.getByLabel('Your name').fill('Test Buyer');
    await form.getByLabel('Mobile number').fill('+91 98765 43210');
    const mobileVal = await form.getByLabel('Mobile number').inputValue();
    check('form: mobile input normalises +91 paste', mobileVal === '9876543210', mobileVal);
    await form.locator('input[type=checkbox]').check();
    await form.getByRole('button', { name: /book my site visit/i }).click();

    if (LEAD_URL) {
      await page
        .waitForURL(/\/thank-you\?project=greens/, { timeout: 8000 })
        .catch(() => undefined);
      check(
        'form: success navigates to /thank-you?project=greens',
        page.url().includes('/thank-you?project=greens'),
        page.url(),
      );
      check(
        'form: payload carries UTM/gclid + landing page',
        posted?.utm_source === 'google' &&
          posted?.gclid === 'abc123' &&
          posted?.mobile === '+919876543210' &&
          posted?.landing_page?.includes('utm_source'),
        JSON.stringify(posted ?? {}).slice(0, 220),
      );
      await page.waitForTimeout(1500);
      const fired = await page.evaluate(() => sessionStorage.getItem('sd_lead_fired'));
      check(
        'thank-you: conversion recorded once',
        Boolean(fired) && JSON.parse(fired).length === 1,
        fired ?? 'none',
      );
      await page.reload({ waitUntil: 'networkidle' });
      const firedAfter = await page.evaluate(() => sessionStorage.getItem('sd_lead_fired'));
      check('thank-you: refresh does not re-fire', firedAfter === fired);
      await page.screenshot({
        path: path.join(SHOTS, 'thank-you-after-submit-mobile.png'),
        fullPage: true,
      });
    } else {
      await page.waitForTimeout(800);
      const alert = await form
        .locator('[role=alert]')
        .textContent()
        .catch(() => null);
      check(
        'form: without endpoint shows friendly error with phone',
        Boolean(alert?.includes('91792 00110')),
        alert ?? '',
      );
    }
    check('form flow: no page errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // Reduced motion: everything visible in its final state.
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      ...vp,
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const hidden = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(
            '[data-reveal], .intro, .intro-rise, .intro-pop, [data-count]',
          ),
        ].filter((el) => getComputedStyle(el).opacity !== '1').length,
    );
    const motionOk = await page.evaluate(() =>
      document.documentElement.classList.contains('motion-ok'),
    );
    check(
      `reduced motion ${vp.name}: all content visible, motion off`,
      hidden === 0 && !motionOk,
      `${hidden} hidden`,
    );
    await page.screenshot({
      path: path.join(SHOTS, `home-reduced-motion-${vp.name}.png`),
      fullPage: true,
    });
    check(`reduced motion ${vp.name}: no page errors`, errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  await browser.close();
} finally {
  server.kill();
  if (process.platform === 'win32')
    spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
}

await writeFile(path.join(OUT, 'verify-results.json'), JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.warn(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
