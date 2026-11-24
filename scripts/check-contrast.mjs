/**
 * WCAG AA contrast check for every text/background token pair used on the site.
 * Body text needs 4.5:1; large text (24px+, or 18.66px+ bold) needs 3:1.
 * Run: npm run check:contrast  (exits 1 on any failure)
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const tokens = JSON.parse(
  await readFile(path.resolve(import.meta.dirname, '../src/design/tokens.json'), 'utf8'),
).colors;

const hex = (h) =>
  h
    .replace('#', '')
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => {
  const [r, g, b] = hex(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** Blend a foreground with alpha over a background. */
const over = (fg, a, bg) => {
  const f = hex(fg);
  const b = hex(bg);
  return (
    '#' +
    f
      .map((c, i) =>
        Math.round((c * a + b[i] * (1 - a)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const t = (k) => {
  if (!tokens[k]) throw new Error(`Unknown token ${k}`);
  return tokens[k];
};

// [foreground, background, size: 'body' | 'large', where]
const pairs = [
  ['navy-900', 'bg', 'body', 'Headlines / primary text on page background'],
  ['navy-900', 'white', 'body', 'Primary text on cards'],
  ['navy-900', 'cream', 'body', 'Headlines on cream (Chapter 2, Paradise)'],
  ['navy-900', 'mint', 'body', 'Headlines on mint (Greens)'],
  ['ink-600', 'bg', 'body', 'Body text'],
  ['ink-600', 'white', 'body', 'Body text on cards'],
  ['ink-600', 'cream', 'body', 'Body text on cream'],
  ['ink-600', 'mint', 'body', 'Body text on mint'],
  ['ink-500', 'bg', 'body', 'Secondary / eyebrow-grey text'],
  ['ink-500', 'white', 'body', 'Secondary text on cards'],
  ['ink-500', 'cream', 'body', 'Secondary text on cream'],
  ['ink-500', 'mint', 'body', 'Secondary text on mint'],
  ['green-700', 'bg', 'body', 'H1 accent "starts here." / headline accent'],
  ['green-700', 'cream', 'body', 'Headline accent on cream'],
  ['green-700', 'white', 'body', 'Check icons / Thank-you punchline'],
  ['gold-ink', 'bg', 'body', 'Eyebrows, punchlines'],
  ['gold-ink', 'white', 'body', 'Eyebrows on white panels'],
  ['gold-ink', 'cream', 'body', 'Eyebrows / punchlines on cream'],
  ['gold-ink', 'mint', 'body', 'Eyebrows on mint'],
  ['navy-700', 'white', 'body', 'Paradise punchline, links'],
  ['navy-700', 'bg', 'body', 'Hindi accent lines'],
  ['navy-700', 'cream', 'body', 'Hindi accent on cream'],
  ['navy-700', 'mint', 'body', 'Hindi accent on mint'],
  ['teal-650', 'white', 'body', 'Greens punchline on white'],
  ['teal-650', 'mint', 'body', 'Greens text on mint'],
  ['teal-650', 'teal-100', 'body', 'Greens icon tile'],
  ['navy-700', 'navy-100', 'body', 'Paradise icon tile'],
  ['white', 'navy-700', 'body', 'Primary button'],
  ['white', 'navy-900', 'body', 'Text on navy section'],
  ['white', 'teal-700', 'body', 'Greens button'],
  ['white', 'green-700', 'body', 'WhatsApp button / mobile bar'],
  ['gold-400', 'navy-900', 'large', 'Gold H2 accent on navy (Chapter 4)'],
  ['gold-400', 'navy-950', 'body', 'Footer column headings (eyebrow)'],
  ['navy-900', 'gold-400', 'body', 'Phone icon on gold disc'],
  ['navy-900', 'gold-200', 'body', 'Form error notice / Ongoing chip'],
  ['green-700', 'green-100', 'body', 'Completed status chip'],
  ['red-error', 'white', 'body', 'Form field errors'],
  ['white', 'navy-950', 'body', 'Footer text'],
  ['ivory', 'royal-800', 'body', 'About band body text (ivory on royal blue)'],
  ['gold-400', 'royal-800', 'body', 'About band eyebrow / values'],
  ['royal-800', 'white', 'body', 'Paradise accents on white'],
  ['royal-800', 'ivory', 'body', 'Paradise accents on ivory'],
  ['royal-800', 'royal-100', 'body', 'Paradise RERA chip / icon tile'],
  ['navy-900', 'ivory', 'body', 'Headlines on ivory'],
  ['ink-600', 'ivory', 'body', 'Body text on ivory'],
  ['gold-ink', 'ivory', 'body', 'Eyebrows / punchline on ivory'],
  ['green-700', 'ivory', 'body', 'Headline accent on ivory'],
  ['royal-600', 'cream', 'large', 'Gradient accent (Paradise hero)'],
  ['leaf-600', 'mint', 'large', 'Gradient accent (Greens hero)'],
];

// Alpha-blended pairs used on dark backgrounds.
const blended = [
  [over(t('white'), 0.8, t('navy-900')), t('navy-900'), 'body', 'white/80 body on navy section'],
  [
    over(t('white'), 0.7, t('navy-900')),
    t('navy-900'),
    'body',
    'white/70 small text on navy section',
  ],
  [over(t('white'), 0.6, t('navy-950')), t('navy-950'), 'body', 'white/60 disclaimer in footer'],
  [over(t('white'), 0.65, t('navy-950')), t('navy-950'), 'body', 'white/65 footer secondary'],
];

let fail = 0;
const rows = [
  ...pairs.map(([f, b, s, w]) => [t(f), t(b), s, `${f} on ${b} — ${w}`]),
  ...blended.map(([f, b, s, w]) => [f, b, s, w]),
];
for (const [f, b, size, label] of rows) {
  const r = ratio(f, b);
  const min = size === 'large' ? 3 : 4.5;
  const ok = r >= min;
  if (!ok) fail++;
  console.warn(`${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)}:1 (min ${min}) ${label}`);
}
console.warn(fail ? `\n${fail} pair(s) fail WCAG AA.` : `\nAll ${rows.length} pairs pass WCAG AA.`);
process.exit(fail ? 1 : 0);
