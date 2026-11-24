import { Mail, Phone } from 'lucide-react';
import { config } from '../../config';
import { lines, site } from '../../content/site';
import type { ProjectChoice } from '../../lib/lead';
import tokens from '../../design/tokens.json';
import { FxScope, WavyBackground } from '../fx/Effects';
import { HindiLine, Punch, SectionHeading } from '../ui/primitives';
import { SiteVisitForm } from './SiteVisitForm';

/** "Home, the way it should be." — navy section with the site-visit form over animated waves. */
export function VisitSection({
  defaultProject = 'both',
  eyebrow = site.home.visit.eyebrow,
}: {
  defaultProject?: ProjectChoice;
  eyebrow?: string;
}) {
  const c = site.home.visit;
  const t = tokens.colors;
  return (
    <FxScope>
      <section
        id="visit"
        aria-labelledby="visit-title"
        data-section="visit"
        className="relative overflow-hidden bg-navy-900 pb-[180px] pt-section-sm text-white/80 md:pb-[220px] md:pt-section [&_:focus-visible]:outline-white"
      >
        <div
          aria-hidden
          className="blob-navy pointer-events-none absolute -right-40 -top-40 h-[720px] w-[720px] rounded-full opacity-90 mix-blend-screen"
        />
        <WavyBackground
          className="bottom-0 h-[160px] md:h-[200px]"
          colors={[t['royal-600'], t['royal-800'], t['navy-950']]}
        />
        <div className="container-content relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div data-reveal>
            <div id="visit-title">
              <SectionHeading eyebrow={eyebrow} a={c.h2a} b={c.h2b} accent="text-gold-400" dark />
            </div>
            <HindiLine k="withYou" className="mt-3 text-white/80" />
            <p className="mt-5 max-w-prose text-[17px] leading-relaxed text-white/80">{c.body}</p>
            <Punch className="mt-5 text-xl text-white">{lines.withYou.en}</Punch>
            <p className="mt-2 text-sm text-white/70">{lines.weekend.en}</p>

            <div className="mt-9 space-y-4">
              <a
                href={config.phone.href}
                className="group flex items-center gap-4 rounded-2xl p-1 pr-4 transition hover:bg-white/5"
                data-track="visit"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-900 shadow-soft">
                  <Phone aria-hidden className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-sm text-white/70">{c.phoneLabel}</span>
                  <span className="block font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {config.phone.display}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-4 rounded-2xl p-1 pr-4 transition hover:bg-white/5"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/10 text-gold-400 ring-1 ring-white/15">
                  <Mail aria-hidden className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-white/70">{c.emailLabel}</span>
                  <span className="block break-all text-[17px] font-semibold text-white">
                    {config.email}
                  </span>
                </span>
              </a>
            </div>
            <p className="punch mt-7 text-lg text-white/85">{lines.callAway.en}</p>
          </div>

          <div data-reveal style={{ transitionDelay: '0.12s' }}>
            <SiteVisitForm defaultProject={defaultProject} />
          </div>
        </div>
      </section>
    </FxScope>
  );
}
