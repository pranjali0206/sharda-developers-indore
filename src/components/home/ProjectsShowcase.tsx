import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { site } from '../../content/site';
import { projectList, type Project } from '../../content/projects';
import { cx } from '../../lib/cx';
import { FxScope } from '../fx/Effects';
import { Img } from '../ui/Img';
import { ReraChip, StatusChip } from '../ui/primitives';

const TONE = {
  paradise: {
    accent: 'text-royal-800',
    btn: 'bg-royal-800 hover:bg-royal-900',
    bar: 'bg-royal-800',
    logoH: 'h-[64px]',
  },
  greens: {
    accent: 'text-green-700',
    btn: 'bg-green-700 hover:bg-teal-650',
    bar: 'bg-green-700',
    logoH: 'h-[44px]',
  },
};

/**
 * Editorial feature row: a large gate image on one side, the project details on the
 * other, alternating sides down the page. Calm ivory card + a brand-tone accent bar,
 * a soft shadow (no glow) — deliberately different texture from the hero's neon cards.
 */
function ShowcaseCard({ project, index }: { project: Project; index: number }) {
  const tone = TONE[project.slug];
  const p = site.home.projects;
  const flip = index % 2 === 1;
  return (
    <div
      data-reveal={flip ? 'right' : 'left'}
      style={{ '--d': `${index * 0.08}s` } as CSSProperties}
      className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-line/70"
    >
      <div className={cx('lg:flex lg:items-stretch', flip && 'lg:flex-row-reverse')}>
        {/* Image side */}
        <Link
          to={project.path}
          aria-label={`${project.name} — view project`}
          className="group relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:w-1/2"
        >
          <Img
            name={project.rowImage}
            alt={`${project.name} entrance`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 flex flex-wrap gap-2">
            <ReraChip rera={project.rera} tone="overlay" />
            <StatusChip status={project.status} className="shadow-soft" />
          </span>
        </Link>

        {/* Content side */}
        <div className="relative flex flex-col p-6 sm:p-8 lg:w-1/2 lg:justify-center lg:p-12">
          {/* brand-tone accent bar */}
          <span
            aria-hidden
            className={cx('absolute left-0 top-10 hidden h-16 w-1.5 rounded-r-full lg:block', tone.bar)}
          />
          <div className="flex items-start justify-between gap-4">
            <Img
              name={project.logo}
              alt={project.name}
              sizes="220px"
              className={cx('w-auto object-contain object-left', tone.logoH)}
            />
            <span className="mt-1 inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-ink-600">
              <MapPin aria-hidden className={cx('h-4 w-4', tone.accent)} strokeWidth={2} />
              {project.location}
            </span>
          </div>

          <h3
            className={cx(
              'mt-5 font-display text-2xl font-extrabold tracking-tight sm:text-[28px]',
              tone.accent,
            )}
          >
            {project.cardLine}.
          </h3>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
            {project.tiles.map((tile) => (
              <div key={tile.label}>
                <dt className="font-display text-lg font-extrabold leading-tight text-navy-900">
                  {tile.value}
                </dt>
                <dd className="mt-0.5 text-[13px] leading-snug text-ink-500">{tile.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={project.path}
              className={cx(
                'group inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white shadow-soft transition hover:-translate-y-0.5',
                tone.btn,
              )}
            >
              {p.explore} {project.short}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
            <a
              href="#visit"
              className="inline-flex min-h-[48px] items-center rounded-full border border-navy-700/25 px-6 text-[15px] font-semibold text-navy-900 transition hover:border-navy-700 hover:bg-bg"
            >
              {p.book}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Stop renting dreams. Start owning one." — two neon-bordered project cards. */
export function ProjectsShowcase() {
  const p = site.home.projects;
  return (
    <FxScope>
      <section
        id="projects"
        aria-labelledby="projects-title"
        data-section="projects"
        className="section-pad bg-ivory"
      >
        <div className="container-content">
          <div data-reveal className="mx-auto max-w-[820px] text-center">
            <p className="eyebrow">{p.eyebrow}</p>
            <h2
              id="projects-title"
              className="mt-4 text-balance font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-navy-900"
            >
              {p.h2a} <span className="text-green-700">{p.h2b}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-[17px] leading-relaxed">{p.intro}</p>
          </div>
          <div className="mt-14 flex flex-col gap-8 lg:gap-12">
            {projectList.map((project, i) => (
              <ShowcaseCard key={project.slug} project={project} index={i} />
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-[80ch] text-center text-xs text-ink-500">
            {site.proofNote}
          </p>
        </div>
      </section>
    </FxScope>
  );
}
