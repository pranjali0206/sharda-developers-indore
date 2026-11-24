import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { site } from '../../content/site';
import { projects } from '../../content/projects';
import type { ImageName } from '../../generated/images';
import { cx } from '../../lib/cx';
import { Img } from '../ui/Img';
import { HeroBackground } from './HeroBackground';

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

/**
 * Project cards: tall parallelograms (clip-path; no rotation, skew or 3D), staggered.
 *  - Group: 60% of the hero container, flush right; height 90% of the visible hero
 *    (≤ 860px, and ≤ 44vw so cards stay ~0.85–0.9 wide-to-tall). Paradise: left 0, top 0,
 *    61% × 92%. Greens: right 0, top 16%, 50% × 84%, in front. Paradise's slanted right
 *    edge runs just under Greens' parallel left edge, forming one seam.
 *  - The gate render (16:9) sits at the bottom at full card width, never cropped or
 *    stretched; the project colour (deep at the top corner, lightening downward) fills
 *    the space above, and the photo's top 16% dissolves into it via a mask (no tint).
 */
interface Card {
  slug: 'paradise' | 'greens';
  image: ImageName;
  /** Project colour: deep at the top corner, lightening down toward the gate photo */
  fill: string;
  /** Desktop/tablet box inside the group */
  box: string;
  labelSide: 'left' | 'right';
  rera: string;
  delay: number;
}

const CLIP = 'polygon(14% 9%, 100% 0%, 86% 91%, 0% 100%)';
const CLIP_SM = 'polygon(7% 4.5%, 100% 0%, 93% 95.5%, 0% 100%)';

const CARDS: Card[] = [
  {
    slug: 'paradise',
    image: 'paradise-gate',
    fill: 'linear-gradient(165deg, #081343 0%, #142E86 30%, #2A55D6 62%, #7C9CF0 100%)',
    box: 'sm:left-0 sm:top-0 sm:h-[92%] sm:w-[61%]',
    labelSide: 'left',
    rera: 'left-[8%] bottom-[11%] sm:left-[7%] sm:bottom-[12%]',
    delay: 0.3,
  },
  {
    slug: 'greens',
    image: 'g-gate-day',
    fill: 'linear-gradient(165deg, #01260F 0%, #05501F 30%, #12803C 62%, #6CC08C 100%)',
    box: 'sm:right-0 sm:top-[16%] sm:z-10 sm:h-[84%] sm:w-[50%]',
    labelSide: 'right',
    rera: 'right-[10%] bottom-[8%] sm:right-[19%] sm:bottom-[13%]',
    delay: 0.45,
  },
];

function ProjectCard({ c }: { c: Card }) {
  const project = projects[c.slug];
  const right = c.labelSide === 'right';
  const clip = '[clip-path:var(--clip-sm)] sm:[clip-path:var(--clip)]';
  return (
    <div
      className={cx(
        'hero-panel-in relative aspect-[0.95] w-full sm:absolute sm:aspect-auto',
        c.box,
      )}
      style={{ '--clip': CLIP, '--clip-sm': CLIP_SM, '--d': `${c.delay}s` } as CSSProperties}
    >
      {/* Unclipped parent carries the shadow (box-shadow would be cut by clip-path). */}
      <Link
        to={project.path}
        data-hero-card={c.slug}
        aria-label={`${project.name} — view project`}
        className="group block h-full w-full transition duration-300 ease-brand [filter:drop-shadow(0_24px_40px_rgba(20,35,90,0.18))] hover:-translate-y-1.5 hover:[filter:drop-shadow(0_32px_48px_rgba(20,35,90,0.28))]"
      >
        {/* white seam: same shape, card inset by 4px */}
        <span className={cx('relative block h-full w-full bg-white', clip)}>
          <span
            className={cx('absolute inset-[4px] block overflow-hidden', clip)}
            style={{ background: c.fill }}
          >
            {/* photo at the bottom, full width, natural 16:9; its top edge dissolves into
                the colour (a mask, so the photo itself is never tinted) */}
            <span className="absolute inset-x-0 bottom-0 block aspect-[16/9] [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%)]">
              <Img
                name={c.image}
                alt={`${project.name} entrance gate`}
                sizes="(min-width: 1024px) 720px, (min-width: 640px) 60vw, 100vw"
                priority={c.slug === 'paradise'}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.03]"
              />
            </span>

            <span
              className={cx(
                'absolute top-[14%] flex flex-col',
                right ? 'right-[9%] items-end text-right' : 'left-[18%] items-start text-left',
              )}
            >
              <span className="font-display text-[clamp(22px,2vw,34px)] font-semibold leading-[1.08] text-white">
                Sharda
                <br />
                {project.short}
              </span>
              <span aria-hidden className="mt-3 h-[2px] w-10 rounded-full bg-gold-400" />
            </span>

            <span
              className={cx(
                'absolute rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-navy-900 shadow-soft sm:text-[11px]',
                c.rera,
              )}
            >
              RERA {project.rera}
            </span>
          </span>
        </span>
      </Link>
    </div>
  );
}

/**
 * Home hero — open sky, left-aligned copy (42%) and two slanted project cards (58%)
 * showing the full entrance gates. Uses the navbar's own horizontal padding so the
 * headline lines up with the logo and the cards end where the nav button ends.
 */
export function HeroShowcase() {
  const h = site.home.hero;
  return (
    <section
      aria-labelledby="hero-title"
      data-section="hero"
      className="relative -mt-[60px] overflow-hidden pb-[120px] pt-[96px] md:pb-24 lg:-mt-[81px] lg:flex lg:h-[100svh] lg:min-h-[721px] lg:items-center lg:pb-[7vh] lg:pt-[81px]"
    >
      <HeroBackground />

      <div className="relative z-[1] grid w-full items-center gap-12 px-4 lg:grid-cols-[1fr_60%] lg:gap-8 lg:px-6 xl:px-16">
        {/* Copy — every line starts on the same x */}
        <div className="max-w-[620px]">
          <h1
            id="hero-title"
            className="hero-rise font-display text-[clamp(48px,5.2vw,84px)] font-extrabold leading-[1] tracking-[-0.02em] text-navy-900"
            style={d(0.05)}
          >
            {/* the big “S” overhangs slightly; pull it back onto the column line */}
            <span className="-ml-[0.035em] block">Sharda</span>{' '}
            <span className="-ml-[0.035em] block">Developers</span>{' '}
            <span className="mt-[18px] block text-[clamp(24px,2.4vw,38px)] font-semibold leading-[1.15] tracking-[-0.01em] text-green-700">
              {h.headline.accent}
            </span>
          </h1>

          <span
            aria-hidden
            className="hero-in mt-7 block h-[3px] w-16 rounded-full bg-gold-400"
            style={d(0.2)}
          />

          <p
            lang="hi"
            data-hindi-quote
            className="hero-in mt-5 font-hindi text-[clamp(20px,1.8vw,28px)] font-medium leading-[1.4] text-navy-900/85"
            style={d(0.28)}
          >
            &ldquo;{h.hindi}&rdquo;
          </p>

          <div className="hero-in mt-9" style={d(0.4)}>
            <a
              href="#visit"
              className="group inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-navy-900 px-7 font-display text-[16px] font-bold text-white shadow-[0_14px_30px_rgba(20,38,80,0.22)] transition hover:-translate-y-0.5 hover:bg-navy-700"
            >
              {site.nav.book}
              <ArrowRight
                aria-hidden
                className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1"
                strokeWidth={2.2}
              />
            </a>
          </div>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-6 sm:relative sm:block sm:h-[66vh] sm:min-h-[500px] sm:w-full lg:h-[clamp(440px,min(calc((100svh-81px)*0.9),44vw),860px)]">
          {CARDS.map((c) => (
            <ProjectCard key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
