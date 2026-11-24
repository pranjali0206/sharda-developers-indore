/**
 * Captures campaign attribution on the first page of a session and keeps it in
 * sessionStorage so it is still there when the visitor submits the form later.
 */
const KEY = 'sd_attribution';
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

export type Attribution = Record<(typeof PARAMS)[number], string> & {
  landing_page: string;
  referrer: string;
};

function read(): Partial<Attribution> | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<Attribution>) : null;
  } catch {
    return null;
  }
}

export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const existing = read();
    const hasCampaign = PARAMS.some((p) => url.searchParams.get(p));
    // Keep the first touch of the session, unless a new campaign click arrives.
    if (existing && !hasCampaign) return;
    const data = Object.fromEntries(
      PARAMS.map((p) => [p, url.searchParams.get(p) ?? '']),
    ) as Attribution;
    data.landing_page = url.href;
    data.referrer = document.referrer;
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable (e.g. private mode): attribution is best-effort */
  }
}

export function getAttribution(): Attribution {
  const empty = Object.fromEntries(PARAMS.map((p) => [p, ''])) as Attribution;
  return { ...empty, landing_page: '', referrer: '', ...read() };
}
