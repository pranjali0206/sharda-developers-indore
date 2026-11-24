import { useEffect } from 'react';
import type { ProjectSlug } from '../config';
import { projects } from '../content/projects';
import { track } from '../lib/analytics';
import { Seo } from '../components/seo/Seo';
import { VisitSection } from '../components/form/VisitSection';
import { CtaBand } from '../components/home/Extras';
import {
  AmenitiesSection,
  GallerySection,
  LandmarksSection,
  PlotsSection,
  ProjectHero,
  VideoSection,
  WhySection,
} from '../components/project/ProjectSections';
import { PROJECT_TONE } from '../components/project/tone';
import { Deferred } from '../components/layout/Deferred';

export function ProjectPage({ slug }: { slug: ProjectSlug }) {
  const project = projects[slug];

  useEffect(() => {
    track('view_project', { project: slug, content_name: project.name });
  }, [slug, project.name]);

  const residenceLd = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: project.name,
    description: project.heroBody,
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.location,
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    additionalProperty: { '@type': 'PropertyValue', name: 'RERA No.', value: project.rera },
  };

  return (
    <div className={PROJECT_TONE[slug].bg}>
      <Seo
        title={project.seo.title}
        description={project.seo.description}
        path={project.path}
        image={project.seo.og}
        jsonLd={[residenceLd]}
      />
      <ProjectHero project={project} />
      <Deferred>
        <GallerySection project={project} />
      </Deferred>
      <Deferred>
        <AmenitiesSection project={project} />
        <WhySection project={project} />
      </Deferred>
      <Deferred>
        <PlotsSection project={project} />
      </Deferred>
      <Deferred>
        <LandmarksSection project={project} />
        <VideoSection project={project} />
      </Deferred>
      <Deferred>
        <VisitSection defaultProject={slug} eyebrow={`Book a visit · ${project.name}`} />
        <div className="pt-section-sm md:pt-section">
          <CtaBand />
        </div>
      </Deferred>
    </div>
  );
}
