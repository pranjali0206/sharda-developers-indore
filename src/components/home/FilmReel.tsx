import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { site } from '../../content/site';
import { images, type ImageName } from '../../generated/images';
import { cx } from '../../lib/cx';

type Film = (typeof site.home.films.items)[number];

const FILMS = '/assets/films';
const poster = (id: Film['id']) => `film-${id}-poster` as ImageName;
const posterUrl = (id: Film['id']) => {
  const p = images[poster(id)];
  return `/assets/optimized/${poster(id)}-${p.widths[p.widths.length - 1]}.webp`;
};

/** Full-screen player: vertical film with sound, prev/next, Esc to close, focus kept inside. */
function FilmModal({
  index,
  onIndex,
  onClose,
}: {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const items = site.home.films.items;
  const film = items[index]!;
  const closeRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const go = useCallback(
    (d: number) => onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex],
  );

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = boxRef.current?.querySelectorAll<HTMLElement>('button, a, video');
        if (!f?.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  const btn =
    'grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20';
  return createPortal(
    <div
      ref={boxRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${film.title} — film`}
      className="fixed inset-0 isolate z-50 flex flex-col items-center justify-center gap-4 bg-navy-950/95 p-4 backdrop-blur-sm [&_:focus-visible]:outline-white"
    >
      {/* Click outside the film to close (keyboard users have the Close button / Esc). */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 -z-10 cursor-default"
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className={cx(btn, 'absolute right-4 top-4')}
      >
        <X aria-hidden className="h-5 w-5" strokeWidth={2} />
        <span className="sr-only">Close film</span>
      </button>
      <div className="flex w-full max-w-[1000px] items-center justify-center gap-3 sm:gap-6">
        <button type="button" onClick={() => go(-1)} className={cx(btn, 'hidden sm:grid')}>
          <ChevronLeft aria-hidden className="h-6 w-6" strokeWidth={2} />
          <span className="sr-only">Previous film</span>
        </button>
        {/* TODO: client to supply captions (.vtt) if the films contain spoken narration. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          key={film.id}
          src={`${FILMS}/${film.id}.mp4`}
          poster={posterUrl(film.id)}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="bg-black aspect-[9/16] h-[min(78vh,calc((100vw-2rem)*16/9))] max-w-full rounded-[18px] shadow-deep"
        />
        <button type="button" onClick={() => go(1)} className={cx(btn, 'hidden sm:grid')}>
          <ChevronRight aria-hidden className="h-6 w-6" strokeWidth={2} />
          <span className="sr-only">Next film</span>
        </button>
      </div>
      <div className="flex items-center gap-3 text-center">
        <button type="button" onClick={() => go(-1)} className={cx(btn, 'h-11 w-11 sm:hidden')}>
          <ChevronLeft aria-hidden className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">Previous film</span>
        </button>
        <p className="text-white" aria-live="polite">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <span className="mt-1 block font-display text-lg font-bold">{film.title}</span>
        </p>
        <button type="button" onClick={() => go(1)} className={cx(btn, 'h-11 w-11 sm:hidden')}>
          <ChevronRight aria-hidden className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">Next film</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

/**
 * "See it before you visit." — five vertical films in a reel wall. Each card shows a
 * poster, and a 6-second silent preview loops while the section is on screen (not for
 * reduced motion). Tap a card to watch the full film with sound.
 */
export function FilmReel() {
  const f = site.home.films;
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const last = useRef(0);

  // Play the preview loops only while the section is visible and no film is open.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    const vids = () => [...root.querySelectorAll<HTMLVideoElement>('video[data-preview]')];
    if (!motionOk) return;
    const io = new IntersectionObserver(
      ([e]) => {
        for (const v of vids()) {
          if (e?.isIntersecting && open === null) {
            if (v.preload !== 'auto') v.preload = 'auto';
            void v.play().catch(() => undefined);
          } else v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [open]);

  return (
    <section
      ref={rootRef}
      id="films"
      aria-labelledby="films-title"
      data-section="films"
      className="section-pad relative overflow-hidden bg-navy-950 [&_:focus-visible]:outline-white"
    >
      <div
        aria-hidden
        className="blob-navy pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full mix-blend-screen"
      />
      <div className="container-content relative">
        <div
          data-reveal
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <div>
            <p className="eyebrow text-gold-400">{f.eyebrow}</p>
            <h2
              id="films-title"
              className="mt-3 font-display text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-white"
            >
              {f.h2a} <span className="text-gold-400">{f.h2b}</span>
            </h2>
          </div>
          <p
            lang="hi"
            className="max-w-[44ch] font-hindi text-[clamp(20px,1.8vw,26px)] font-medium leading-[1.5] text-white/85"
          >
            &ldquo;{f.intro}&rdquo;
          </p>
        </div>

        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
          {f.items.map((film, i) => (
            <li
              key={film.id}
              data-reveal
              style={{ '--d': `${i * 0.08}s` } as CSSProperties}
              className="w-[62vw] max-w-[240px] shrink-0 snap-center sm:w-[220px] lg:w-auto lg:max-w-none"
            >
              <button
                ref={(el) => {
                  cards.current[i] = el;
                }}
                type="button"
                onClick={() => {
                  last.current = i;
                  setOpen(i);
                }}
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[20px] bg-navy-900 text-left shadow-deep ring-1 ring-white/10 transition duration-300 ease-brand hover:-translate-y-1.5 hover:ring-2 hover:ring-gold-400"
              >
                <img
                  src={posterUrl(film.id)}
                  alt=""
                  width={540}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <video
                  data-preview
                  src={`${FILMS}/${film.id}-preview.mp4`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden
                  tabIndex={-1}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-navy-950/95 via-navy-950/50 to-transparent"
                />
                <span className="absolute right-3 top-3 rounded-full bg-navy-950/75 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">
                  {film.duration}
                </span>
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lift transition duration-300 group-hover:scale-110 group-hover:bg-gold-400"
                >
                  <Play className="ml-0.5 h-6 w-6" strokeWidth={2} fill="currentColor" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block font-display text-[17px] font-bold leading-snug text-white">
                    {film.title}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-white/75">
                    {film.line}
                  </span>
                  <span className="sr-only">
                    {' '}
                    — {f.watch} ({film.duration})
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <a
            href="#visit"
            className="inline-flex min-h-[48px] items-center rounded-full bg-gold-400 px-7 font-display text-[15px] font-bold text-navy-900 shadow-soft transition hover:-translate-y-0.5"
          >
            {f.book}
          </a>
        </div>
      </div>

      {open !== null && (
        <FilmModal
          index={open}
          onIndex={(i) => {
            last.current = i;
            setOpen(i);
          }}
          onClose={() => {
            setOpen(null);
            requestAnimationFrame(() => cards.current[last.current]?.focus());
          }}
        />
      )}
    </section>
  );
}
