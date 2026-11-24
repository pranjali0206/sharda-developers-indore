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
const CLIP_SM = 'polygon(8% 11%, 100% 0%, 92% 89%, 0% 100%)';

const CARDS: Card[] = [
  {
    slug: 'paradise',
    image: 'paradise-gate',
    fill: 'linear-gradient(165deg, #081343 0%, #142E86 30%, #2A55D6 62%, #7C9CF0 100%)',
    box: 'left-0 top-0 h-[88%] w-[64%] sm:h-[86%] sm:w-[58%] lg:h-[92%] lg:w-[61%]',
    labelSide: 'left',
    rera: 'left-[6%] bottom-[9%] lg:left-[7%] lg:bottom-[12%]',
    delay: 0.3,
  },
  {
    slug: 'greens',
    image: 'g-gate-day',
    fill: 'linear-gradient(165deg, #01260F 0%, #05501F 30%, #12803C 62%, #6CC08C 100%)',
    box: 'right-0 top-[4%] z-10 h-[96%] w-[64%] sm:top-[3%] sm:h-[97%] sm:w-[58%] lg:top-[16%] lg:h-[84%] lg:w-[50%]',
    labelSide: 'right',
    rera: 'right-[12%] bottom-[14%] lg:right-[19%] lg:bottom-[13%]',
    delay: 0.45,
  },
];

function ProjectCard({ c }: { c: Card }) {
  const project = projects[c.slug];
  const right = c.labelSide === 'right';
  const clip = '[clip-path:var(--clip-sm)] lg:[clip-path:var(--clip)]';
  return (
    <div
      className={cx('hero-panel-in absolute', c.box)}
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
                sizes="(min-width: 1024px) 720px, 66vw"
                priority={c.slug === 'paradise'}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.03]"
              />
            </span>

            <span
              className={cx(
                'absolute top-[15%] flex flex-col lg:top-[14%]',
                right
                  ? 'right-[9%] items-end text-right'
                  : 'left-[15%] items-start text-left lg:left-[18%]',
              )}
            >
              <span className="font-display text-[clamp(19px,5.4vw,30px)] font-semibold leading-[1.08] text-white lg:text-[clamp(22px,2vw,34px)]">
                Sharda
                <br />
                {project.short}
              </span>
              <span
                aria-hidden
                className="mt-2 h-[2px] w-8 rounded-full bg-gold-400 lg:mt-3 lg:w-10"
              />
            </span>

            <span
              className={cx(
                'absolute whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-navy-900 shadow-soft sm:px-2.5 sm:py-1 sm:text-[11px]',
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
      className="relative -mt-[74px] overflow-hidden pb-[104px] pt-[104px] md:pb-28 lg:-mt-[81px] lg:flex lg:h-[100svh] lg:min-h-[721px] lg:items-center lg:pb-[7vh] lg:pt-[81px]"
    >
      <HeroBackground />

      <div className="relative z-[1] grid w-full items-center gap-10 px-4 lg:grid-cols-[1fr_60%] lg:gap-8 lg:px-6 xl:px-16">
        {/* Copy — centred on phones/tablets; on desktop every line starts on the same x */}
        <div className="mx-auto max-w-[620px] text-center lg:mx-0 lg:text-left">
          <h1
            id="hero-title"
            className="hero-rise font-display text-[clamp(42px,12.5vw,72px)] font-extrabold leading-[1.02] tracking-[-0.025em] text-navy-900 lg:text-[clamp(48px,5.2vw,84px)] lg:leading-[1]"
            style={d(0.05)}
          >
            {/* the big “S” overhangs slightly; pull it back onto the column line */}
            <span className="block lg:-ml-[0.035em]">Sharda</span>{' '}
            <span className="block lg:-ml-[0.035em]">
              Developers<span className="lg:hidden">.</span>
            </span>{' '}
            <span className="mt-3 block text-[clamp(20px,5.6vw,32px)] font-semibold leading-[1.2] tracking-[-0.01em] text-green-700 lg:mt-[18px] lg:text-[clamp(24px,2.4vw,38px)] lg:font-semibold lg:leading-[1.15] lg:tracking-[-0.01em]">
              {h.headline.accent}
            </span>
          </h1>

          <span
            aria-hidden
            className="hero-in mx-auto mt-5 block h-[3px] w-[80%] max-w-[420px] rounded-full bg-gradient-to-r from-transparent via-gold-400 to-transparent lg:mx-0 lg:mt-7 lg:w-16 lg:bg-gold-400 lg:bg-none"
            style={d(0.2)}
          />

          <p
            lang="hi"
            data-hindi-quote
            className="hero-in mt-4 font-hindi text-[clamp(19px,5.2vw,26px)] font-semibold leading-[1.4] text-navy-900 lg:mt-5 lg:text-[clamp(20px,1.8vw,28px)] lg:font-medium lg:text-navy-900/85"
            style={d(0.28)}
          >
            &ldquo;{h.hindi}&rdquo;
          </p>

          <div className="hero-in mt-6 lg:mt-9" style={d(0.4)}>
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
        <div className="relative mx-auto aspect-[1.13] w-full max-w-[680px] sm:aspect-[1.55] lg:aspect-auto lg:h-[clamp(440px,min(calc((100svh-81px)*0.9),44vw),860px)] lg:max-w-none">
          {CARDS.map((c) => (
            <ProjectCard key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
