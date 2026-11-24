import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { config } from '../../config';
import { lines, site } from '../../content/site';
import { projectList } from '../../content/projects';
import { Img } from '../ui/Img';

export function Footer() {
  const f = site.footer;
  const headCls = 'text-eyebrow font-semibold uppercase text-gold-400';
  const linkCls = 'text-white/80 transition-colors hover:text-white';
  return (
    <footer
      id="contact"
      className="bg-navy-950 text-white/80 [&_:focus-visible]:outline-white"
      data-section="footer"
    >
      <div className="container-content grid gap-12 pb-10 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link
            to="/"
            className="inline-block rounded-2xl bg-white px-5 py-3"
            aria-label="Sharda Developers — home"
          >
            <Img
              name="sharda-developers-logo"
              alt="Sharda Developers"
              sizes="140px"
              className="h-14 w-auto"
            />
          </Link>
          <p className="punch mt-6 text-2xl text-white">{lines.brandLine.en}</p>
          <p lang="hi" className="mt-1 font-hindi text-lg font-medium text-white/70">
            {lines.trust.hi}
          </p>
        </div>

        <div>
          <h2 className={headCls}>{f.projects}</h2>
          <ul className="mt-5 space-y-4">
            {projectList.map((p) => (
              <li key={p.slug}>
                <Link
                  to={p.path}
                  className={`${linkCls} font-display text-base font-bold text-white`}
                >
                  {p.name}
                </Link>
                <p className="text-sm text-white/65">
                  {p.location} · {site.status[p.status]}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={headCls}>{f.contact}</h2>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li>
              <a
                href={config.phone.href}
                className={`${linkCls} inline-flex min-h-[44px] items-center gap-2`}
                data-track="footer"
              >
                <Phone aria-hidden className="h-4 w-4 text-gold-400" strokeWidth={1.75} />
                {config.phone.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${config.email}`}
                className={`${linkCls} inline-flex min-h-[44px] items-center gap-2 break-all`}
              >
                <Mail aria-hidden className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={1.75} />
                {config.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin aria-hidden className="h-4 w-4 text-gold-400" strokeWidth={1.75} />
              {/* TODO: client to supply the office address. */}
              {site.company.address ?? `${site.company.city}, ${site.company.region}`}
            </li>
          </ul>
        </div>

        <div>
          <h2 className={headCls}>{f.rera}</h2>
          <ul className="mt-5 space-y-4 text-[15px]">
            {projectList.map((p) => (
              <li key={p.slug}>
                <span className="block text-white">{p.name}</span>
                <span className="text-sm text-white/65">RERA No. {p.rera}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-content border-t border-white/10 py-8">
        <p className="max-w-[90ch] text-xs leading-relaxed text-white/60">
          <span className="font-semibold text-white/75">{f.disclaimerTitle}: </span>
          {f.disclaimer} Images shown are artist&rsquo;s impressions.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.company.name},{' '}
            {site.company.city}. {f.rights}
          </p>
          <span className="flex items-center gap-5">
            <Link
              to="/about-us"
              className="inline-flex min-h-[44px] items-center text-white/75 underline-offset-4 hover:text-white hover:underline"
            >
              {f.about}
            </Link>
            <Link
              to="/privacy-policy"
              className="inline-flex min-h-[44px] items-center text-white/75 underline-offset-4 hover:text-white hover:underline"
            >
              {f.privacy}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
