import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { App } from './App';
import { ROUTES } from './routes';

export { ROUTES };
export { images } from './generated/images';

/** Renders one route to static HTML for scripts/prerender.mjs. */
export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState | null } = {};
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );
  const h = helmetContext.helmet;
  const head = h
    ? [h.title, h.priority, h.meta, h.link, h.script].map((x) => x.toString()).join('\n')
    : '';
  const htmlAttrs = h ? h.htmlAttributes.toString() : '';
  return { html, head, htmlAttrs };
}
