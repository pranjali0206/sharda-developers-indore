/**
 * Project data — drives the home project rows, branch cards and both project pages.
 * Facts are taken verbatim from reference/SHARDA_PARADISE_Brochure.pdf and
 * reference/Sharda_Developers_Stall_branding.pdf. Anything the client has not supplied
 * is `null` and renders as a clean placeholder — never as an invented value.
 */
import type { ProjectSlug } from '../config';
import type { ImageName } from '../generated/images';
import type { LineKey } from './site';

export type GalleryCategory = 'entrance' | 'gardens' | 'amenities' | 'aerial';

export const GALLERY_CATEGORIES: Record<GalleryCategory, string> = {
  entrance: 'Entrance',
  gardens: 'Gardens',
  amenities: 'Amenities',
  aerial: 'Aerial views',
};

export interface GalleryItem {
  image: ImageName;
  /** Short caption shown on the showcase stage. */
  title: string;
  alt: string;
  category: GalleryCategory;
}

export type LandmarkIcon = 'plane' | 'highway' | 'corridor' | 'road' | 'school' | 'office';

export interface Project {
  slug: ProjectSlug;
  path: string;
  name: string;
  short: string;
  rera: string;
  locality: string;
  /** "Navdapanth, Indore" */
  location: string;
  /** Supporting line for branch cards. */
  supportLine: string;
  /** Delivery status (client, Nov 2026). */
  status: 'completed' | 'ongoing';
  /** One-line story for the About page / journey timeline. */
  story: string;
  /** Chip under the logo on the highway strip. */
  stripLine: string;
  logo: ImageName;
  logoSize: { w: number; h: number };
  heroImage: ImageName;
  rowImage: ImageName;
  line: LineKey;
  signoff: LineKey;
  h1a: string;
  h1b: string;
  /** Short punchline for the branch card (no full stop). */
  cardLine: string;
  rowBody: string;
  heroBody: string;
  heroBadge: { value: string; label: string } | null;
  tiles: { value: string; label: string }[];
  amenities: string[] | null;
  amenitiesSide: string | null;
  why: { title: string; body: string }[] | null;
  /** Curated client renders (Nov 2026 hand-over), in showcase order. */
  gallery: GalleryItem[];
  plots: { size: string; area: string }[] | null;
  /** Extra line under the plot table (e.g. commercial plots on the plan). */
  plotsNote?: string;
  /** TODO: client to supply prices & payment plans. */
  pricing: string | null;
  sitePlan: ImageName | null;
  landmarks: { name: string; detail: string; icon: LandmarkIcon }[] | null;
  /** TODO: client to supply the 3D walkthrough URL (brochure QR code). */
  videoUrl: string | null;
  /** Google Maps link (opens in a new tab). */
  mapsUrl: string | null;
  /** Keyless Google Maps embed (satellite) for the home Location section. */
  mapEmbed: string | null;
  /** Short line under the location on the hero cards. */
  heroLine: string;
  seo: { title: string; description: string; og: string };
}

export const projects: Record<ProjectSlug, Project> = {
  paradise: {
    slug: 'paradise',
    path: '/sharda-paradise',
    name: 'Sharda Paradise',
    short: 'Paradise',
    rera: 'P-IND-26-6360',
    locality: 'Navdapanth',
    location: 'Navdapanth, Indore',
    supportLine: 'Just 10 min from the airport, near the upcoming economic corridor',
    status: 'ongoing',
    story:
      'Our next chapter. It builds on everything we learned at Sharda Greens, with better planning, thoughtful design and a focus on community living.',
    stripLine: 'Navdapanth · near DPS School & Sihansa IT Park',
    logo: 'sharda-paradise-logo',
    logoSize: { w: 1200, h: 579 },
    heroImage: 'p-gate-dusk',
    rowImage: 'p-gate-sunset',
    line: 'paradiseLine',
    signoff: 'paradiseSignoff',
    h1a: 'Where connectivity',
    h1b: 'meets calm',
    cardLine: 'Where connectivity meets calm',
    rowBody:
      'A premium residential colony in Navdapanth, Indore, strategically located on the Indore–Ahmedabad Highway. Connected to the upcoming economic corridor, just 10 minutes from the airport.',
    heroBody:
      'A premium residential colony in Navdapanth, Indore. Strategically located at the Indore–Ahmedabad Highway and connected to the upcoming Economic Corridor, just 10 minutes from the airport. RERA-registered for complete trust, with modern amenities for an elevated living experience.',
    heroBadge: { value: '10 min', label: 'to Devi Ahilya Holkar Airport' },
    tiles: [
      { value: '10 min', label: 'to the airport' },
      { value: '15', label: 'amenities' },
      { value: '700–1,000', label: 'sq ft plot sizes' },
      { value: '75 m', label: 'economic corridor alongside' },
    ],
    amenities: [
      'Grand Entrance Gate',
      'Water Tank',
      "Children's Play Area",
      'Open Gym',
      'Jogging Track',
      'High Mast Lighting & Street Lights',
      'Underground Electric Line',
      'Beautiful Landscaped Gardens',
      'Storm Water Drainage System',
      'Cement Concrete Wide Roads',
      'Planned Infrastructure',
      'Compound Boundary Wall',
      'Underground Drainage Line',
      'Overhead Tank',
      'Secured Campus',
    ],
    amenitiesSide: 'Eco-luxury living crafted with a gazebo, sports area and walking track.',
    why: null,
    gallery: [
      {
        image: 'p-gate-dusk',
        title: 'The grand entrance at dusk',
        alt: 'Sharda Paradise grand entrance gate lit up at dusk',
        category: 'entrance',
      },
      {
        image: 'paradise-gate',
        title: 'A gateway on the highway',
        alt: 'Sharda Paradise entrance gate and plaza by day',
        category: 'entrance',
      },
      {
        image: 'p-gate-sunset',
        title: 'Golden hour at the gate',
        alt: 'Sharda Paradise entrance gate in the evening glow',
        category: 'entrance',
      },
      {
        image: 'p-jacaranda-walk',
        title: 'The jacaranda walk',
        alt: 'Stepping-stone path through a lawn lined with jacaranda trees',
        category: 'gardens',
      },
      {
        image: 'p-pergola',
        title: 'Pergola by the water',
        alt: 'Pergola beside a reflecting water feature and lawn',
        category: 'gardens',
      },
      {
        image: 'p-lawn-gym',
        title: 'Landscaped lawns & open gym',
        alt: 'Curved garden with stepping stones and open-gym equipment',
        category: 'amenities',
      },
      {
        image: 'p-kids-play',
        title: "Children's play area",
        alt: "Colourful children's play area with swings and play equipment",
        category: 'amenities',
      },
      {
        image: 'p-sports-court',
        title: 'Sports court & jogging track',
        alt: 'Sports court ringed by a red jogging track',
        category: 'amenities',
      },
      {
        image: 'p-pergola-court',
        title: 'The pergola court',
        alt: 'Timber pergola over a paved court with seating',
        category: 'amenities',
      },
      {
        image: 'p-garden-path',
        title: 'Tree-lined garden path',
        alt: 'Garden path between flowering hedges and trees',
        category: 'gardens',
      },
      {
        image: 'p-linear-park',
        title: 'The linear park',
        alt: 'Long landscaped lawn with walkways and trees',
        category: 'gardens',
      },
      {
        image: 'p-open-lawn',
        title: 'The open lawn',
        alt: 'Wide open lawn bordered by palms and trees',
        category: 'gardens',
      },
      {
        image: 'p-garden-aerial',
        title: 'The central garden from above',
        alt: 'Aerial view of the central garden and play area',
        category: 'aerial',
      },
      {
        image: 'p-sports-aerial',
        title: 'Sports zone from above',
        alt: 'Aerial view of the sports court, open gym and lawn',
        category: 'aerial',
      },
      {
        image: 'p-gate-aerial',
        title: 'The entrance plaza from above',
        alt: 'Aerial view of the entrance gate and landscaped plaza',
        category: 'aerial',
      },
      {
        image: 'p-linear-aerial',
        title: 'Roadside garden from above',
        alt: 'Aerial view of the landscaped strip along the internal road',
        category: 'aerial',
      },
    ],
    plots: [
      { size: "20' × 50'", area: '1,000' },
      { size: "20' × 45'", area: '900' },
      { size: "18' × 50'", area: '900' },
      { size: "20' × 40'", area: '800' },
      { size: "20' × 37' (avg.)", area: '≈ 740' },
      { size: "20' × 35'", area: '700' },
    ],
    pricing: null,
    sitePlan: 'p-site-plan',
    landmarks: [
      { name: 'Devi Ahilya Holkar Airport', detail: 'About 10 minutes away', icon: 'plane' },
      {
        name: 'Indore–Ahmedabad Highway',
        detail: 'The project entrance is on the highway',
        icon: 'highway',
      },
      {
        name: '75 m Economic Corridor',
        detail: 'Upcoming, alongside the project',
        icon: 'corridor',
      },
      { name: '45 m Road', detail: 'Close to the project', icon: 'road' },
      { name: 'DPS School', detail: 'In the neighbourhood', icon: 'school' },
      { name: 'Sihansa IT Park', detail: 'In the neighbourhood', icon: 'office' },
    ],
    // From the brochure QR codes (scan.page → YouTube / Google Maps pin).
    videoUrl: 'https://www.youtube-nocookie.com/embed/H59Mz6sgFeI?autoplay=1&rel=0',
    mapsUrl: 'https://www.google.com/maps?q=22.692605,75.770777',
    mapEmbed: 'https://maps.google.com/maps?q=22.692605,75.770777&t=k&z=17&output=embed',
    heroLine: '10 min from the airport',
    seo: {
      title: 'Sharda Paradise, Navdapanth Indore · RERA P-IND-26-6360',
      description:
        'Premium residential plots of 700–1,000 sq ft on the Indore–Ahmedabad Highway, 10 min from the airport. 15 amenities. Book a free site visit.',
      og: '/og-paradise.jpg',
    },
  },
  greens: {
    slug: 'greens',
    path: '/sharda-greens',
    name: 'Sharda Greens',
    short: 'Greens',
    rera: 'P-IND-23-4395',
    locality: 'Betma',
    location: 'Betma, Indore',
    supportLine: 'Near the Indore–Ahmedabad National Highway & Pithampur Sector 7',
    status: 'completed',
    story:
      'Our first project, delivered and now home to families. It shows what we stand for: quality, transparency and commitment.',
    stripLine: 'Betma · near the National Highway',
    logo: 'sharda-greens-logo',
    logoSize: { w: 564, h: 151 },
    heroImage: 'greens-gate',
    rowImage: 'g-boulevard',
    line: 'greensLine',
    signoff: 'brandLine',
    h1a: 'Where growth',
    h1b: 'meets greenery',
    cardLine: 'Where growth meets greenery',
    rowBody:
      "A premium residential colony in Betma, Indore, strategically located near the Indore–Ahmedabad National Highway and Pithampur Sector 7. A garden-centric paradise with a walking track and kids' play area.",
    heroBody:
      "A premium residential colony in Betma, Indore. Strategically located near the Indore–Ahmedabad National Highway and Pithampur Sector 7 — a garden-centric paradise with amenities like a walking track and kids' play area.",
    heroBadge: { value: 'Betma', label: 'near Pithampur Sector 7' },
    tiles: [
      { value: 'Betma, Indore', label: 'near Pithampur Sector 7' },
      { value: 'Garden-centric', label: 'gazebo & landscaped lawns' },
      { value: 'Walking track', label: 'for everyday wellness' },
      { value: "Kids' play area", label: 'safe, inside the campus' },
    ],
    // From the Sharda Greens brochure (Nov 2026), translated from Hindi.
    amenities: [
      'Grand Entrance Gate',
      'Walking Track',
      'Garden Gazebo',
      'Beautiful Landscaped Gardens',
      'Basketball Court',
      'Open Gym',
      "Women's Garden",
      "Kids' Play Area",
      'Multipurpose Lawn',
      'Water Tank',
      'Street Lights',
      'Cement Concrete Wide Roads',
      'Underground Drainage Line',
      'Boundary Wall',
    ],
    amenitiesSide: null,
    why: [
      {
        title: 'A premium residential colony',
        body: 'A planned, gated colony in Betma, Indore.',
      },
      {
        title: 'Strategically located',
        body: 'Near the Indore–Ahmedabad National Highway and Pithampur Sector 7.',
      },
      {
        title: 'A garden-centric paradise',
        body: "Landscaped gardens with a walking track and a kids' play area.",
      },
    ],
    gallery: [
      {
        image: 'greens-gate',
        title: 'The gate at golden hour',
        alt: 'Sharda Greens entrance gate with palms in the evening light',
        category: 'entrance',
      },
      {
        image: 'g-gate-day',
        title: 'Welcome to Sharda Greens',
        alt: 'Sharda Greens entrance gate by day',
        category: 'entrance',
      },
      {
        image: 'g-gate-angle',
        title: 'The gate from the approach',
        alt: 'Sharda Greens entrance gate seen at an angle from the approach',
        category: 'entrance',
      },
      {
        image: 'g-gate-street',
        title: 'Arriving from the main road',
        alt: 'Sharda Greens entrance seen from the approach road',
        category: 'entrance',
      },
      {
        image: 'g-gate-pillars',
        title: 'The pillared entrance plaza',
        alt: 'Entrance plaza framed by tall pillars and a sculpture',
        category: 'entrance',
      },
      {
        image: 'g-boulevard',
        title: 'The garden boulevard by night',
        alt: 'Central garden strip along the boulevard, lit at night',
        category: 'gardens',
      },
      {
        image: 'g-gazebo',
        title: 'Evenings at the gazebo',
        alt: 'Lit gazebo with residents relaxing in the evening',
        category: 'gardens',
      },
      {
        image: 'g-circle-garden',
        title: 'The circular garden',
        alt: 'Circular garden with a walking path and gazebo',
        category: 'gardens',
      },
      {
        image: 'g-pavilion',
        title: 'Garden pavilion',
        alt: 'Garden pavilion with Sharda Greens signage and landscaping',
        category: 'amenities',
      },
      {
        image: 'g-sculpture',
        title: 'The sculpture court',
        alt: 'Sculpture and seating court beside a garden pavilion',
        category: 'amenities',
      },
      {
        image: 'g-circle-plaza',
        title: 'The circular plaza from above',
        alt: 'Aerial view of the circular entrance plaza',
        category: 'aerial',
      },
      {
        image: 'g-aerial-gazebo',
        title: 'Central gardens between the plots',
        alt: 'Aerial view of the central gazebo garden between plot rows',
        category: 'aerial',
      },
      {
        image: 'g-aerial-boulevard',
        title: 'A green spine through the colony',
        alt: 'Aerial view of the landscaped boulevard between plot rows',
        category: 'aerial',
      },
      {
        image: 'g-aerial-garden',
        title: 'The garden walk between plot rows',
        alt: 'Aerial view of the garden walk and gazebo between plot rows',
        category: 'aerial',
      },
      {
        image: 'g-aerial-rows',
        title: 'Plot rows along the green spine',
        alt: 'Aerial view of plot rows on both sides of the landscaped boulevard',
        category: 'aerial',
      },
      {
        image: 'g-aerial',
        title: 'The colony, set in greenery',
        alt: 'Wide aerial view of the Sharda Greens layout surrounded by trees',
        category: 'aerial',
      },
    ],
    // Plot sizes as marked on the client's Sharda Greens site plan (Nov 2026 renders).
    plots: [
      { size: "25' × 80'", area: '2,000' },
      { size: "25' × 50'", area: '1,250' },
      { size: "25' × 45'", area: '1,125' },
      { size: "20' × 50'", area: '1,000' },
      { size: "20' × 40'", area: '800' },
      { size: "16' × 40'", area: '640' },
      { size: "15' × 41'", area: '615' },
      { size: "15' × 40'", area: '600' },
      { size: "15' × 26'", area: '390' },
    ],
    plotsNote:
      "The plan also marks shop-cum-residential plots (20' × 50') on the proposed 60' road.",
    // TODO: client to supply Sharda Greens prices.
    pricing: null,
    sitePlan: 'g-site-plan',
    landmarks: null,
    // 3D video from the brochure QR code. Location from the brochure address
    // (opposite Betma Sahib Gurudwara). TODO: client to send the exact Google Maps pin.
    videoUrl: 'https://www.youtube-nocookie.com/embed/vCRlcCm1Lqk?autoplay=1&rel=0',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Sharda+Greens+Betma+Sahib+Gurudwara+Betma+Indore',
    mapEmbed:
      'https://maps.google.com/maps?q=Sharda%20Greens%2C%20Betma%20Sahib%20Gurudwara%2C%20Betma%2C%20Indore&t=k&z=16&output=embed',
    heroLine: 'near Pithampur Sector 7',
    seo: {
      title: 'Sharda Greens, Betma Indore · RERA P-IND-23-4395',
      description:
        'Garden-centric residential colony in Betma, near the Indore–Ahmedabad National Highway and Pithampur Sector 7. Book a free site visit.',
      og: '/og-greens.jpg',
    },
  },
};

export const projectList = [projects.paradise, projects.greens];
