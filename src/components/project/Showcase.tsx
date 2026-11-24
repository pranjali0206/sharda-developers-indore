import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CalendarCheck, Expand } from 'lucide-react';
import { GALLERY_CATEGORIES, type GalleryCategory, type Project } from '../../content/projects';
import { cx } from '../../lib/cx';
import { Img } from '../ui/Img';
import { Lightbox } from './Gallery';

type Filter = 'all' | GalleryCategory;

/**
 * Project image gallery: every view visible at once in an even grid
 * (4 columns desktop, 2 on phones), optional category filter, full-screen lightbox.
 */
export function Showcase({ project }: { project: Project }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const last = useRef(0);

  const items = useMemo(
    () =>
      filter === 'all' ? project.gallery : project.gallery.filter((g) => g.category === filter),
    [filter, project.gallery],
  );
  const categories = useMemo(() => {
    const present = new Set(project.gallery.map((g) => g.category));
    return (Object.keys(GALLERY_CATEGORIES) as GalleryCategory[]).filter((c) => present.has(c));
  }, [project.gallery]);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="[&_:focus-visible]:outline-white">
      {/* Filters */}
      <div
        role="group"
        aria-label="Filter the gallery"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {(['all', ...categories] as Filter[]).map((f) => {
          const count =
            f === 'all'
              ? project.gallery.length
              : project.gallery.filter((g) => g.category === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={cx(
                'inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-200',
                active
                  ? 'bg-gold-400 text-navy-900 shadow-soft'
                  : 'bg-white/5 text-white/80 ring-1 ring-white/15 hover:bg-white/10 hover:text-white',
              )}
            >
              {f === 'all' ? 'All views' : GALLERY_CATEGORIES[f]}
              <span
                className={cx('text-xs tabular-nums', active ? 'text-navy-900' : 'text-white/60')}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid: every image visible */}
      <ul key={filter} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {items.map((it, i) => (
          <li
            key={it.image}
            className="tile-in"
            style={{ '--d': `${Math.min(i, 6) * 0.06}s` } as CSSProperties}
          >
            <button
              ref={(el) => {
                tiles.current[i] = el;
              }}
              type="button"
              onClick={() => {
                last.current = i;
                setOpen(i);
              }}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-none bg-navy-900 shadow-card ring-1 ring-white/10 transition duration-300 ease-brand hover:-translate-y-1 hover:shadow-deep hover:ring-gold-400/60"
            >
              <Img
                name={it.image}
                alt={it.alt}
                sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.06]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-transparent"
              />
              <span
                aria-hidden
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-navy-900 opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-5 sm:top-5"
              >
                <Expand className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-7">
                <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 sm:text-xs">
                  <span className="tabular-nums text-white/70">{pad(i + 1)}</span>
                  <span className="truncate">{GALLERY_CATEGORIES[it.category]}</span>
                </span>
                <span className="mt-1.5 block font-display text-xl font-extrabold leading-tight text-white sm:text-2xl">
                  {it.title}
                  <span className="sr-only"> — open full screen</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
        <p className="text-sm text-white/70">
          {project.gallery.length} views of {project.name} · Tap any image to view it full screen.
        </p>
        <a
          href="#visit"
          className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-gold-400 px-6 text-[15px] font-semibold text-navy-900 shadow-soft transition duration-200 ease-brand hover:-translate-y-0.5"
        >
          <CalendarCheck aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
          See it in person
        </a>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            items={items}
            index={open}
            onIndex={(i) => {
              last.current = i;
              setOpen(i);
            }}
            onClose={() => {
              setOpen(null);
              requestAnimationFrame(() => tiles.current[last.current]?.focus());
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
