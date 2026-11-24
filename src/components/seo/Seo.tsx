import { Helmet } from 'react-helmet-async';
import { config } from '../../config';
import { site } from '../../content/site';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const abs = (p: string) => (config.siteUrl ? `${config.siteUrl}${p}` : p);

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.company.name,
  telephone: `+${config.phone.digits}`,
  email: config.email,
  foundingDate: String(site.company.founded),
  logo: abs('/assets/sharda-developers-logo.png'),
  ...(config.siteUrl ? { url: config.siteUrl } : {}),
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.company.city,
    addressRegion: site.company.region,
    addressCountry: 'IN',
  },
};

export function Seo({
  title,
  description,
  path,
  image = '/og-home.jpg',
  noindex,
  jsonLd = [],
}: SeoProps) {
  const url = abs(path);
  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {config.siteUrl && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.company.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {config.siteUrl && <meta property="og:url" content={url} />}
      <meta property="og:image" content={abs(image)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={abs(image)} />
      {[organizationLd, ...jsonLd].map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}
