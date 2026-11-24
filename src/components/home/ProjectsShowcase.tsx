import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { site } from '../../content/site';
import { projectList, type Project } from '../../content/projects';
import tokens from '../../design/tokens.json';
import { cx } from '../../lib/cx';
import { FxScope, NeonCard } from '../fx/Effects';
import { Img } from '../ui/Img';
import { ReraChip, StatusChip } from '../ui/primitives';

const t = tokens.colors;

const TONE = {
  paradise: {
    neon: [t['royal-600'], t['gold-400'], t['royal-800']] as [string, string, string],
    accent: 'text-royal-800',
    btn: 'bg-royal-800 hover:bg-royal-900',
    logoH: 'h-[64px]',
  },
  greens: {
    neon: [t['leaf-600'], t['gold-400'], t['teal-700']] as [string, string, string],
    accent: 'text-green-700',
    btn: 'bg-green-700 hover:bg-teal-650',
    logoH: 'h-[44px]',
  },
};

function ShowcaseCard({ project, index }: { project: Project; index: number }) {
  const tone = TONE[project.slug];
  const p = site.home.projects;
  return (
    <div data-reveal style={{ '--d': `${index * 0.12}s` } as CSSProperties} className="h-full">
      <NeonCard colors={tone.neon} className="h-full" innerClassName="flex flex-col p-3 sm:p-4">
        <Link
          to={project.path}
          className="group relative block aspect-[16/10] overflow-hidden rounded-[22px]"
          aria-label={`${project.name} — view project`}
        >
          <Img
            name={project.rowImage}
            alt={`${project.name} entrance`}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
            <ReraChip rera={project.rera} tone="overlay" />
            <StatusChip status={project.status} className="shadow-soft" />
          </span>
        </Link>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
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

          <div className="mt-auto flex flex-wrap gap-3 pt-7">
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
      </NeonCard>
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
          <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
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
