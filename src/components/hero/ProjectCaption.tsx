import { Link } from 'react-router-dom';
import { site } from '../../content/site';
import { projects } from '../../content/projects';
import { cx } from '../../lib/cx';

const TONE = {
  paradise: { text: 'text-paradise-600', chip: 'bg-paradise-50 text-paradise-600' },
  greens: { text: 'text-greens-600', chip: 'bg-greens-50 text-greens-600' },
};

/**
 * Frosted caption card linking to a project. Mobile (< 768px) is the compact card
 * from the phone design; tablet and desktop use the full-size card.
 */
export function ProjectCaption({
  project,
  align,
  className,
}: {
  project: 'paradise' | 'greens';
  /** Desktop (≥ 1024px) alignment. Phones and tablets: Paradise left, Greens right. */
  align: 'left' | 'right';
  className?: string;
}) {
  const p = projects[project];
  const c = site.home.hero.captions[project];
  const tone = TONE[project];
  return (
    <Link
      to={p.path}
      data-hero-card={project}
      className={cx(
        'hero-glass group flex flex-col gap-1 rounded-[14px] p-2.5 transition-transform duration-200 hover:-translate-y-[3px] md:gap-2 md:rounded-[18px] md:px-5 md:py-[18px]',
        project === 'paradise' ? 'items-start text-left' : 'items-end text-right',
        align === 'right' ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left',
        className,
      )}
    >
      <span
        className={cx(
          'font-serif text-[15px] font-semibold italic leading-[1.18] md:text-[25px] min-[1400px]:whitespace-nowrap',
          tone.text,
        )}
      >
        {c.line}
      </span>
      <span className="text-[11px] leading-[1.3] text-ink-600 md:text-[15px]">
        {c.location}
        <span className="hidden md:inline"> · {c.detail}</span>
      </span>
      <span
        className={cx(
          'rounded-[6px] px-[9px] py-[3px] text-[9.5px] font-bold leading-[1.35] md:text-[12px]',
          tone.chip,
        )}
      >
        RERA {p.rera}
      </span>
      <span
        className={cx(
          'font-display text-[12px] font-bold leading-[1.25] md:text-[16px]',
          tone.text,
        )}
      >
        {site.home.hero.viewProject} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
