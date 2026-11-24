import { useEffect } from 'react';

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Adds .is-in once; CSS (scoped to html.motion-ok) does the animation.
 * `key` re-scans after route changes.
 */
export function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (!document.documentElement.classList.contains('motion-ok')) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Reveal at 20% visible, or once a tall element (taller than the screen)
          // fills at least a quarter of the viewport, so long sections never stay hidden.
          const tallEnough =
            e.rootBounds !== null && e.intersectionRect.height >= e.rootBounds.height * 0.25;
          if (e.isIntersecting && (e.intersectionRatio >= 0.2 || tallEnough)) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: [0, 0.05, 0.1, 0.2], rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
