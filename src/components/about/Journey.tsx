import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flag } from 'lucide-react';
import { site } from '../../content/site';
import { projects, type Project } from '../../content/projects';
import { cx } from '../../lib/cx';
import { Img } from '../ui/Img';
import { ReraChip, StatusChip } from '../ui/primitives';

/** Chronological order: our first (delivered) project, then the ongoing one. */
const ORDER: Project[] = [projects.greens, projects.paradise];

const node =
  'relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full ring-[6px] ring-bg shadow-soft';

/**
 * Company journey: founded 2021 → Sharda Greens (completed) → Sharda Paradise (ongoing).
 * Vertical timeline; used on the home page (Chapter 01) and the About page.
 */
export function Journey({ className }: { className?: string }) {
  const founded = site.about.founded;
  return (
    <ol className={cx('relative space-y-6', className)}>
      {/* the spine */}
      <span
        aria-hidden
        data-reveal="road"
        className="absolute bottom-10 left-[23px] top-6 w-0 border-l-2 border-dashed border-navy-700/25"
      />

      <li data-reveal className="flex items-center gap-5">
        <span className={cx(node, 'bg-gold-400 text-navy-900')}>
          <Flag aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span>
          <span className="block font-display text-3xl font-extrabold leading-none text-navy-900">
            {founded.value}
          </span>
          <span className="mt-1 block text-[15px] text-ink-500">{founded.label}</span>
        </span>
      </li>

      {ORDER.map((p, i) => {
        const done = p.status === 'completed';
        return (
          <li
            key={p.slug}
            data-reveal
            style={{ '--d': `${0.12 * (i + 1)}s` } as CSSProperties}
            className="flex items-start gap-5"
          >
            <span
              className={cx(
                node,
                'mt-5',
                done ? 'bg-green-700 text-white' : 'bg-white text-navy-700 ring-offset-0',
              )}
            >
              <span
                aria-hidden
                className={cx('h-3 w-3 rounded-full', done ? 'bg-white' : 'bg-navy-700')}
              />
            </span>
            <Link
              to={p.path}
              className={cx(
                'group block flex-1 rounded-[18px] border-t-4 bg-white p-5 shadow-card ring-1 ring-line transition duration-300 ease-brand',
                'hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1',
                p.slug === 'paradise' ? 'border-t-navy-700' : 'border-t-teal-700',
              )}
            >
              <span className="flex flex-wrap items-center justify-between gap-3">
                <Img
                  name={p.logo}
                  alt={p.name}
                  sizes="200px"
                  className={cx('w-auto', p.slug === 'paradise' ? 'h-12' : 'h-8')}
                />
                <StatusChip status={p.status} />
              </span>
              <span className="mt-4 block text-[15px] leading-relaxed text-ink-600">{p.story}</span>
              <span className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <ReraChip rera={p.rera} />
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                  {p.location}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
