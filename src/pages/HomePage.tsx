import { Seo } from '../components/seo/Seo';
import { HeroShowcase } from '../components/hero/HeroShowcase';
import { AboutBand } from '../components/home/AboutBand';
import { ProjectsShowcase } from '../components/home/ProjectsShowcase';
import { AmenityArc } from '../components/home/AmenityArc';
import { FilmReel } from '../components/home/FilmReel';
import { LocationSection } from '../components/home/LocationSection';
import { Faq, Testimonials } from '../components/home/Extras';
import { VisitSection } from '../components/form/VisitSection';
import { Deferred } from '../components/layout/Deferred';

/**
 * Home: hero (split: headline + project panels) → about (blue band) → projects (neon cards)
 * → life (sparkles, amenity arc) → films (reel wall) → location (retro grid) → visit (waves).
 */
export function HomePage() {
  return (
    <>
      <Seo
        title="Sharda Developers, Indore · RERA-approved residential colonies"
        description="Sharda Paradise (Navdapanth) and Sharda Greens (Betma): RERA-registered colonies on the Indore–Ahmedabad Highway. Book a free site visit."
        path="/"
        image="/og-home.jpg"
      />
      <HeroShowcase />
      <Deferred>
        <AboutBand />
      </Deferred>
      <Deferred>
        <ProjectsShowcase />
      </Deferred>
      <Deferred>
        <AmenityArc />
      </Deferred>
      <Deferred>
        <FilmReel />
      </Deferred>
      <Deferred>
        <LocationSection />
      </Deferred>
      <Deferred>
        <Testimonials />
        <Faq />
      </Deferred>
      <Deferred>
        <VisitSection />
      </Deferred>
    </>
  );
}
