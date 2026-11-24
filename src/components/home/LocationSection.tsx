import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BrickWall,
  Dumbbell,
  DoorOpen,
  Droplets,
  ExternalLink,
  Flower2,
  Footprints,
  LandPlot,
  LayoutGrid,
  Lightbulb,
  Route,
  ShieldCheck,
  Tent,
  ToyBrick,
  Trees,
  Trophy,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { site } from '../../content/site';
import { projectList, type Project } from '../../content/projects';
import tokens from '../../design/tokens.json';
import { cx } from '../../lib/cx';
import { FxScope, RetroGrid } from '../fx/Effects';
import { Img } from '../ui/Img';
import { ReraChip } from '../ui/primitives';

/** Icon for an amenity name (keyword match; falls back to a grid icon). */
const ICONS: [RegExp, LucideIcon][] = [
  [/gate/i, DoorOpen],
  [/tank/i, Droplets],
  [/play|kids|children/i, ToyBrick],
  [/gym/i, Dumbbell],
  [/jogging|walking/i, Footprints],
  [/light/i, Lightbulb],
  [/electric/i, Zap],
  [/storm|drainage/i, Waves],
  [/road/i, Route],
  [/wall/i, BrickWall],
  [/secure/i, ShieldCheck],
  [/gazebo/i, Tent],
  [/basketball|court/i, Trophy],
  [/women|flower/i, Flower2],
  [/lawn/i, LandPlot],
  [/garden/i, Trees],
];
const iconFor = (name: string) => ICONS.find(([re]) => re.test(name))?.[1] ?? LayoutGrid;

function MapCard({ project }: { project: Project }) {
  const l = site.home.location;
  const paradise = project.slug === 'paradise';
  return (
    <article data-reveal className="flex flex-col">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[26px] bg-navy-100 shadow-deep ring-1 ring-white/60">
        {project.mapEmbed ? (
          <iframe
            src={project.mapEmbed}
            title={`${project.name} — ${l.satellite}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            aria-hidden
            // Decorative: the link on top handles interaction; keep keyboard focus out of the map.
            {...{ inert: '' }}
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[-150px] h-[calc(100%+150px)] w-full border-0 transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.04]"
          />
        ) : (
          <Img
            name={project.heroImage}
            alt=""
            sizes="600px"
            className="h-full w-full object-cover"
          />
        )}
        {/* The whole map is one link to the project page. */}
        <Link
          to={project.path}
          aria-label={`${project.name}: ${l.satellite.toLowerCase()} — view project`}
          className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent p-4 sm:p-6"
        >
          <span className="self-start rounded-full bg-white/95 px-4 py-2 shadow-soft">
            <Img
              name={project.logo}
              alt=""
              sizes="140px"
              className={cx('w-auto', paradise ? 'h-7' : 'h-5')}
            />
          </span>
          <span className="flex items-end justify-between gap-4">
            <span className="text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                {l.satellite}
              </span>
              <span className="mt-1 block font-display text-xl font-extrabold text-white sm:text-2xl">
                {project.location}
              </span>
              <span className="text-sm text-white/80">{project.heroLine}</span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-900 shadow-soft transition-transform group-hover:translate-x-1">
              <ArrowRight aria-hidden className="h-5 w-5" strokeWidth={2} />
            </span>
          </span>
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <ReraChip rera={project.rera} className="bg-white" />
        {project.mapsUrl && (
          <a
            href={project.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-navy-700 underline-offset-4 hover:underline"
          >
            {l.openMaps}
            <ExternalLink aria-hidden className="h-4 w-4" strokeWidth={2} />
            <span className="sr-only"> for {project.name} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}

function AmenitiesPanel() {
  const l = site.home.location;
  const withAmenities = projectList.filter((p) => p.amenities?.length);
  const [active, setActive] = useState(withAmenities[0]?.slug ?? 'paradise');
  const project = withAmenities.find((p) => p.slug === active) ?? withAmenities[0];
  if (!project?.amenities) return null;
  return (
    <div
      id="amenities"
      data-reveal
      className="mt-16 scroll-mt-28 rounded-[30px] bg-white p-5 shadow-card ring-1 ring-line sm:p-10"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{l.amenitiesEyebrow}</p>
          <h3 className="mt-3 font-display text-[clamp(26px,3vw,38px)] font-extrabold leading-tight tracking-tight text-navy-900">
            {l.amenitiesTitle}
          </h3>
        </div>
        <div
          role="tablist"
          aria-label="Choose a project"
          className="flex gap-1 rounded-full bg-bg p-1 ring-1 ring-line"
        >
          {withAmenities.map((p) => {
            const on = p.slug === active;
            return (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="amenity-grid"
                onClick={() => setActive(p.slug)}
                className={cx(
                  'min-h-[44px] whitespace-nowrap rounded-full px-4 text-sm font-semibold transition sm:px-5',
                  on
                    ? p.slug === 'paradise'
                      ? 'bg-royal-800 text-white shadow-soft'
                      : 'bg-green-700 text-white shadow-soft'
                    : 'text-ink-600 hover:text-navy-900',
                )}
              >
                {p.name}
                <span className={cx('ml-1.5 text-xs', on ? 'text-white/75' : 'text-ink-500')}>
                  {p.amenities?.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div id="amenity-grid" role="tabpanel" aria-label={`${project.name} amenities`}>
        <ul
          key={project.slug}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {project.amenities.map((a, i) => {
            const Icon = iconFor(a);
            const paradise = project.slug === 'paradise';
            return (
              <li
                key={a}
                className="tile-in flex min-h-[112px] flex-col justify-between gap-3 rounded-[20px] bg-bg p-4 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-card"
                style={{ '--d': `${i * 0.03}s` } as CSSProperties}
              >
                <span
                  className={cx(
                    'grid h-11 w-11 place-items-center rounded-2xl',
                    paradise ? 'bg-royal-100 text-royal-800' : 'bg-green-100 text-green-700',
                  )}
                >
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="text-[15px] font-semibold leading-snug text-navy-900">{a}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** "Indore's next address is yours." — satellite views + amenities, on a retro grid. */
export function LocationSection() {
  const l = site.home.location;
  return (
    <FxScope className="relative isolate overflow-hidden bg-bg">
      <RetroGrid
        color={`${tokens.colors['royal-600']}2e`}
        className="-z-10 [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]"
      />
      <section
        id="location"
        aria-labelledby="location-title"
        data-section="location"
        className="section-pad"
      >
        <div className="container-content">
          <div data-reveal className="mx-auto max-w-[820px] text-center">
            <p className="eyebrow">{l.eyebrow}</p>
            <h2
              id="location-title"
              className="mt-4 text-balance font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-navy-900"
            >
              {l.h2a} <span className="text-royal-800">{l.h2b}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[60ch] text-[17px] leading-relaxed">{l.intro}</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
            {projectList.map((p) => (
              <MapCard key={p.slug} project={p} />
            ))}
          </div>
          <AmenitiesPanel />
        </div>
      </section>
    </FxScope>
  );
}
