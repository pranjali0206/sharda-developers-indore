import { config } from '../config';
import { site } from '../content/site';
import { Seo } from '../components/seo/Seo';
import { Eyebrow } from '../components/ui/primitives';

// TODO: legal review — this policy is a plain-language draft and must be reviewed
// by the client's legal adviser (incl. India's DPDP Act, 2023) before launch.
export function PrivacyPage() {
  const h2 = 'mt-10 text-2xl font-extrabold';
  return (
    <article className="section-pad" aria-labelledby="privacy-title">
      <Seo
        title="Privacy policy · Sharda Developers"
        description="How Sharda Developers collects and uses the details you share when you book a site visit or contact us."
        path="/privacy-policy"
      />
      <div className="container-content max-w-[760px] text-[17px] leading-relaxed [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        <Eyebrow>Sharda Developers · Indore</Eyebrow>
        <h1 id="privacy-title" className="mt-4 text-h2 font-extrabold">
          Privacy policy
        </h1>
        <p className="text-ink-500">Last updated: November 2026</p>

        <h2 className={h2}>What we collect</h2>
        <p>When you book a site visit or contact us through this website, we collect:</p>
        <ul>
          <li>your name and mobile number;</li>
          <li>
            which project you are interested in, and your preferred visit date (if you give one);
          </li>
          <li>
            how you reached us — the campaign source of the link you clicked (for example UTM tags,
            Google or Meta click IDs), the page you landed on and the referring website.
          </li>
        </ul>
        <p>
          If analytics are enabled, Google Analytics and the Meta Pixel may also record how you use
          the site (pages viewed, buttons tapped) using cookies or similar technology.
        </p>

        <h2 className={h2}>Why we collect it</h2>
        <p>
          We use your details only to arrange your site visit, to call, SMS or WhatsApp you about
          your enquiry, and to understand which of our advertisements are useful so we can improve
          them.
        </p>

        <h2 className={h2}>How long we keep it</h2>
        <p>
          We keep enquiry details for as long as needed to respond to you and follow up on your
          enquiry, and then delete them.{' '}
          {/* TODO: client to confirm the retention period, e.g. 24 months. */}
        </p>

        <h2 className={h2}>Who we share it with</h2>
        <p>
          We do not sell or share your details with anyone, except the service provider that stores
          our enquiries (our CRM / spreadsheet provider), which processes them only on our behalf.
        </p>

        <h2 className={h2}>Your choices and requesting deletion</h2>
        <p>
          You can ask us at any time to see, correct or delete your details, or to stop contacting
          you. Email{' '}
          <a
            href={`mailto:${config.email}`}
            className="font-semibold text-navy-700 underline underline-offset-2"
          >
            {config.email}
          </a>{' '}
          or call{' '}
          <a
            href={config.phone.href}
            className="font-semibold text-navy-700 underline underline-offset-2"
          >
            {config.phone.display}
          </a>
          .
        </p>

        <h2 className={h2}>Contact</h2>
        <p>
          {site.company.name}, {site.company.city}, {site.company.region}.
        </p>
      </div>
    </article>
  );
}
