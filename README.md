# Sharda Developers — website

Marketing site for **Sharda Developers, Indore**: Sharda Paradise (Navdapanth, RERA P-IND-26-6360)
and Sharda Greens (Betma, RERA P-IND-23-4395). Built to turn ad and search traffic into calls,
WhatsApp chats and site-visit bookings.

Vite · React 18 · TypeScript (strict) · Tailwind 3 · Framer Motion · React Router · react-hook-form + zod · pre-rendered static HTML.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (Node 20.19+). |
| `npm run dev` | Local dev server at http://localhost:5173 (no pre-render; form submissions are simulated). |
| `npm run build` | Optimise images → type-check → client build → SSR build → pre-render every route to `dist/`. |
| `npm run preview` | Serve `dist/` at http://localhost:4173. |
| `npm run lint` | ESLint + Prettier check. |
| `npm run check:contrast` | WCAG AA check of every text/background token pair used. |
| `npm run verify` | Playwright checks + screenshots (run after `build`; set `VITE_LEAD_ENDPOINT` to any URL to test the success path). |
| `npm run lighthouse` | Lighthouse (mobile) for `/`, `/sharda-paradise`, `/sharda-greens` → `verification/lighthouse/`. |
| `npm run images` | Re-generate AVIF/WebP variants after replacing photos in `public/assets/`. |

## Environment variables

Copy `.env.example` to `.env.local` (or set them in your host's dashboard), then rebuild.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Live origin, e.g. `https://www.example.com`. Enables canonical URLs, absolute OG URLs and `sitemap.xml`. |
| `VITE_LEAD_ENDPOINT` | URL the site-visit form POSTs JSON to. See `docs/lead-endpoint.gs` (Google Sheet in 5 minutes). |
| `VITE_GA4_ID` | GA4 measurement ID. GA loads only when set. |
| `VITE_META_PIXEL_ID` | Meta Pixel ID. Pixel loads only when set. |
| `VITE_WHATSAPP_NUMBER` | Digits with country code (default `919179200110`). |
| `VITE_PHONE` | Digits with country code (default `919179200110`). |

Analytics events: `click_call`, `click_whatsapp` (any `tel:` / `wa.me` link, with its page section),
`view_project`, `form_start`, `generate_lead` (fired once per submission on `/thank-you`; Meta `Lead`).

## Editing content

- **All copy**: `src/content/site.ts` (brand lines with approved Hindi, section text, About us page, form labels, FAQ, testimonials).
- **Project facts**: `src/content/projects.ts` (RERA, amenities, plot sizes, gallery, landmarks, prices, map/video links).
- **Colours / type**: `src/design/tokens.json` + `tailwind.config.ts`.
- **Photos**: replace files in `public/assets/` keeping the same names, run `npm run images`. Higher-resolution
  originals are picked up automatically (widths up to 1600px).

## Hosting

`dist/` is plain static files. Every route exists as both `route.html` and `route/index.html`, and
`404.html` is provided, so Netlify, Vercel, Cloudflare Pages, S3/CloudFront or nginx all work without rewrites.
Enable gzip/brotli (on by default on those hosts).

## Assets

Logos and renders were extracted from `reference/SHARDA_PARADISE_Brochure.pdf` and
`reference/Sharda_Developers_Stall_branding.pdf` (the Sharda Paradise logo was rebuilt from the brochure's vector
artwork with a transparent background).
