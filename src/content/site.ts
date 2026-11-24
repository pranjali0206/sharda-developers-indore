/**
 * All site copy, in one place, so the client's copy deck maps 1:1.
 *
 * Locales: v1 ships English (`en`). The punchline table below already carries the
 * client-approved Hindi; a full `hi` locale can be added by creating another object
 * that satisfies `SiteCopy` and registering it in `locales`.
 *
 * Rules: never invent numbers, never write "best / No. 1 / guaranteed returns".
 */

import type { ImageName } from '../generated/images';

export type Locale = 'en' | 'hi';
export interface Bilingual {
  en: string;
  hi: string;
}

/** Client-approved brand lines + emotional support lines (use verbatim). */
export const lines = {
  brandPromise: { en: 'Your dream home starts here.', hi: 'आपके सपनों का घर, यहीं से शुरू।' },
  brandLine: { en: 'Where luxury meets nature.', hi: 'जहाँ लग्ज़री और कुदरत साथ चलें।' },
  paradiseLine: { en: 'Where connectivity meets calm.', hi: 'शहर से जुड़ाव, मन को सुकून।' },
  paradiseSignoff: { en: 'Live where life feels better.', hi: 'जहाँ ज़िंदगी और भी बेहतर लगे।' },
  greensLine: { en: 'Where growth meets greenery.', hi: 'तरक्की भी, हरियाली भी।' },
  withYou: {
    en: "From your first visit to your housewarming, we're with you.",
    hi: 'पहली मुलाक़ात से गृहप्रवेश तक, हम आपके साथ हैं।',
  },
  callAway: {
    en: "Whatever your question, we're just a call away.",
    hi: 'सवाल कोई भी हो, हम बस एक कॉल दूर हैं।',
  },
  trust: { en: 'Your trust is our foundation.', hi: 'आपका भरोसा, हमारी नींव।' },
  legacy: { en: "Today's plot. Tomorrow's legacy.", hi: 'आज का प्लॉट, कल की विरासत।' },
  growingIndore: {
    en: 'Grow with Indore, on the corridor shaping its future.',
    // Not displayed: Hindi needs client approval (no machine translation on the site).
    hi: '',
  },
  diya: {
    en: 'Every Diwali diya, now in your own courtyard.',
    hi: 'हर दिवाली का दीया, अब अपने आँगन में।',
  },
  weekend: {
    en: 'Come this weekend and choose your plot yourself.',
    hi: 'इस वीकेंड आइए, अपना प्लॉट खुद चुनिए।',
  },
  thanks: {
    en: "Your journey home has begun. We'll call you soon.",
    hi: 'आपके घर का सफ़र शुरू हो चुका है। हम जल्द ही आपको कॉल करेंगे।',
  },
} as const satisfies Record<string, Bilingual>;

export type LineKey = keyof typeof lines;

const en = {
  company: {
    name: 'Sharda Developers',
    founded: 2021,
    city: 'Indore',
    region: 'Madhya Pradesh',
    // TODO: client to supply the office address (not in brochure).
    address: null as string | null,
  },
  nav: {
    skip: 'Skip to content',
    links: [
      { label: 'About us', to: '/about-us' },
      { label: 'Sharda Paradise', to: '/sharda-paradise' },
      { label: 'Sharda Greens', to: '/sharda-greens' },
      { label: 'Location', to: '/#location' },
      { label: 'Contact', to: '/#visit' },
    ],
    allProjects: 'All projects',
    book: 'Book a site visit',
    bookShort: 'Book visit',
    call: 'Call',
    whatsapp: 'WhatsApp',
    menu: 'Menu',
    close: 'Close menu',
  },
  /** Home page (redesign, Nov 2026). One idea per section, client headlines. */
  home: {
    /** Hero (approved design, Nov 2026). */
    hero: {
      eyebrow: 'Sharda Developers · Indore',
      /**
       * TBD — client is choosing. Any { lead, accent } fits, e.g.
       * { lead: 'Minutes from the city.', accent: 'Miles from the noise.' }.
       */
      headline: { lead: 'Sharda Developers.', accent: 'A promise of excellence.' } as {
        lead: string;
        accent: string;
      },
      hindi: 'हर ईंट में उत्कृष्टता का वादा।',
      captions: {
        paradise: {
          line: 'Where connectivity meets calm',
          location: 'Navdapanth, Indore',
          detail: '10 min from the airport',
        },
        greens: {
          line: 'Where growth meets greenery',
          location: 'Betma, Indore',
          detail: 'near Pithampur Sector 7',
        },
      },
      viewProject: 'View project',
      callLabel: 'Call Sharda Developers',
      book: 'Book a free site visit',
      bookShort: 'Book visit',
      openProject: { paradise: 'Open Sharda Paradise', greens: 'Open Sharda Greens' },
      /** Shown bottom-left only if a licensed stock photo is used as the backdrop. */
      representative: 'Representative image',
      /**
       * Backdrop photo. TODO: client to supply real photos of Sharda sites / homes
       * (hero-bg-desktop 2880×1800, hero-bg-mobile 1170×2532). Until then the spec's
       * fallbacks are used. Set isStock: true if a licensed stock photo is used.
       */
      // Client-supplied city skyline (rotated to landscape, blur baked in). Stock imagery:
      // isStock shows the small 'Representative image' note.
      photo: { image: 'hero-skyline', isStock: true } as { image: ImageName; isStock: boolean },
    },
    /** Key facts band (marquee). Only verified facts. */
    marquee: [
      'RERA-approved colonies in Indore',
      'Sharda Paradise · RERA P-IND-26-6360',
      'Sharda Greens · RERA P-IND-23-4395',
      '10 min to Devi Ahilya Holkar Airport',
      'On the Indore–Ahmedabad Highway',
      'Near Pithampur Sector 7',
      'Building trust since 2021',
    ],
    about: {
      eyebrow: 'About us',
      h2a: 'Built on trust.',
      h2b: 'Kept by our word.',
      body: 'Since 2021, Indore families have trusted Sharda Developers with the biggest decision of their lives. We repay that trust with clear paperwork, honest pricing and a promise kept at every step.',
      values: ['Transparent dealings', 'RERA-registered', 'Promises kept'],
      more: 'More about us',
    },
    projects: {
      eyebrow: 'Our projects',
      h2a: 'Stop renting dreams.',
      h2b: 'Start owning one.',
      intro:
        'Two RERA-registered colonies on the Indore–Ahmedabad Highway corridor, each planned around open green spaces. Choose the one that fits your family.',
      explore: 'Explore',
      book: 'Book a visit',
    },
    life: {
      eyebrow: 'Life at Sharda',
      h2: 'Breathe. Build. Belong.',
      body: 'Gardens, a gazebo, sports courts, play areas and walking tracks are part of every Sharda colony, so every part of your day has somewhere to go.',
      cta: 'See all amenities',
    },
    location: {
      eyebrow: 'Location',
      h2a: "Indore's next address",
      h2b: 'is yours.',
      intro:
        'Both colonies sit on the Indore–Ahmedabad Highway corridor: Sharda Paradise 10 minutes from the airport, Sharda Greens near Pithampur Sector 7. Tap a map to explore the project.',
      satellite: 'Satellite view',
      openMaps: 'Open in Google Maps',
      amenitiesEyebrow: 'Amenities',
      amenitiesTitle: 'Everything your family needs, inside the gate.',
    },
    visit: {
      eyebrow: 'Book a site visit',
      h2a: 'Home,',
      h2b: 'the way it should be.',
      body: 'Book a free site visit. Walk the gate, the roads and the gardens yourself, then pick your plot.',
      phoneLabel: 'Call or WhatsApp',
      emailLabel: 'Email us',
    },
  },
  proofNote:
    "Images are artist's impressions. Sharda Paradise RERA No. P-IND-26-6360 · Sharda Greens RERA No. P-IND-23-4395.",
  form: {
    title: 'Book a site visit',
    name: 'Your name',
    namePh: 'Full name',
    mobile: 'Mobile number',
    mobilePh: '10-digit mobile',
    interest: 'Interested in',
    both: 'Both',
    date: 'Preferred visit date',
    optional: '(optional)',
    consent:
      'I agree to be contacted by Sharda Developers by call, SMS or WhatsApp about this enquiry.',
    privacy: 'Privacy Policy',
    submit: 'Book my site visit',
    sending: 'Sending…',
    note: "We'll call you back to confirm a time.",
    errors: {
      nameMin: 'Please enter your name (at least 2 letters).',
      nameMax: 'Please keep your name under 60 characters.',
      mobile: 'Please enter a valid 10-digit Indian mobile number.',
      consent: 'Please tick the box so we can contact you.',
      date: 'Please choose today or a later date.',
      send: 'Sorry, we couldn’t send your request just now. Please call us on',
    },
  },
  /**
   * About us — client copy (Nov 2026), lightly edited: "homes / construction" →
   * "residential colonies / infrastructure" (both projects are plotted colonies),
   * and no unverifiable "happy families" claim.
   */
  about: {
    eyebrow: 'About us',
    h1a: 'Building trust,',
    h1b: 'one home at a time.',
    intro: [
      'Sharda Developers is a real estate development company based in Indore, founded in 2021. We develop thoughtfully planned residential colonies with quality infrastructure, honest dealings and timely delivery.',
      'We are a young company with an old-fashioned value: keep your word. We plan every project around the families who will live in it, not just the land it stands on.',
    ],
    founded: { value: '2021', label: 'Founded in Indore' },
    journey: {
      eyebrow: 'Our projects',
      h2a: 'One delivered.',
      h2b: 'One underway.',
    },
    values: {
      eyebrow: 'What sets us apart',
      h2a: 'Five things',
      h2b: 'we hold ourselves to.',
      items: [
        {
          icon: 'transparency',
          title: 'Transparency first',
          body: 'Clear pricing, clear paperwork, no hidden charges.',
        },
        {
          icon: 'quality',
          title: 'Quality you can see',
          body: 'Trusted materials and careful supervision at every stage.',
        },
        {
          icon: 'timeline',
          title: 'On-time delivery',
          body: 'Realistic planning and a commitment to every timeline.',
        },
        {
          icon: 'service',
          title: 'Customer-first service',
          body: 'We stay with you from the site visit to handover, and beyond.',
        },
        {
          icon: 'spaces',
          title: 'Livable spaces',
          body: 'Open areas and practical layouts for everyday family life.',
        },
      ],
    },
    promise: {
      eyebrow: 'Our promise',
      text: 'When you choose Sharda Developers, you are not just buying property. You are choosing a partner who treats your home as seriously as you do.',
    },
    seo: {
      title: 'About Sharda Developers, Indore · Since 2021',
      description:
        'Founded in Indore in 2021, Sharda Developers delivered Sharda Greens and is now developing Sharda Paradise. Transparent, quality-first and on time.',
    },
  },
  cta: {
    title: 'Come see it for yourself.',
    call: 'Call',
    whatsapp: 'WhatsApp us',
    book: 'Book a site visit',
  },
  footer: {
    projects: 'Projects',
    contact: 'Contact',
    rera: 'RERA',
    about: 'About us',
    privacy: 'Privacy policy',
    disclaimerTitle: 'Disclaimer',
    disclaimer:
      'This is only a conceptual representation of the proposed project and not a legal document. Elevations, colors, furniture and amenities shown are indicative and may differ from the original. The company reserves all rights regarding this project.',
    rights: 'All rights reserved.',
  },
  artist: "Artist's impression",
  status: { completed: 'Completed', ongoing: 'Ongoing' },
  thankYou: {
    h1: 'Thank you!',
    cantWait: "Can't wait? Call or WhatsApp",
    explore: 'While you wait, take another look',
  },
  notFound: {
    h1: 'This page has moved on.',
    body: 'The page you were looking for isn’t here. Let’s get you home.',
    home: 'Go to the home page',
  },
  /** Never ship placeholder testimonials. Add real buyers here to show the section. */
  testimonials: [] as { name: string; project: string; quote: string; photo?: string }[],
  /**
   * FAQ is hidden until the client approves the answers. Items with `answer: null`
   * are always skipped. TODO: client to approve FAQ, visit timings, home-loan help.
   */
  faq: {
    enabled: false,
    title: 'Questions, answered',
    items: [
      {
        q: 'Are Sharda Paradise and Sharda Greens RERA-registered?',
        answer:
          'Yes. Sharda Paradise is registered under RERA No. P-IND-26-6360 and Sharda Greens under RERA No. P-IND-23-4395.',
      },
      {
        q: 'What plot sizes are available at Sharda Paradise?',
        answer:
          'Plots range from 700 to 1,000 sq ft: 20′×35′, 20′×37′ (avg.), 20′×40′, 18′×50′, 20′×45′ and 20′×50′. Call us for current availability.',
      },
      {
        q: 'Where exactly are the projects?',
        answer:
          'Sharda Paradise is in Navdapanth, Indore, on the Indore–Ahmedabad Highway, about 10 minutes from Devi Ahilya Holkar Airport. Sharda Greens is in Betma, Indore, near the Indore–Ahmedabad National Highway and Pithampur Sector 7.',
      },
      { q: 'When can I visit the site?', answer: null as string | null },
      { q: 'Do you help with home loans?', answer: null as string | null },
    ],
  },
};

export type SiteCopy = typeof en;

/** Register additional locales here (e.g. `hi`) once translated by the client. */
export const locales: Partial<Record<Locale, SiteCopy>> & { en: SiteCopy } = { en };

export const site = locales.en;
