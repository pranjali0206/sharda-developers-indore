/**
 * GA4 + Meta Pixel. Both load only when their IDs are configured, and only after
 * the page is idle so they never compete with the LCP.
 *
 * Events: click_call, click_whatsapp, view_project, form_start, generate_lead.
 */
import { config } from '../config';

type EventName = 'click_call' | 'click_whatsapp' | 'view_project' | 'form_start' | 'generate_lead';
type Params = Record<string, string | number | undefined>;

type Fbq = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: Fbq;
    _fbq?: unknown;
    __sdReady?: boolean;
  }
}

/** Meta standard events where one exists; everything else is a custom event. */
const META_STANDARD: Partial<Record<EventName, string>> = {
  generate_lead: 'Lead',
  click_call: 'Contact',
  click_whatsapp: 'Contact',
  view_project: 'ViewContent',
};

function loadScript(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function initGa4(id: string) {
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  window.gtag = function gtag() {
    // gtag.js expects the raw `arguments` object.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

function initMetaPixel(id: string) {
  if (window.fbq) return;
  const fbq: Fbq = (...args: unknown[]) => {
    (fbq.queue = fbq.queue || []).push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;
  loadScript('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', id);
  fbq('track', 'PageView');
}

export function track(event: EventName, params: Params = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event, params);
  const meta = META_STANDARD[event];
  if (meta) window.fbq?.('track', meta, params);
  else window.fbq?.('trackCustom', event, params);
}

/** SPA page views after client-side navigation. */
export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', { page_path: path });
  window.fbq?.('track', 'PageView');
}

/** One delegated listener catches every tel: and WhatsApp link on the site. */
function listenForContactClicks() {
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const a = target?.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const where =
        a.dataset.track ?? a.closest('[data-section]')?.getAttribute('data-section') ?? '';
      if (href.startsWith('tel:')) track('click_call', { location: where });
      else if (href.includes('wa.me/')) track('click_whatsapp', { location: where });
    },
    { capture: true },
  );
}

export function initAnalytics() {
  listenForContactClicks();
  if (!config.ga4Id && !config.metaPixelId) return;
  const start = () => {
    if (config.ga4Id) initGa4(config.ga4Id);
    if (config.metaPixelId) initMetaPixel(config.metaPixelId);
  };
  if (document.readyState === 'complete') setTimeout(start, 1200);
  else window.addEventListener('load', () => setTimeout(start, 1200), { once: true });
}
