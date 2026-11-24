import { useCallback, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { ImageName } from '../../generated/images';
import { Img } from '../ui/Img';

const MIN = 1;
const MAX = 4;

interface View {
  s: number;
  x: number;
  y: number;
}

/**
 * Pinch / drag / button zoom for the site plan. Single-finger vertical scrolling of
 * the page still works at 1×; once zoomed, drag pans the plan.
 */
export function SitePlanViewer({ image, alt }: { image: ImageName; alt: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; view: View; mid: { x: number; y: number } } | null>(null);
  const drag = useRef<{ x: number; y: number; view: View } | null>(null);

  const clamp = useCallback((v: View): View => {
    const box = boxRef.current;
    const s = Math.min(MAX, Math.max(MIN, v.s));
    if (!box || s === 1) return { s, x: 0, y: 0 };
    const w = box.clientWidth;
    const h = box.clientHeight;
    return {
      s,
      x: Math.min(0, Math.max(w - w * s, v.x)),
      y: Math.min(0, Math.max(h - h * s, v.y)),
    };
  }, []);

  /** Zoom keeping the point (cx, cy) in box coordinates fixed. */
  const zoomAt = useCallback(
    (from: View, nextS: number, cx: number, cy: number) => {
      const s = Math.min(MAX, Math.max(MIN, nextS));
      const k = s / from.s;
      return clamp({ s, x: cx - (cx - from.x) * k, y: cy - (cy - from.y) * k });
    },
    [clamp],
  );

  const centre = () => {
    const b = boxRef.current;
    return { x: (b?.clientWidth ?? 0) / 2, y: (b?.clientHeight ?? 0) / 2 };
  };
  const step = (dir: 1 | -1) => {
    const c = centre();
    setView((v) => zoomAt(v, v.s * (dir > 0 ? 1.5 : 1 / 1.5), c.x, c.y));
  };

  const local = (e: RPointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      gesture.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        view,
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      drag.current = null;
    } else if (view.s > 1 || e.pointerType === 'mouse') {
      drag.current = { ...local(e), view };
    }
    if (pointers.current.size === 2 || view.s > 1) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, local(e));
    const g = gesture.current;
    if (g && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      setView(zoomAt(g.view, g.view.s * (dist / g.dist), g.mid.x, g.mid.y));
      return;
    }
    const d = drag.current;
    if (d && d.view.s > 1) {
      const p = local(e);
      setView(clamp({ s: d.view.s, x: d.view.x + p.x - d.x, y: d.view.y + p.y - d.y }));
    }
  };

  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const btn =
    'grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 shadow-soft ring-1 ring-line transition hover:shadow-card disabled:opacity-40';

  return (
    <div className="relative">
      <div
        ref={boxRef}
        className="relative h-[560px] overflow-hidden rounded-img bg-white shadow-card ring-1 ring-line sm:h-[680px]"
        style={{
          touchAction: view.s > 1 ? 'none' : 'pan-y',
          cursor: view.s > 1 ? 'grab' : 'zoom-in',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDoubleClick={(e) => {
          const p = local(e as unknown as RPointerEvent);
          setView((v) => (v.s > 1 ? { s: 1, x: 0, y: 0 } : zoomAt(v, 2.2, p.x, p.y)));
        }}
      >
        <div
          className="h-full w-full origin-top-left will-change-transform"
          style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})` }}
        >
          <Img
            name={image}
            alt={alt}
            sizes="(min-width: 1024px) 560px, 100vw"
            draggable={false}
            className="h-full w-full select-none object-contain p-3"
          />
        </div>
      </div>
      <div
        className="absolute right-4 top-4 flex flex-col gap-2"
        role="group"
        aria-label="Site plan zoom"
      >
        <button type="button" className={btn} onClick={() => step(1)} disabled={view.s >= MAX}>
          <Plus aria-hidden className="h-5 w-5" strokeWidth={1.75} />
          <span className="sr-only">Zoom in</span>
        </button>
        <button type="button" className={btn} onClick={() => step(-1)} disabled={view.s <= MIN}>
          <Minus aria-hidden className="h-5 w-5" strokeWidth={1.75} />
          <span className="sr-only">Zoom out</span>
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => setView({ s: 1, x: 0, y: 0 })}
          disabled={view.s === 1}
        >
          <RotateCcw aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
          <span className="sr-only">Reset zoom</span>
        </button>
      </div>
      <p className="mt-3 text-center text-[13px] text-ink-500">
        Pinch, double-tap or use the buttons to zoom · {Math.round(view.s * 100)}%
      </p>
    </div>
  );
}
