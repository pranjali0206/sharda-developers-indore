import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../../content/site';
import { useReveal } from '../../hooks/useReveal';
import { trackPageView } from '../../lib/analytics';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFab } from './ActionBars';
import { MobileActionBar } from '../hero/MobileActionBar';

/** Routes that carry the site-visit form (id="visit"). */
const FORM_ROUTES = ['/', '/about-us', '/sharda-paradise', '/sharda-greens'];

/** Scroll to top on route change, or to the #hash target when present. */
function useScrollManager(pathname: string, hash: string) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!hash) return;
    }
    if (hash) {
      // Wait a frame so the new route has rendered its sections.
      const id = decodeURIComponent(hash.slice(1));
      const go = () => document.getElementById(id)?.scrollIntoView();
      // Arriving from another page: jump, then correct once lazy sections have rendered.
      requestAnimationFrame(go);
      setTimeout(go, 350);
      setTimeout(go, 900);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const path = pathname.replace(/\/$/, '') || '/';
  const hasForm = FORM_ROUTES.includes(path);
  const bookHref = hasForm ? '#visit' : '/#visit';
  const isProject = path === '/sharda-paradise' || path === '/sharda-greens';

  useScrollManager(pathname, hash);
  useReveal(pathname);

  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false; // initial page_view is sent by gtag config / fbq init
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-white"
      >
        {site.nav.skip}
      </a>
      <Header bookHref={bookHref} isProject={isProject} />
      <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
        {children}
      </main>
      <Footer />
      {/* Spacer so the fixed mobile bar never covers the footer. */}
      <div
        aria-hidden
        className="h-[calc(68px+env(safe-area-inset-bottom))] bg-navy-950 md:hidden"
      />
      <MobileActionBar bookHref={bookHref} />
      <WhatsAppFab />
    </>
  );
}
