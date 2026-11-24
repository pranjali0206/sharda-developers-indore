/**
 * Sends a site-visit lead as JSON to VITE_LEAD_ENDPOINT.
 *
 * The body is sent with Content-Type text/plain so the request is a CORS "simple
 * request" (no preflight). That is required for Google Apps Script web apps, which
 * cannot answer OPTIONS. The script reads it with JSON.parse(e.postData.contents).
 * See docs/lead-endpoint.gs.
 */
import { config } from '../config';
import { getAttribution } from './attribution';

export type ProjectChoice = 'paradise' | 'greens' | 'both';

export interface LeadInput {
  name: string;
  mobile: string;
  project: ProjectChoice;
  visitDate?: string;
}

export async function submitLead(input: LeadInput) {
  const payload = {
    name: input.name,
    mobile: `+91${input.mobile}`,
    project: input.project,
    visit_date: input.visitDate ?? '',
    consent: true,
    ...getAttribution(),
    page: window.location.href,
    submitted_at: new Date().toISOString(),
  };

  if (!config.leadEndpoint) {
    if (import.meta.env.DEV) {
      // Local development without an endpoint: simulate a successful submission.
      await new Promise((r) => setTimeout(r, 600));
      return;
    }
    throw new Error('Lead endpoint is not configured (VITE_LEAD_ENDPOINT).');
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(config.leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`);
    // Apps Script answers 200 even when it rejects a lead; honour {"ok": false}.
    const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (body && body.ok === false) throw new Error('Lead endpoint rejected the submission');
  } finally {
    clearTimeout(timer);
  }
}

const PENDING = 'sd_lead_pending';
const FIRED = 'sd_lead_fired';

/** Marks a successful submission so /thank-you fires conversion events exactly once. */
export function markLeadPending(project: ProjectChoice) {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    sessionStorage.setItem(PENDING, JSON.stringify({ id, project }));
  } catch {
    /* ignore */
  }
}

/** Returns the pending lead once; a refresh of /thank-you returns null. */
export function consumePendingLead(): { id: string; project: string } | null {
  try {
    const raw = sessionStorage.getItem(PENDING);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING);
    const lead = JSON.parse(raw) as { id: string; project: string };
    const fired = JSON.parse(sessionStorage.getItem(FIRED) ?? '[]') as string[];
    if (fired.includes(lead.id)) return null;
    sessionStorage.setItem(FIRED, JSON.stringify([...fired, lead.id]));
    return lead;
  } catch {
    return null;
  }
}
