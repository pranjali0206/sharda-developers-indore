import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { site } from '../../content/site';
import { projectList } from '../../content/projects';
import { images } from '../../generated/images';

const OPT = '/assets/optimized';
const bg = images['about-blue'];
const set = (fmt: string) => bg.widths.map((w) => `${OPT}/about-blue-${w}.${fmt} ${w}w`).join(', ');

/** About us — compact band on the client's deep-blue backdrop, bold ivory type. */
export function AboutBand() {
  const a = site.home.about;
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      data-section="about"
      className="relative isolate overflow-hidden bg-royal-900 py-14 md:py-16 [&_:focus-visible]:outline-ivory"
    >
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes="100vw" />
        <source type="image/webp" srcSet={set('webp')} sizes="100vw" />
        <img
          src={bg.src}
          alt=""
          width={bg.width}
          height={bg.height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </picture>

      <div
        data-reveal
        className="container-content grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
      >
        <div>
          <p className="eyebrow text-gold-400">{a.eyebrow}</p>
          <h2
            id="about-title"
            className="mt-3 font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ivory"
          >
            {a.h2a} <span className="block text-gold-400">{a.h2b}</span>
          </h2>
        </div>
        <div>
          <p className="text-[17px] font-semibold leading-relaxed text-ivory/90">{a.body}</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-bold uppercase tracking-[0.14em] text-gold-400">
            {a.values.map((v) => (
              <li key={v} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
                {v}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {projectList.map((p) => (
              <Link
                key={p.slug}
                to={p.path}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory/40 px-5 text-sm font-bold text-ivory transition hover:border-ivory hover:bg-ivory hover:text-royal-900"
              >
                {p.name}
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            ))}
            <Link
              to="/about-us"
              className="inline-flex min-h-[44px] items-center gap-2 px-2 text-sm font-semibold text-ivory/85 underline-offset-4 hover:text-ivory hover:underline"
            >
              {a.more}
              <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
