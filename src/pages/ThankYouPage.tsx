import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { config } from '../config';
import { lines, site } from '../content/site';
import { projectList } from '../content/projects';
import { consumePendingLead } from '../lib/lead';
import { track } from '../lib/analytics';
import { Seo } from '../components/seo/Seo';
import { ButtonLink, WhatsAppLink } from '../components/ui/Button';
import { Img } from '../components/ui/Img';
import { HindiLine, Punch, ReraChip } from '../components/ui/primitives';

function CheckMark() {
  const reduce = useReducedMotion();
  const anim = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { delay, duration: 0.7 },
        };
  return (
    <m.svg
      aria-hidden
      viewBox="0 0 120 120"
      className="h-28 w-28"
      initial={reduce ? false : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <circle cx="60" cy="60" r="56" className="fill-green-100" />
      <m.circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        className="stroke-green-700"
        strokeWidth="4"
        {...anim(0.1)}
      />
      <m.path
        d="M38 62 L54 77 L84 45"
        fill="none"
        className="stroke-green-700"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...anim(0.6)}
      />
    </m.svg>
  );
}

export function ThankYouPage() {
  const [project, setProject] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('project');
    setProject(q);
    // Fire conversion events once per submission (a refresh does not re-fire).
    const lead = consumePendingLead();
    if (lead)
      track('generate_lead', {
        project: lead.project,
        lead_id: lead.id,
        currency: 'INR',
        value: 0,
      });
  }, []);

  const label =
    project === 'paradise'
      ? 'Sharda Paradise'
      : project === 'greens'
        ? 'Sharda Greens'
        : 'your site visit';

  return (
    <section className="section-pad relative overflow-hidden" aria-labelledby="ty-title">
      <Seo
        title="Thank you · Sharda Developers"
        description="Thank you for booking a site visit with Sharda Developers, Indore. We'll call you soon."
        path="/thank-you"
        noindex
      />
      <div
        aria-hidden
        className="blob-mint pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full"
      />
      <div
        aria-hidden
        className="blob-gold pointer-events-none absolute -left-48 bottom-0 h-[520px] w-[520px] rounded-full"
      />
      <div className="container-content relative flex max-w-[760px] flex-col items-center text-center">
        <CheckMark />
        <h1 id="ty-title" className="mt-8 text-h1 font-extrabold">
          {site.thankYou.h1}
        </h1>
        <Punch className="mt-5 text-punch text-green-700">{lines.thanks.en}</Punch>
        <HindiLine k="thanks" className="mt-2 text-navy-700" />
        <p className="mt-6 text-[17px]">
          We&rsquo;ve received your request for <strong className="text-navy-900">{label}</strong>.
          Our team will call you to confirm a convenient time.
        </p>

        <div className="mt-10 w-full rounded-card bg-white p-6 shadow-card ring-1 ring-line sm:p-8">
          <p className="text-[15px] font-medium text-ink-600">
            {site.thankYou.cantWait}{' '}
            <span className="font-semibold text-navy-900">{config.phone.display}</span>
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <ButtonLink href={config.phone.href} track="thank-you">
              <Phone aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
              Call now
            </ButtonLink>
            <WhatsAppLink text="Hi, I just booked a site visit on your website.">
              WhatsApp us
            </WhatsAppLink>
          </div>
        </div>

        <p className="eyebrow mt-14">{site.thankYou.explore}</p>
        <ul className="mt-5 grid w-full gap-4 sm:grid-cols-2">
          {projectList.map((p) => (
            <li key={p.slug}>
              <Link
                to={p.path}
                className="group flex h-full flex-col items-start gap-3 rounded-[18px] bg-white p-5 text-left shadow-soft ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <Img
                  name={p.logo}
                  alt={p.name}
                  sizes="200px"
                  className={p.slug === 'paradise' ? 'h-12 w-auto' : 'h-9 w-auto'}
                />
                <ReraChip rera={p.rera} />
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                  View project
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
