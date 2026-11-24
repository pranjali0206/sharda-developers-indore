import type { CSSProperties } from 'react';
import { BadgeCheck, CalendarCheck, HeartHandshake, ScrollText, Trees } from 'lucide-react';
import { lines, site } from '../content/site';
import tokens from '../design/tokens.json';
import { projects } from '../content/projects';
import { Seo } from '../components/seo/Seo';
import { Journey } from '../components/about/Journey';
import { VisitSection } from '../components/form/VisitSection';
import { Deferred } from '../components/layout/Deferred';
import { Img } from '../components/ui/Img';
import {
  ArtistLabel,
  Eyebrow,
  HindiLine,
  Punch,
  SectionHeading,
  StatusChip,
} from '../components/ui/primitives';

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

const VALUE_ICONS = {
  transparency: ScrollText,
  quality: BadgeCheck,
  timeline: CalendarCheck,
  service: HeartHandshake,
  spaces: Trees,
} as const;

export function AboutPage() {
  const a = site.about;
  const greens = projects.greens;

  return (
    <>
      <Seo title={a.seo.title} description={a.seo.description} path="/about-us" />

      {/* Hero */}
      <section
        aria-labelledby="about-page-title"
        data-section="about-hero"
        className="relative overflow-hidden bg-cream pb-section-sm pt-10 md:pb-section md:pt-14"
      >
        <div
          aria-hidden
          className="blob-gold pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full"
        />
        <div
          aria-hidden
          className="plot-grid pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        />
        <div className="container-content relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="intro" style={d(0.1)}>
              <Eyebrow>{a.eyebrow}</Eyebrow>
            </div>
            <h1
              id="about-page-title"
              className="intro-text mt-4 text-h1 font-extrabold text-navy-900"
              style={d(0.2)}
            >
              {a.h1a}{' '}
              <span
                className="fx-gradient-text font-serif font-semibold italic tracking-normal text-green-700"
                style={
                  {
                    '--g1': tokens.colors['green-700'],
                    '--g2': tokens.colors['royal-800'],
                    '--g3': tokens.colors['teal-650'],
                  } as CSSProperties
                }
              >
                {a.h1b}
              </span>
            </h1>
            {a.intro.map((p, i) => (
              <p
                key={i}
                className="intro-text mt-5 max-w-prose text-[17px] leading-relaxed"
                style={d(0.35 + i * 0.1)}
              >
                {p}
              </p>
            ))}
            <div className="intro" style={d(0.6)}>
              <Punch className="mt-6 text-punch text-gold-ink">{lines.trust.en}</Punch>
              <HindiLine k="trust" className="mt-1 text-navy-700" />
            </div>
          </div>

          <div className="intro-text relative" style={d(0.3)}>
            <div className="relative h-[320px] overflow-hidden rounded-[24px] shadow-deep sm:h-[440px]">
              {/* TODO: swap for real photos of the delivered colony when the client has them. */}
              <Img
                name="g-boulevard"
                alt="Sharda Greens boulevard with central garden strip"
                sizes="(min-width: 1024px) 560px, 100vw"
                priority
                className="h-full w-full object-cover"
              />
              <ArtistLabel className="bottom-auto left-auto right-3 top-3" />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-card ring-1 ring-line sm:left-8">
              <span>
                <span className="block font-display text-2xl font-extrabold leading-none text-navy-900">
                  {a.founded.value}
                </span>
                <span className="mt-1 block text-[13px] text-ink-500">{a.founded.label}</span>
              </span>
              <span aria-hidden className="h-10 w-px bg-line" />
              <span>
                <span className="block font-display text-[15px] font-bold text-navy-900">
                  {greens.name}
                </span>
                <StatusChip status={greens.status} className="mt-1" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <Deferred>
        <section aria-labelledby="journey-title" className="section-pad bg-white">
          <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div data-reveal id="journey-title">
              <SectionHeading eyebrow={a.journey.eyebrow} a={a.journey.h2a} b={a.journey.h2b} />
              <Punch className="mt-5 text-xl text-gold-ink">{lines.legacy.en}</Punch>
            </div>
            <Journey className="[&_.ring-bg]:ring-white" />
          </div>
        </section>
      </Deferred>

      {/* Values */}
      <Deferred>
        <section aria-labelledby="values-title" className="section-pad">
          <div className="container-content">
            <div data-reveal id="values-title" className="mx-auto max-w-[720px] text-center">
              <SectionHeading eyebrow={a.values.eyebrow} a={a.values.h2a} b={a.values.h2b} center />
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {a.values.items.map((v, i) => {
                const Icon = VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS];
                return (
                  <li
                    key={v.title}
                    data-reveal
                    style={d(i * 0.08)}
                    className="flex flex-col rounded-card bg-white p-6 shadow-soft ring-1 ring-line"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-100 text-navy-700">
                      <Icon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold leading-snug">{v.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed">{v.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </Deferred>

      {/* Promise */}
      <Deferred>
        <section aria-labelledby="promise-title" className="bg-cream py-section-sm md:py-section">
          <div data-reveal className="container-content max-w-[860px] text-center">
            <Eyebrow center>
              <span id="promise-title">{a.promise.eyebrow}</span>
            </Eyebrow>
            <blockquote className="mt-6">
              <p className="font-serif text-[clamp(26px,3.2vw,40px)] font-semibold italic leading-snug text-navy-900">
                &ldquo;{a.promise.text}&rdquo;
              </p>
            </blockquote>
            <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-ink-500">
              {site.company.name} · {site.company.city}
            </p>
          </div>
        </section>
      </Deferred>

      <Deferred>
        <VisitSection eyebrow="Meet us at the site" />
      </Deferred>
    </>
  );
}
