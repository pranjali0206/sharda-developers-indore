import { useRef, type CSSProperties, type ReactNode } from 'react';
import { usePauseWhenHidden } from '../../hooks/usePauseWhenHidden';
import { cx } from '../../lib/cx';

/**
 * Small, dependency-free visual effects. All motion is CSS (transform/opacity),
 * gated by html.motion-ok.loops-on, paused off-screen, and off for reduced motion.
 * See the "Effects (fx)" block in styles/index.css.
 */

/** Pauses CSS effects inside it while off-screen or the tab is hidden. */
export function FxScope({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  usePauseWhenHidden(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Card with a rotating neon gradient border and a soft coloured glow. */
export function NeonCard({
  children,
  colors,
  className,
  innerClassName,
}: {
  children: ReactNode;
  colors: [string, string, string];
  className?: string;
  innerClassName?: string;
}) {
  const style = { '--c1': colors[0], '--c2': colors[1], '--c3': colors[2] } as CSSProperties;
  return (
    <div className={cx('relative', className)} style={style}>
      <div aria-hidden className="fx-neon-glow" />
      <div className="fx-neon h-full">
        <div className={cx('relative h-full rounded-[28px] bg-white', innerClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

const SPARKS = [
  { x: '4%', y: '-6px', s: 10, d: '0s', dur: '2.4s' },
  { x: '22%', y: '6px', s: 7, d: '0.8s', dur: '2.8s' },
  { x: '41%', y: '-4px', s: 12, d: '1.5s', dur: '2.2s' },
  { x: '60%', y: '7px', s: 8, d: '0.4s', dur: '3s' },
  { x: '78%', y: '-5px', s: 11, d: '1.1s', dur: '2.5s' },
  { x: '95%', y: '5px', s: 7, d: '1.9s', dur: '2.7s' },
];

/** Gradient underline with twinkling sparkles, placed under a heading. */
export function Sparkles({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx('relative mx-auto h-5 w-full max-w-[360px]', className)}>
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      <div className="absolute inset-x-[15%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-leaf-600 to-transparent blur-[1px]" />
      {SPARKS.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={cx('fx-sparkle absolute', i % 2 ? 'text-leaf-600' : 'text-gold-400')}
          style={
            {
              left: p.x,
              top: `calc(50% + ${p.y} - ${p.s / 2}px)`,
              width: p.s,
              height: p.s,
              '--d': p.d,
              '--dur': p.dur,
            } as CSSProperties
          }
        >
          <path
            fill="currentColor"
            d="M12 0c.6 5.6 2.4 9.4 12 12-9.6 2.6-11.4 6.4-12 12-.6-5.6-2.4-9.4-12-12C9.6 9.4 11.4 5.6 12 0Z"
          />
        </svg>
      ))}
    </div>
  );
}

/** Perspective grid floor that slowly scrolls toward the viewer. */
export function RetroGrid({ color, className }: { color: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cx('fx-retro', className)}
      style={{ '--grid': color } as CSSProperties}
    >
      <div className="fx-retro-plane">
        <div className="fx-retro-lines" />
      </div>
    </div>
  );
}

/** Seamless sine wave path covering two periods across `w` (so -50% loops cleanly). */
function wavePath(w: number, h: number, amp: number, base: number) {
  const period = w / 2;
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 20) {
    const y = base + Math.sin((x / period) * Math.PI * 2) * amp;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${h} L${pts.join(' L')} L${w},${h} Z`;
}

/** Layered animated waves along the bottom of a section. */
export function WavyBackground({
  className,
  colors,
}: {
  className?: string;
  colors: [string, string, string];
}) {
  const layers = [
    { amp: 18, base: 70, dur: '22s', opacity: 0.35, fill: colors[0] },
    { amp: 24, base: 95, dur: '16s', opacity: 0.45, fill: colors[1] },
    { amp: 14, base: 120, dur: '11s', opacity: 0.6, fill: colors[2] },
  ];
  return (
    <div
      aria-hidden
      className={cx('pointer-events-none absolute inset-x-0 overflow-hidden', className)}
    >
      {layers.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 2400 160"
          preserveAspectRatio="none"
          className="fx-wave absolute bottom-0 left-0 h-full w-[200%]"
          style={{ '--dur': l.dur } as CSSProperties}
        >
          <path d={wavePath(2400, 160, l.amp, l.base)} fill={l.fill} opacity={l.opacity} />
        </svg>
      ))}
    </div>
  );
}
