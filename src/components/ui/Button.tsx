import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { config } from '../../config';
import { cx } from '../../lib/cx';

type Variant = 'primary' | 'outline' | 'light' | 'ghostLight' | 'teal';

const base =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition duration-200 ease-brand hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-navy-700 text-white shadow-soft hover:bg-navy-900 hover:shadow-card',
  teal: 'bg-teal-700 text-white shadow-soft hover:bg-teal-650 hover:shadow-card',
  outline:
    'border border-navy-700/30 bg-white text-navy-900 hover:border-navy-700 hover:shadow-soft',
  light: 'bg-white text-navy-900 shadow-soft hover:shadow-card',
  ghostLight: 'border border-white/35 text-white hover:border-white hover:bg-white/10',
};

interface Common {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  track?: string;
}

/** Internal route (`to`), in-page/external link (`href`). Always a real <a>. */
export function ButtonLink({
  children,
  variant = 'primary',
  className,
  to,
  href,
  track,
  external,
}: Common & { to?: string; href?: string; external?: boolean }) {
  const cls = cx(base, variants[variant], className);
  if (to) {
    return (
      <Link to={to} className={cls} data-track={track}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={cls}
      data-track={track}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

/** Arrow badge used inside primary pills. */
export function ArrowBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        'grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5',
        className,
      )}
    >
      <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
    </span>
  );
}

/** Gold phone disc + label + big number. */
export function CallPill({
  label,
  className,
  dark,
}: {
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <a
      href={config.phone.href}
      className={cx(
        'group inline-flex min-h-[56px] items-center gap-3 rounded-full py-2 pl-2 pr-6 transition duration-200 ease-brand hover:-translate-y-0.5',
        dark
          ? 'bg-white/5 ring-1 ring-white/15 hover:bg-white/10'
          : 'bg-white shadow-soft ring-1 ring-line hover:shadow-card',
        className,
      )}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-900 shadow-soft">
        <Phone aria-hidden className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cx('text-xs font-medium', dark ? 'text-white/75' : 'text-ink-500')}>
          {label}
        </span>
        <span
          className={cx(
            'font-display text-lg font-extrabold tracking-tight',
            dark ? 'text-white' : 'text-navy-900',
          )}
        >
          {config.phone.display}
        </span>
      </span>
    </a>
  );
}

export function WhatsAppLink({
  children,
  text,
  className,
  variant = 'outline',
}: {
  children: ReactNode;
  text?: string;
  className?: string;
  variant?: Variant;
}) {
  return (
    <a
      href={config.whatsapp.href(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(base, variants[variant], className)}
    >
      <MessageCircle aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
      {children}
    </a>
  );
}
