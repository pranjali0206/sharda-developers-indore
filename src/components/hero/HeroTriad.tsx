import type { CSSProperties } from 'react';
import { Phone } from 'lucide-react';
import { config } from '../../config';
import { site } from '../../content/site';
import { cx } from '../../lib/cx';
import { FxScope } from '../fx/Effects';
import { HeroBackground } from './HeroBackground';
import { ProjectCaption } from './ProjectCaption';
import { TriadShape } from './TriadShape';

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

/**
 * Home hero — approved design (desktop 1440×900, phone 390×844).
 *  - Desktop (≥ 1024px): fixed 900px stage; headline centred; captions either side of the
 *    triad (top 286px); call + book row 28px from the bottom.
 *  - Tablet (768–1023px): phone structure, triad 420px, desktop-size captions, no bar.
 *  - Phone (< 768px): stacked; fixed action bar (rendered by the layout).
 * The sticky site header overlays the top of the hero (negative top margin).
 */
export function HeroTriad() {
  const h = site.home.hero;
  return (
    <FxScope className="relative">
      <section
        aria-labelledby="hero-title"
        data-section="hero"
        className="relative -mt-[60px] min-h-[100svh] overflow-hidden bg-white pb-[96px] md:pb-16 lg:-mt-[81px] lg:h-[900px] lg:min-h-0 lg:pb-0"
      >
        <HeroBackground />

        {/* Headline block */}
        <div className="relative z-[1] flex flex-col items-center px-4 pt-[78px] text-center lg:gap-3 lg:px-0 lg:pt-[121px]">
          <p
            className="hero-in inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-semibold uppercase leading-[1.25] tracking-[0.14em] text-navy-900 md:gap-2.5 md:px-4 md:py-[7px] md:text-[12px]"
            style={d(0.05)}
          >
            <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-gold-400 md:h-2 md:w-2" />
            {h.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="hero-rise mt-3 text-balance font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] text-navy-900 min-[380px]:text-[32px] md:max-w-none md:text-[44px] lg:mt-0 lg:text-[50px] lg:leading-[1.06]"
            style={d(0.15)}
          >
            {h.headline.lead} <span className="block text-green-700">{h.headline.accent}</span>
          </h1>

          <p
            lang="hi"
            className="hero-in mt-2 font-hindi text-[17px] font-semibold leading-[1.35] text-ink-500 lg:mt-0 lg:text-[22px]"
            style={d(0.3)}
          >
            {h.hindi}
          </p>
        </div>

        {/* Triad + captions: one row on desktop, shape-over-captions on phones/tablets */}
        <div
          className={cx(
            'relative z-[1] mx-auto mt-[18px] grid w-full max-w-[420px] grid-cols-2 gap-x-[10px] gap-y-2 px-4 md:max-w-[720px] md:gap-x-5',
            "[grid-template-areas:'shape_shape'_'para_greens']",
            'lg:absolute lg:inset-x-0 lg:top-[300px] lg:mt-0 lg:flex lg:max-w-none lg:items-end lg:justify-center lg:gap-5 lg:px-0',
          )}
        >
          <div className="hero-in [grid-area:para] lg:order-1 lg:pb-[60px]" style={d(1.7)}>
            <ProjectCaption
              project="paradise"
              align="right"
              className="h-full lg:w-[270px] xl:w-[330px] min-[1400px]:w-[380px]"
            />
          </div>
          <TriadShape className="mx-auto w-[318px] [grid-area:shape] md:w-[420px] lg:order-2 lg:mx-0 lg:w-[420px] xl:w-[500px] min-[1400px]:w-[540px]" />
          <div className="hero-in [grid-area:greens] lg:order-3 lg:pb-[60px]" style={d(1.85)}>
            <ProjectCaption
              project="greens"
              align="left"
              className="h-full lg:w-[270px] xl:w-[330px] min-[1400px]:w-[380px]"
            />
          </div>
        </div>

        {/* Desktop CTA row */}
        <div
          className="hero-in absolute inset-x-0 bottom-[28px] z-[1] hidden justify-center gap-4 lg:flex"
          style={d(2)}
        >
          <a
            href={config.phone.href}
            data-track="hero"
            className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-line-input bg-white py-2 pl-2.5 pr-6 font-display text-[18px] font-extrabold text-navy-900 shadow-[0_10px_24px_rgba(20,38,80,0.14)]"
          >
            <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gold-400">
              <Phone aria-hidden className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="sr-only">Call </span>
            {config.phone.display}
          </a>
          <a
            href="#visit"
            className="inline-flex items-center rounded-full bg-navy-900 px-7 font-display text-base font-bold text-white transition hover:bg-navy-700"
          >
            {h.book}
          </a>
        </div>

        {h.photo.isStock && (
          <span className="absolute bottom-2 left-3 z-[1] text-[11px] text-navy-900/55">
            {h.representative}
          </span>
        )}
      </section>
    </FxScope>
  );
}
