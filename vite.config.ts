import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Preloads the hero heading font (Plus Jakarta Sans 800), the punchline italic
 * (Playfair Display 600 italic, also in project H1s — avoids a swap layout shift) and the body
 * font (Inter 400, latin) so the H1 paints in its real face without a swap jump.
 */
function preloadFonts(): Plugin {
  const wanted = [
    'plus-jakarta-sans-latin-800-normal',
    'inter-latin-400-normal',
    'playfair-display-latin-600-italic',
  ];
  return {
    name: 'sharda:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return [];
        return Object.keys(ctx.bundle)
          .filter((f) => f.endsWith('.woff2') && wanted.some((w) => f.includes(w)))
          .map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
            injectTo: 'head-prepend' as const,
          }));
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadFonts()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 0,
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  },
});
