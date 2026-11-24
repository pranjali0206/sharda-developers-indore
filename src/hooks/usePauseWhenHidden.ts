import { useEffect, type RefObject } from 'react';

/**
 * Sets data-paused on the element while it is off-screen or the tab is hidden,
 * which pauses its CSS loop animations. No React re-renders involved.
 */
export function usePauseWhenHidden(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = true;
    const apply = () => {
      if (visible && document.visibilityState === 'visible') el.removeAttribute('data-paused');
      else el.setAttribute('data-paused', '');
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      apply();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, [ref]);
}
