import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Menu, Phone, X } from 'lucide-react';
import { config } from '../../config';
import { site } from '../../content/site';
import { Img } from '../ui/Img';
import { cx } from '../../lib/cx';

/** Desktop nav items (approved design). The menu also lists About us. */
const PRIMARY = ['Sharda Paradise', 'Sharda Greens', 'Location', 'Contact'];

/** Smooth-scroll to a section on the current page (works even if the hash is unchanged). */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const smooth = document.documentElement.classList.contains('motion-ok');
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  history.replaceState(null, '', `#${id}`);
  // Sections below the fold render lazily (content-visibility), so heights can change
  // during the scroll. Once it settles, snap precisely onto the target.
  const settle = () => {
    const top = el.getBoundingClientRect().top;
    const header =
      document.querySelector('[data-section="header"]')?.getBoundingClientRect().height ?? 0;
    if (Math.abs(top - header - 16) > 4) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    settle();
    requestAnimationFrame(settle);
  };
  window.addEventListener('scrollend', once, { once: true });
  setTimeout(once, 1400);
  return true;
}

function NavItem({ to, label, className }: { to: string; label: string; className: string }) {
  const { pathname } = useLocation();
  if (to.includes('#')) {
    const [path, id = ''] = to.split('#');
    const samePage =
      !path || (path.replace(/\/$/, '') || '/') === (pathname.replace(/\/$/, '') || '/');
    if (samePage) {
      return (
        <a
          href={`#${id}`}
          className={className}
          onClick={(e) => {
            if (scrollToId(id)) e.preventDefault();
          }}
        >
          {label}
        </a>
      );
    }
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    );
  }
  return (
    <NavLink to={to} className={className}>
      {label}
    </NavLink>
  );
}

/**
 * Site header (approved design): translucent white with an 8px backdrop blur.
 * Desktop (≥ 1024px): 81px tall, logo · four nav items · phone + "Book a site visit".
 * Phones/tablets: a floating white rounded bar (74px band): logo · "Book a site visit" pill ·
 * menu button. Calling stays one tap away in the bottom action bar.
 * Desktop turns solid white once the page scrolls, for legibility over content.
 */
export function Header({ bookHref, isProject }: { bookHref: string; isProject: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Contact = the site-visit form (this page's, if it has one); Location = home map section.
  const links = site.nav.links.map((l) => (l.label === 'Contact' ? { ...l, to: bookHref } : l));
  const primary = links.filter((l) => PRIMARY.includes(l.label));

  return (
    <header
      data-section="header"
      className={cx(
        'sticky top-0 z-40 h-[74px] px-3 py-2.5 transition-colors duration-200 lg:h-[81px] lg:border-b lg:p-0 lg:backdrop-blur-[8px]',
        scrolled || open ? 'lg:border-line lg:bg-white/[.92]' : 'lg:border-white/60 lg:bg-white/55',
      )}
    >
      <div
        className={cx(
          'flex h-full items-center justify-between gap-3 rounded-[18px] bg-white px-3.5 transition-shadow lg:gap-4 lg:rounded-none lg:bg-transparent lg:px-6 lg:shadow-none xl:px-16',
          scrolled || open
            ? 'shadow-[0_10px_30px_rgba(20,38,80,0.16)]'
            : 'shadow-[0_8px_24px_rgba(20,38,80,0.10)]',
        )}
      >
        <Link to="/" className="shrink-0 rounded-lg" aria-label="Sharda Developers — home">
          <Img
            name="sharda-developers-logo"
            alt="Sharda Developers"
            sizes="96px"
            priority
            className="h-10 w-auto lg:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-[22px] xl:gap-[30px]">
            {primary.map((l) => (
              <li key={l.label}>
                <NavItem
                  to={l.to}
                  label={l.label}
                  className="whitespace-nowrap text-[15px] font-medium text-navy-900 no-underline hover:text-navy-700"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-[18px] lg:flex">
          <a
            href={config.phone.href}
            data-track="header"
            className="inline-flex items-center gap-2 whitespace-nowrap text-[16px] font-bold text-navy-900"
          >
            <Phone aria-hidden className="h-4 w-4 xl:hidden" strokeWidth={2} />
            <span className="sr-only xl:not-sr-only">
              <span className="xl:hidden">Call </span>
              {config.phone.display}
            </span>
          </a>
          <a
            href={bookHref}
            className="whitespace-nowrap rounded-full bg-navy-900 px-[22px] py-3 font-display text-[16px] font-bold text-white transition hover:bg-navy-700"
          >
            {site.nav.book}
          </a>
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <a
            href={bookHref}
            className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-navy-900 px-4 font-display text-[14px] font-semibold text-white transition hover:bg-navy-700"
          >
            <span className="min-[380px]:hidden">{site.home.hero.bookShort}</span>
            <span className="hidden min-[380px]:inline">{site.nav.book}</span>
            <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2.2} />
          </a>
          <button
            type="button"
            aria-label={open ? site.nav.close : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-navy-900"
          >
            {open ? (
              <X aria-hidden className="h-6 w-6" strokeWidth={2.2} />
            ) : (
              <Menu aria-hidden className="h-6 w-6" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-2 rounded-[18px] bg-white shadow-[0_14px_34px_rgba(20,38,80,0.16)] lg:hidden"
          >
            <ul className="flex flex-col px-4 py-3 [&_a]:flex [&_a]:min-h-[48px] [&_a]:items-center">
              {isProject && (
                <li>
                  <Link to="/" className="gap-2 px-2 text-[15px] font-medium text-ink-600">
                    <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                    {site.nav.allProjects}
                  </Link>
                </li>
              )}
              {links.map((l) => (
                <li key={l.label}>
                  <NavItem
                    to={l.to}
                    label={l.label}
                    className="px-2 text-[16px] font-medium text-navy-900"
                  />
                </li>
              ))}
              <li>
                <a href={bookHref} className="px-2 text-[16px] font-semibold text-navy-900">
                  {site.nav.book}
                </a>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
