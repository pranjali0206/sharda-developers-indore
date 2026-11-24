import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../content/site';
import { projects } from '../../content/projects';
import type { ImageName } from '../../generated/images';
import { cx } from '../../lib/cx';
import { Img } from '../ui/Img';
import geometry from './triadGeometry.json';
import tokens from '../../design/tokens.json';

const t = tokens.colors;

/**
 * Circle geometry comes from scripts/build-triad.mjs (traced from the approved
 * reference), so logos and animated rings sit exactly on the white discs.
 */
const { width: W, height: H, discs } = geometry;
export const TRIAD_RATIO = H / W;
type Spot = keyof typeof discs;

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;
/** Box (square, in % of the shape) centred on a disc, `grow` × its diameter. */
function box(spot: Spot, grow = 1): CSSProperties {
  const { cx: x, cy: y, r } = discs[spot];
  const rr = r * grow;
  return {
    left: pct((x - rr) / W),
    top: pct((y - rr) / H),
    width: pct((2 * rr) / W),
    height: pct((2 * rr) / H),
  };
}
const origin = (spot: Spot) => `${pct(discs[spot].cx / W)} ${pct(discs[spot].cy / H)}`;

const LAYERS: {
  spot: Spot;
  src: string;
  pop: number;
  loop: 'swing' | 'float';
  floatDelay?: number;
}[] = [
  { spot: 'top', src: '/assets/triad-top.svg', pop: 0.5, loop: 'swing' },
  { spot: 'left', src: '/assets/triad-left.svg', pop: 0.75, loop: 'float', floatDelay: 1.8 },
  { spot: 'right', src: '/assets/triad-right.svg', pop: 1.0, loop: 'float', floatDelay: 3.3 },
];

const LOGOS: {
  spot: Spot;
  name: ImageName;
  alt: string;
  width: number; // share of the disc diameter
  delay: number;
  ring: [string, string, string]; // neon ring gradient
  href?: string;
  label?: string;
}[] = [
  {
    spot: 'top',
    name: 'sharda-developers-logo',
    alt: 'Sharda Developers',
    width: 0.78,
    delay: 1.2,
    ring: [t['gold-400'], t['royal-600'], t['leaf-600']],
  },
  {
    spot: 'left',
    name: 'sharda-paradise-logo',
    alt: 'Sharda Paradise',
    width: 0.8,
    delay: 1.35,
    ring: [t['royal-600'], t['gold-400'], t['paradise-600']],
    href: projects.paradise.path,
    label: site.home.hero.openProject.paradise,
  },
  {
    spot: 'right',
    name: 'sharda-greens-logo',
    alt: 'Sharda Greens',
    width: 0.82,
    delay: 1.5,
    ring: [t['leaf-600'], t['gold-400'], t['greens-600']],
    href: projects.greens.path,
    label: site.home.hero.openProject.greens,
  },
];

/**
 * Glowing gradient border around a white disc — the same rotating neon effect as the
 * project cards (conic gradient spinning behind a white mask, plus a soft colour glow).
 */
function DiscRing({ colors }: { colors: [string, string, string] }) {
  const style = { '--c1': colors[0], '--c2': colors[1], '--c3': colors[2] } as CSSProperties;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-[-3.5%]" style={style}>
      <span className="disc-neon-glow absolute inset-[-6%] rounded-full" />
      <span className="disc-neon absolute inset-0 rounded-full" />
    </span>
  );
}

/**
 * The approved triad (outline traced from the client's reference): three teardrop
 * layers that pop in one by one; then the gold one swings about its own circle
 * while blue and green float out of step. Logos and rings are separate elements,
 * so they never inherit a layer's motion. Sized by `className` (e.g. w-[540px]).
 */
export function TriadShape({ className }: { className?: string }) {
  return (
    <div className={cx('relative', className)} style={{ aspectRatio: `${W} / ${H}` }} data-triad>
      <div
        aria-hidden
        className="hero-triad-glow pointer-events-none absolute left-[-10%] top-[-6%] h-[128%] w-[120%] rounded-full"
      />
      <div className="absolute inset-0">
        {LAYERS.map((l) => (
          <div
            key={l.spot}
            aria-hidden
            className="hero-pop absolute inset-0"
            style={{ transformOrigin: origin(l.spot), '--d': `${l.pop}s` } as CSSProperties}
          >
            <img
              src={l.src}
              alt=""
              width={W}
              height={H}
              decoding="async"
              draggable={false}
              className={cx(
                'absolute inset-0 h-full w-full select-none',
                l.loop === 'float' && 'hero-float',
              )}
              style={
                {
                  transformOrigin: origin(l.spot),
                  '--d': l.floatDelay ? `${l.floatDelay}s` : undefined,
                } as CSSProperties
              }
            />
          </div>
        ))}

        {LOGOS.map((logo) => {
          const inner = (
            <Img
              name={logo.name}
              alt={logo.alt}
              sizes="(min-width: 1024px) 170px, 100px"
              priority={logo.spot === 'top'}
              className="relative h-auto"
              style={{ width: `${logo.width * 100}%` }}
            />
          );
          const boxCls =
            'relative flex h-full w-full items-center justify-center rounded-full transition-transform duration-[250ms] ease-brand';
          return (
            <div
              key={logo.spot}
              data-spot={logo.spot}
              className="hero-in absolute"
              style={{ ...box(logo.spot), '--d': `${logo.delay}s` } as CSSProperties}
            >
              <DiscRing colors={logo.ring} />
              {logo.href ? (
                <Link
                  to={logo.href}
                  aria-label={logo.label}
                  className={cx(boxCls, 'hover:scale-[1.06]')}
                >
                  {inner}
                </Link>
              ) : (
                <div className={boxCls}>{inner}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
