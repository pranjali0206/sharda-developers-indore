/**
 * Runtime configuration. Everything environment-specific lives here and is read
 * from Vite env vars (see .env.example). Components never read import.meta.env directly.
 */
const env = import.meta.env;

const digits = (v: string | undefined, fallback: string) =>
  (v ?? '').replace(/\D/g, '') || fallback;

const PHONE_DIGITS = digits(env.VITE_PHONE, '919179200110');
// TODO: client to confirm +91 91792 00110 is active on WhatsApp.
const WHATSAPP_DIGITS = digits(env.VITE_WHATSAPP_NUMBER, PHONE_DIGITS);

/** "919179200110" → "+91 91792 00110" */
function formatIndian(d: string) {
  const local = d.startsWith('91') && d.length === 12 ? d.slice(2) : d;
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

export const config = {
  /** Public origin, no trailing slash. TODO: client to confirm the live domain. */
  siteUrl: (env.VITE_SITE_URL ?? '').replace(/\/$/, ''),
  leadEndpoint: env.VITE_LEAD_ENDPOINT ?? '',
  ga4Id: env.VITE_GA4_ID ?? '',
  metaPixelId: env.VITE_META_PIXEL_ID ?? '',
  phone: {
    digits: PHONE_DIGITS,
    display: formatIndian(PHONE_DIGITS),
    href: `tel:+${PHONE_DIGITS}`,
  },
  whatsapp: {
    digits: WHATSAPP_DIGITS,
    href: (text?: string) =>
      `https://wa.me/${WHATSAPP_DIGITS}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  },
  email: 'shardadevelopersindore@gmail.com',
} as const;

export type ProjectSlug = 'paradise' | 'greens';
