/**
 * Builds the three hero triad layers from the traced reference outlines
 * (scripts/triad-paths.json, produced by scripts/trace-triad.py from
 * reference/hero/triad-reference.jpg), recoloured to the Sharda palette:
 *   triad-top.svg   gold   — Sharda Developers
 *   triad-left.svg  royal  — Sharda Paradise
 *   triad-right.svg green  — Sharda Greens
 * All layers share one 540×504 canvas so they stack with inset:0.
 *
 * White discs are enlarged from the reference (DISC_SCALE) so each logo has more room.
 * The disc geometry is exported to src/components/hero/triadGeometry.json so the React
 * component positions logos and the animated rings on exactly the same circles.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const data = JSON.parse(await readFile(path.join(ROOT, 'scripts/triad-paths.json'), 'utf8'));
const [W, H] = data.viewBox;
const DISC_SCALE = 1.12; // bigger white circles than the reference (more space for logos)

const COLORS = {
  top: ['#F6C640', '#E3A512'],
  left: ['#3A64E4', '#1F3FB2'],
  right: ['#2AA24C', '#127A33'],
};

const geometry = { width: W, height: H, discs: {} };

for (const name of ['top', 'left', 'right']) {
  const [cx, cy, r0] = data.discs[name];
  const r = +(r0 * DISC_SCALE).toFixed(2);
  geometry.discs[name] = { cx, cy, r };
  const [from, to] = COLORS[name];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient>
  <radialGradient id="disc" cx="0.45" cy="0.4" r="0.62">
    <stop offset="0.74" stop-color="#ffffff"/><stop offset="1" stop-color="#E9EDF5"/>
  </radialGradient>
  <filter id="drop" x="-30%" y="-30%" width="160%" height="170%">
    <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#142650" flood-opacity="0.2"/>
  </filter>
  <filter id="inner" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="5" dy="8" stdDeviation="6" flood-color="#0B1630" flood-opacity="0.3"/>
  </filter>
</defs>
<g filter="url(#drop)"><path d="${data.paths[name]}" fill="url(#g)"/></g>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#disc)" filter="url(#inner)"/>
</svg>
`;
  await writeFile(path.join(ROOT, 'public/assets', `triad-${name}.svg`), svg);
  console.warn(`wrote triad-${name}.svg (disc r=${r})`);
}

await writeFile(
  path.join(ROOT, 'src/components/hero/triadGeometry.json'),
  JSON.stringify(geometry, null, 2) + '\n',
);
console.warn('wrote src/components/hero/triadGeometry.json');
