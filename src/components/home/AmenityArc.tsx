import type { CSSProperties } from 'react';
import { ArrowDown } from 'lucide-react';
import { site } from '../../content/site';
import type { ImageName } from '../../generated/images';
import { cx } from '../../lib/cx';
import { FxScope, Sparkles } from '../fx/Effects';
import { Img } from '../ui/Img';

const CARDS: { image: ImageName; label: string; phone?: boolean }[] = [
  { image: 'p-linear-park', label: 'Linear park' },
  { image: 'g-gazebo', label: 'Garden gazebo', phone: true },
  { image: 'p-kids-play', label: "Children's play area", phone: true },
  { image: 'p-jacaranda-walk', label: 'Jacaranda walk', phone: true },
  { image: 'p-sports-court', label: 'Sports court & jogging track', phone: true },
  { image: 'g-circle-garden', label: 'Circular garden' },
  { image: 'p-pergola', label: 'Pergola by the water', phone: true },
  { image: 'p-lawn-gym', label: 'Lawns & open gym', phone: true },
  { image: 'g-pavilion', label: 'Garden pavilion' },
  { image: 'p-open-lawn', label: 'Open lawn', phone: true },
  { image: 'g-sculpture', label: 'Sculpture court' },
];

/** Arc geometry: phones use a 180° semicircle of 7 cards; tablet/desktop a 220° arc of all 11. */
const PHONE = { rx: 132, ry: 150, from: 180, span: 180 };
const TABLET = { rx: 340, ry: 300, from: 160, span: 220 };
const DESKTOP = { rx: 600, ry: 430, from: 160, span: 220 };

function pos(g: { rx: number; ry: number; from: number; span: number }, i: number, n: number) {
  const deg = g.from + (g.span * i) / (n - 1);
  const a = (deg * Math.PI) / 180;
  return {
    x: `${(Math.cos(a) * g.rx).toFixed(1)}px`,
    y: `${(Math.sin(a) * g.ry).toFixed(1)}px`,
    r: `${((deg - 270) * 0.45).toFixed(1)}deg`,
  };
}

const phoneCards = CARDS.filter((c) => c.phone);

function place(i: number) {
  const c = CARDS[i]!;
  const pi = phoneCards.indexOf(c);
  const s = pi >= 0 ? pos(PHONE, pi, phoneCards.length) : { x: '0px', y: '0px', r: '0deg' };
  const m = pos(TABLET, i, CARDS.length);
  const l = pos(DESKTOP, i, CARDS.length);
  return {
    '--xs': s.x,
    '--ys': s.y,
    '--rs': s.r,
    '--xm': m.x,
    '--ym': m.y,
    '--rm': m.r,
    '--xl': l.x,
    '--yl': l.y,
    '--rl': l.r,
    '--d': `${0.05 * Math.abs(i - (CARDS.length - 1) / 2)}s`,
  } as CSSProperties;
}

/** "Breathe. Build. Belong." — amenity renders fanned in a half circle, text at the centre. */
export function AmenityArc() {
  const l = site.home.life;
  return (
    <FxScope>
      <section
        aria-labelledby="life-title"
        data-section="life"
        className="section-pad overflow-hidden bg-white"
      >
        <div className="container-content">
          <div data-reveal="arc" className="relative mx-auto max-w-[1240px]">
            {/* the arc */}
            <div className="relative h-[240px] md:h-[660px] lg:h-[840px]">
              <div className="absolute left-1/2 top-[195px] h-0 w-0 md:top-[380px] lg:top-[540px]">
                {CARDS.map((c, i) => (
                  <figure
                    key={c.image}
                    className={cx(
                      'arc-card group w-[64px] [--r:var(--rs)] [--x:var(--xs)] [--y:var(--ys)]',
                      'md:w-[112px] md:[--r:var(--rm)] md:[--x:var(--xm)] md:[--y:var(--ym)]',
                      'lg:w-[150px] lg:[--r:var(--rl)] lg:[--x:var(--xl)] lg:[--y:var(--yl)]',
                      !c.phone && 'max-md:hidden',
                    )}
                    style={place(i)}
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[16px] bg-navy-100 shadow-card ring-[3px] ring-white transition duration-500 ease-brand group-hover:-translate-y-2 group-hover:shadow-lift md:rounded-[24px] md:ring-4">
                      <Img
                        name={c.image}
                        alt={c.label}
                        sizes="(min-width: 1024px) 150px, (min-width: 768px) 112px, 64px"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <figcaption className="pointer-events-none absolute inset-x-0 -bottom-7 hidden whitespace-nowrap text-center text-xs font-semibold text-navy-900 opacity-0 transition-opacity group-hover:opacity-100 lg:block">
                      {c.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {/* text: below the arc on phones, at its centre from tablet up */}
            <div className="relative mx-auto max-w-[520px] text-center md:absolute md:left-1/2 md:top-[380px] md:w-[400px] md:-translate-x-1/2 md:-translate-y-[40%] lg:top-[540px] lg:w-[520px]">
              <p className="eyebrow">{l.eyebrow}</p>
              <h2
                id="life-title"
                className="mt-3 font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] text-navy-900 md:mt-4 md:text-[46px] lg:text-[60px]"
              >
                {l.h2}
              </h2>
              <Sparkles className="mt-4 md:mt-5" />
              <p className="mx-auto mt-5 max-w-[42ch] text-[16px] font-medium leading-relaxed text-ink-600 md:text-[17px]">
                {l.body}
              </p>
              <a
                href="#amenities"
                className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-navy-900 px-6 text-[15px] font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-navy-700"
              >
                {l.cta}
                <ArrowDown aria-hidden className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </FxScope>
  );
}
