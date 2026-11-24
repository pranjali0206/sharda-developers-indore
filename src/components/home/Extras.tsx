import { useId, useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { config } from '../../config';
import { lines, site } from '../../content/site';
import { ButtonLink, WhatsAppLink } from '../ui/Button';
import { HindiLine, Punch } from '../ui/primitives';
import { cx } from '../../lib/cx';

/** Renders only when real buyer testimonials exist in content. Never ship placeholders. */
export function Testimonials() {
  const items = site.testimonials;
  if (!items.length) return null;
  return (
    <section aria-labelledby="testimonials-title" className="section-pad">
      <div className="container-content">
        <h2 id="testimonials-title" className="text-center text-h2 font-extrabold">
          In their words
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <li
              key={t.name}
              data-reveal
              className="rounded-card bg-white p-7 shadow-card ring-1 ring-line"
            >
              <blockquote className="text-[17px] leading-relaxed text-navy-900">
                “{t.quote}”
              </blockquote>
              <p className="mt-5 font-display font-bold text-navy-900">{t.name}</p>
              <p className="text-sm text-ink-500">{t.project}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Accessible FAQ accordion. Hidden until `site.faq.enabled` and approved answers exist. */
export function Faq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  const items = site.faq.items.filter((i): i is { q: string; answer: string } => Boolean(i.answer));
  if (!site.faq.enabled || !items.length) return null;
  return (
    <section aria-labelledby={`${uid}-faq`} className="section-pad">
      <div className="container-content max-w-[820px]">
        <h2 id={`${uid}-faq`} className="text-center text-h2 font-extrabold">
          {site.faq.title}
        </h2>
        <div className="mt-10 divide-y divide-line rounded-card bg-white shadow-soft ring-1 ring-line">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    id={`${uid}-q${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[60px] w-full items-center justify-between gap-4 px-6 py-4 text-left font-display text-[17px] font-bold text-navy-900"
                  >
                    {item.q}
                    <ChevronDown
                      aria-hidden
                      className={cx(
                        'h-5 w-5 shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180',
                      )}
                      strokeWidth={1.75}
                    />
                  </button>
                </h3>
                <div
                  id={`${uid}-a${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q${i}`}
                  hidden={!isOpen}
                  className="px-6 pb-5 text-[16px] leading-relaxed"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Closing call-to-action band used on project pages. */
export function CtaBand({ bookHref = '#visit' }: { bookHref?: string }) {
  return (
    <section aria-labelledby="cta-title" className="pb-section-sm pt-4 md:pb-section">
      <div className="container-content">
        <div
          data-reveal
          className="relative overflow-hidden rounded-card bg-white px-6 py-10 shadow-card ring-1 ring-line sm:px-12 md:flex md:items-center md:justify-between md:gap-10"
        >
          <div
            aria-hidden
            className="blob-gold pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full"
          />
          <div className="relative">
            <h2 id="cta-title" className="text-[clamp(26px,3vw,36px)] font-extrabold leading-tight">
              {site.cta.title}
            </h2>
            <Punch className="mt-2 text-xl text-gold-ink">{lines.weekend.en}</Punch>
            <HindiLine k="weekend" className="mt-1 text-lg text-navy-700" />
          </div>
          <div className="relative mt-7 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <ButtonLink href={config.phone.href} track="cta-band">
              <Phone aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {site.cta.call}
            </ButtonLink>
            <WhatsAppLink text="Hi, I would like to book a site visit.">
              {site.cta.whatsapp}
            </WhatsAppLink>
            <ButtonLink href={bookHref} variant="outline">
              {site.cta.book}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
