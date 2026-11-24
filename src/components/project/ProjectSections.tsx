import { useState, type CSSProperties } from 'react';
import {
  Building2,
  Check,
  Leaf,
  MapPin,
  Milestone,
  Phone,
  Plane,
  Play,
  Route,
  School,
  Signpost,
  Sparkles,
  Trees,
} from 'lucide-react';
import { config } from '../../config';
import tokens from '../../design/tokens.json';
import { lines } from '../../content/site';
import type { LandmarkIcon, Project } from '../../content/projects';
import { Img } from '../ui/Img';
import { ButtonLink } from '../ui/Button';
import { ArtistLabel, Eyebrow, HindiLine, Punch, ReraChip, StatusChip } from '../ui/primitives';
import { cx } from '../../lib/cx';
import { Showcase } from './Showcase';
import { PROJECT_TONE } from './tone';
import { SitePlanViewer } from './SitePlanViewer';

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

function Heading({
  eyebrow,
  title,
  accent,
  id,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  id: string;
}) {
  return (
    <div data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 text-h2 font-extrabold">
        {title}{' '}
        {accent && <span className="font-serif font-semibold italic text-green-700">{accent}</span>}
      </h2>
    </div>
  );
}

/** Animated gradient for the hero accent (brand colours that pass AA at headline size). */
const GRADIENT = {
  paradise: {
    '--g1': tokens.colors['royal-800'],
    '--g2': tokens.colors['royal-600'],
    '--g3': tokens.colors['gold-ink'],
  } as CSSProperties,
  greens: {
    '--g1': tokens.colors['green-700'],
    '--g2': tokens.colors['teal-650'],
    '--g3': tokens.colors['leaf-600'],
  } as CSSProperties,
};

export function ProjectHero({ project }: { project: Project }) {
  const tone = PROJECT_TONE[project.slug];
  return (
    <section
      aria-labelledby="project-title"
      data-section="project-hero"
      className={cx('relative overflow-hidden pb-section-sm pt-10 md:pt-14', tone.bg)}
    >
      <div
        aria-hidden
        className="blob-gold pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full"
      />
      <div
        className="plot-grid pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        aria-hidden
      />
      <div className="container-content relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <div className="intro flex flex-wrap gap-2" style={d(0.1)}>
            <ReraChip rera={project.rera} className="bg-white" />
            <StatusChip status={project.status} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-900">
              <MapPin aria-hidden className="h-3.5 w-3.5 text-gold-ink" strokeWidth={1.75} />
              {project.locality}, Indore
            </span>
          </div>
          <div className="intro mt-6" style={d(0.2)}>
            <Img
              name={project.logo}
              alt={project.name}
              sizes="240px"
              priority
              className={cx('w-auto', project.slug === 'paradise' ? 'h-[68px]' : 'h-[44px]')}
            />
          </div>
          <h1
            id="project-title"
            className="intro-text mt-6 text-h1 font-extrabold text-navy-900"
            style={d(0.3)}
          >
            {project.h1a}{' '}
            <span
              className={cx(
                'fx-gradient-text font-serif font-semibold italic tracking-normal',
                tone.accent,
              )}
              style={GRADIENT[project.slug]}
            >
              {project.h1b}
            </span>
          </h1>
          <p className="intro-text mt-5 max-w-prose text-[17px] leading-relaxed" style={d(0.45)}>
            {project.heroBody}
          </p>
          <div className="intro" style={d(0.6)}>
            <Punch className="mt-5 text-punch text-gold-ink">{lines[project.signoff].en}</Punch>
            <HindiLine k={project.line} className="mt-1 text-navy-700" />
          </div>
          <div className="intro mt-8 flex flex-wrap gap-3" style={d(0.8)}>
            <ButtonLink href={config.phone.href} variant={tone.btn} track="project-hero">
              <Phone aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
              Call {config.phone.display}
            </ButtonLink>
            {project.sitePlan ? (
              <ButtonLink href="#site-plan" variant="outline">
                See the site plan
              </ButtonLink>
            ) : (
              <ButtonLink href="#visit" variant="outline">
                Book a site visit
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="intro-text relative" style={d(0.4)}>
          <div className="relative h-[340px] overflow-hidden rounded-[24px] shadow-deep sm:h-[460px]">
            <Img
              name={project.heroImage}
              alt={`${project.name} entrance gate`}
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
              className="h-full w-full object-cover"
            />
            <ArtistLabel className="bottom-auto left-auto right-3 top-3" />
          </div>
          {project.heroBadge && (
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-card ring-1 ring-line sm:left-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-400 text-navy-900">
                {project.slug === 'paradise' ? (
                  <Plane aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <MapPin aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                )}
              </span>
              <span>
                <span className="block font-display text-xl font-extrabold leading-none text-navy-900">
                  {project.heroBadge.value}
                </span>
                <span className="mt-1 block text-[13px] text-ink-500">
                  {project.heroBadge.label}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AmenitiesSection({ project }: { project: Project }) {
  if (!project.amenities) return null;
  return (
    <section id="amenities" aria-labelledby="amenities-title" className="section-pad bg-white">
      <div className="container-content">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Heading
            eyebrow={`${project.amenities.length} amenities`}
            title="Everything a family"
            accent="needs, planned in."
            id="amenities-title"
          />
          {project.amenitiesSide && (
            <Punch className="text-xl text-gold-ink lg:pb-2">{project.amenitiesSide}</Punch>
          )}
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {project.amenities.map((a, i) => (
            <li
              key={a}
              data-reveal
              style={{ '--d': `${(i % 5) * 0.06}s` } as CSSProperties}
              className="flex min-h-[64px] items-center gap-3 rounded-[18px] bg-bg px-4 py-3 ring-1 ring-line"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-700 text-white">
                <Check aria-hidden className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="text-[15px] font-medium leading-snug text-navy-900">{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const WHY_ICONS = [Sparkles, Route, Trees];

export function WhySection({ project }: { project: Project }) {
  if (!project.why) return null;
  const tone = PROJECT_TONE[project.slug];
  return (
    <section aria-labelledby="why-title" className="section-pad bg-white">
      <div className="container-content">
        <Heading
          eyebrow={`Why ${project.name}`}
          title="Growth on one side,"
          accent="greenery all around."
          id="why-title"
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {project.why.map((w, i) => {
            const Icon = WHY_ICONS[i] ?? Leaf;
            return (
              <li
                key={w.title}
                data-reveal
                style={{ '--d': `${i * 0.1}s` } as CSSProperties}
                className={cx(
                  'rounded-card border-t-4 bg-white p-7 shadow-card ring-1 ring-line',
                  tone.border,
                )}
              >
                <span className={cx('grid h-12 w-12 place-items-center rounded-2xl', tone.soft)}>
                  <Icon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-xl font-bold">{w.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed">{w.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function GallerySection({ project }: { project: Project }) {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      data-section="gallery"
      className="section-pad relative overflow-hidden bg-navy-950"
    >
      <div
        aria-hidden
        className="blob-gold pointer-events-none absolute -right-48 -top-48 h-[620px] w-[620px] rounded-full opacity-60"
      />
      <div
        aria-hidden
        className="blob-navy pointer-events-none absolute -bottom-56 -left-40 h-[680px] w-[680px] rounded-full mix-blend-screen"
      />
      <div className="container-content relative">
        <div
          data-reveal
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div>
            <p className="eyebrow text-gold-400">Gallery · {project.gallery.length} views</p>
            <h2 id="gallery-title" className="mt-3 text-h2 font-extrabold text-white">
              {project.name},{' '}
              <span className="font-serif font-semibold italic tracking-normal text-gold-400">
                up close.
              </span>
            </h2>
          </div>
          <p className="max-w-[46ch] text-[16px] leading-relaxed text-white/75">
            Walk through {project.name} before you visit: the entrance, the gardens, the amenities
            and the view from above.
          </p>
        </div>
        {/* No scroll-reveal wrapper: the grid is very tall; tiles animate in themselves. */}
        <div className="mt-10">
          <Showcase project={project} />
        </div>
      </div>
    </section>
  );
}

function CallCard({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-card bg-white p-7 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
      <p className="font-display text-xl font-bold text-navy-900">{text}</p>
      <ButtonLink href={config.phone.href} track="pricing" className="shrink-0">
        <Phone aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
        Call {config.phone.display}
      </ButtonLink>
    </div>
  );
}

/** "700 to 1,000 sq ft." from the plot table (approximate rows are ignored). */
function plotRange(plots: { area: string }[]) {
  const areas = plots
    .filter((p) => !p.area.includes('≈'))
    .map((p) => Number(p.area.replace(/[^0-9]/g, '')));
  const fmt = (n: number) => n.toLocaleString('en-IN');
  return `${fmt(Math.min(...areas))} to ${fmt(Math.max(...areas))} sq ft.`;
}

export function PlotsSection({ project }: { project: Project }) {
  // Greens (no site data yet): one clean card, no placeholder boxes.
  if (!project.plots || !project.sitePlan) {
    return (
      <section aria-labelledby="plots-title" className="section-pad bg-white">
        <div className="container-content">
          <Heading
            eyebrow="Plots & pricing"
            title="Pick the plot"
            accent="that fits your plans."
            id="plots-title"
          />
          <div data-reveal className="mt-10">
            <CallCard text="Plot sizes and prices — call us for the latest availability." />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="site-plan" aria-labelledby="plots-title" className="section-pad bg-white">
      <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Heading
            eyebrow="Site plan"
            title="Plots from"
            accent={plotRange(project.plots)}
            id="plots-title"
          />
          <div
            data-reveal
            className="mt-8 overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-line"
          >
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">{project.name} plot sizes</caption>
              <thead className="bg-bg text-eyebrow font-semibold uppercase text-ink-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Plot size
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Area (sq ft)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {project.plots.map((p) => (
                  <tr key={p.size}>
                    <th scope="row" className="px-5 py-3.5 font-semibold text-navy-900">
                      {p.size}
                    </th>
                    <td className="px-5 py-3.5 text-right font-display font-bold tabular-nums text-navy-900">
                      {p.area}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line bg-cream">
                  <th scope="row" className="px-5 py-4 font-semibold text-navy-900">
                    Prices
                  </th>
                  {/* TODO: client to supply prices & payment plans (config: projects.ts → pricing). */}
                  <td className="px-5 py-4 text-right font-semibold text-gold-ink">
                    {project.pricing ?? 'On request'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-4 text-[13px] text-ink-500">
            Sizes as marked on the site plan. {project.plotsNote ? `${project.plotsNote} ` : ''}
            Availability changes — please call to confirm.
          </p>
          <div data-reveal className="mt-8">
            <CallCard text="Ask for today’s availability and prices." />
          </div>
        </div>
        <div data-reveal>
          <SitePlanViewer
            image={project.sitePlan}
            alt={`${project.name} site plan showing plot layout, roads and gardens`}
          />
        </div>
      </div>
    </section>
  );
}

const LANDMARK_ICONS: Record<LandmarkIcon, typeof Plane> = {
  plane: Plane,
  highway: Route,
  corridor: Milestone,
  road: Signpost,
  school: School,
  office: Building2,
};

export function LandmarksSection({ project }: { project: Project }) {
  if (!project.landmarks) return null;
  const tone = PROJECT_TONE[project.slug];
  return (
    <section aria-labelledby="landmarks-title" className={cx('section-pad', tone.bg)}>
      <div className="container-content">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Heading
            eyebrow="Location"
            title="Connected to"
            accent="what matters."
            id="landmarks-title"
          />
          <div data-reveal>
            <Punch className="text-xl text-gold-ink">{lines.growingIndore.en}</Punch>
          </div>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.landmarks.map((l, i) => {
            const Icon = LANDMARK_ICONS[l.icon];
            return (
              <li
                key={l.name}
                data-reveal
                style={{ '--d': `${(i % 3) * 0.08}s` } as CSSProperties}
                className="flex items-center gap-4 rounded-card bg-white p-5 shadow-soft ring-1 ring-line"
              >
                <span
                  className={cx(
                    'grid h-12 w-12 shrink-0 place-items-center rounded-2xl',
                    tone.soft,
                  )}
                >
                  <Icon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-display text-[17px] font-bold text-navy-900">
                    {l.name}
                  </span>
                  <span className="text-[14px] text-ink-500">{l.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-[13px] text-ink-500">
          Based on the location map in the project brochure.
        </p>
      </div>
    </section>
  );
}

/** Shown only when the client supplies a walkthrough URL. The player loads on click. */
export function VideoSection({ project }: { project: Project }) {
  const [play, setPlay] = useState(false);
  if (!project.videoUrl) return null;
  return (
    <section aria-labelledby="video-title" className="section-pad bg-white">
      <div className="container-content">
        <Heading
          eyebrow="3D walkthrough"
          title="Walk through"
          accent={`${project.name}.`}
          id="video-title"
        />
        <div className="relative mt-10 aspect-video overflow-hidden rounded-img bg-navy-900 shadow-deep">
          {play ? (
            <iframe
              src={project.videoUrl}
              title={`${project.name} 3D walkthrough`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlay(true)}
              className="group absolute inset-0 grid place-items-center"
            >
              <Img
                name={project.heroImage}
                alt=""
                sizes="100vw"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <span className="relative grid h-20 w-20 place-items-center rounded-full bg-white text-navy-900 shadow-lift transition group-hover:scale-105">
                <Play aria-hidden className="ml-1 h-8 w-8" strokeWidth={1.75} />
              </span>
              <span className="sr-only">Play the 3D walkthrough</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
