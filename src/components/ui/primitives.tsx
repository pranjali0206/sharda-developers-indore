import type { ReactNode } from 'react';
import { CircleCheck, Hammer, ShieldCheck } from 'lucide-react';
import { lines, site, type LineKey } from '../../content/site';
import { cx } from '../../lib/cx';

export function Eyebrow({
  children,
  className,
  center,
}: {
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return <p className={cx('eyebrow', center && 'text-center', className)}>{children}</p>;
}

/** One Hindi accent line, always in Mukta with lang="hi". */
export function HindiLine({
  k,
  className,
  as: Tag = 'p',
}: {
  k: LineKey;
  className?: string;
  as?: 'p' | 'span';
}) {
  return (
    <Tag lang="hi" className={cx('hindi-accent', className)}>
      {lines[k].hi}
    </Tag>
  );
}

/** Playfair italic punchline. */
export function Punch({
  children,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span';
}) {
  return <Tag className={cx('punch', className)}>{children}</Tag>;
}

export function ReraChip({
  rera,
  className,
  tone = 'light',
}: {
  rera: string;
  className?: string;
  tone?: 'light' | 'overlay';
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        tone === 'overlay'
          ? 'bg-white/95 text-navy-900 shadow-soft'
          : 'border border-line bg-bg text-navy-900',
        className,
      )}
    >
      <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-green-700" strokeWidth={1.75} />
      RERA No. {rera}
    </span>
  );
}

/** Project delivery status: Completed (green) / Ongoing (gold). */
export function StatusChip({
  status,
  className,
}: {
  status: 'completed' | 'ongoing';
  className?: string;
}) {
  const done = status === 'completed';
  const Icon = done ? CircleCheck : Hammer;
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        done ? 'bg-green-100 text-green-700' : 'bg-gold-200 text-navy-900',
        className,
      )}
    >
      <Icon aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
      {site.status[status]}
    </span>
  );
}

export function ArtistLabel({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        'pointer-events-none absolute bottom-3 left-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white',
        className,
      )}
    >
      {site.artist}
    </span>
  );
}

/** Section heading pattern: eyebrow, H2 with an accented second phrase. */
export function SectionHeading({
  eyebrow,
  a,
  b,
  accent = 'text-green-700',
  center,
  as: Tag = 'h2',
  className,
  dark,
}: {
  eyebrow: string;
  a: string;
  b: string;
  accent?: string;
  center?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cx(center && 'text-center', className)}>
      <Eyebrow className={dark ? 'text-gold-400' : undefined}>{eyebrow}</Eyebrow>
      <Tag
        className={cx(
          'mt-4 text-balance font-extrabold',
          Tag === 'h1' ? 'text-h1' : 'text-h2',
          dark ? 'text-white' : 'text-navy-900',
        )}
      >
        {a}{' '}
        <span className={cx('font-serif font-semibold italic tracking-normal', accent)}>{b}</span>
      </Tag>
    </div>
  );
}
