import { site } from '../content/site';
import { projectList } from '../content/projects';
import { Seo } from '../components/seo/Seo';
import { ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/primitives';

export function NotFoundPage() {
  return (
    <section className="section-pad relative overflow-hidden" aria-labelledby="nf-title">
      <Seo
        title="Page not found · Sharda Developers"
        description={site.notFound.body}
        path="/404"
        noindex
      />
      <div
        aria-hidden
        className="plot-grid pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
      />
      <div className="container-content relative flex max-w-[680px] flex-col items-center py-10 text-center">
        <Eyebrow>Error 404</Eyebrow>
        <h1 id="nf-title" className="mt-4 text-h2 font-extrabold">
          {site.notFound.h1}
        </h1>
        <p className="mt-4 text-[17px]">{site.notFound.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/">{site.notFound.home}</ButtonLink>
          {projectList.map((p) => (
            <ButtonLink key={p.slug} to={p.path} variant="outline">
              {p.name}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
