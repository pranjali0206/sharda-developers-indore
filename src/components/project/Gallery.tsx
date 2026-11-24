import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ImageName } from '../../generated/images';
import { site } from '../../content/site';
import { Img } from '../ui/Img';

export interface Item {
  image: ImageName;
  alt: string;
}

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: Item[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[index]!;

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const f = dialogRef.current?.querySelectorAll<HTMLElement>('button');
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
    'grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20';

  // Portal to <body>: sections use content-visibility (paint containment), which would
  // otherwise trap this fixed-position dialog inside its section.
  return createPortal(
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery: ${item.alt}`}
      className="fixed inset-0 z-50 flex flex-col bg-navy-950/95 backdrop-blur-sm [&_:focus-visible]:outline-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between p-4 text-white sm:p-6">
        <p className="text-sm text-white/75" aria-live="polite">
          {index + 1} / {items.length} · {site.artist}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className={btn}>
          <X aria-hidden className="h-5 w-5" strokeWidth={1.75} />
          <span className="sr-only">Close gallery</span>
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-20"
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          const t = e.changedTouches[0];
          touch.current = null;
          if (!start || !t) return;
          const dx = t.clientX - start.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - start.y))
            go(dx < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <m.figure
            key={item.image}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35 }}
            className="flex max-h-full max-w-[1200px] flex-col items-center"
          >
            <Img
              name={item.image}
              alt={item.alt}
              sizes="100vw"
              priority
              draggable={false}
              className="max-h-[72vh] w-auto max-w-full select-none rounded-none object-contain shadow-deep"
            />
            <figcaption className="mt-4 text-center text-sm text-white/80">{item.alt}</figcaption>
          </m.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          className={`${btn} absolute left-2 top-1/2 -translate-y-1/2 sm:left-6`}
        >
          <ChevronLeft aria-hidden className="h-6 w-6" strokeWidth={1.75} />
          <span className="sr-only">Previous image</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className={`${btn} absolute right-2 top-1/2 -translate-y-1/2 sm:right-6`}
        >
          <ChevronRight aria-hidden className="h-6 w-6" strokeWidth={1.75} />
          <span className="sr-only">Next image</span>
        </button>
      </div>
    </m.div>,
    document.body,
  );
}
