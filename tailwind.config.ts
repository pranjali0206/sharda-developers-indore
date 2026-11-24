import type { Config } from 'tailwindcss';
import tokens from './src/design/tokens.json';

const c = tokens.colors;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Only brand tokens are available — no ad-hoc hex values in components.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: c.white,
      red: { error: c['red-error'] },
      navy: { 950: c['navy-950'], 900: c['navy-900'], 700: c['navy-700'], 100: c['navy-100'] },
      green: { 700: c['green-700'], 100: c['green-100'] },
      royal: { 900: c['royal-900'], 800: c['royal-800'], 600: c['royal-600'], 100: c['royal-100'] },
      leaf: { 600: c['leaf-600'] },
      ivory: c.ivory,
      teal: { 700: c['teal-700'], 650: c['teal-650'], 100: c['teal-100'] },
      gold: { 400: c['gold-400'], 200: c['gold-200'], ink: c['gold-ink'] },
      ink: { 600: c['ink-600'], 500: c['ink-500'] },
      line: { DEFAULT: c.line, input: c['line-input'], soft: c['line-soft'] },
      paradise: { 600: c['paradise-600'], 50: c['paradise-50'] },
      greens: { 600: c['greens-600'], 50: c['greens-50'] },
      whatsapp: c.whatsapp,
      birds: c.birds,
      bg: c.bg,
      cream: c.cream,
      mint: c.mint,
    },
    fontFamily: {
      display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['"Playfair Display"', 'Georgia', 'serif'],
      hindi: ['Mukta', '"Nirmala UI"', 'sans-serif'],
    },
    extend: {
      maxWidth: { content: '1200px', prose: '62ch' },
      borderRadius: { card: '22px', img: '26px', input: '12px' },
      boxShadow: {
        soft: '0 12px 32px rgba(20,38,80,.08)',
        card: '0 24px 60px rgba(20,38,80,.10)',
        lift: '0 32px 70px rgba(20,38,80,.16)',
        deep: '0 40px 90px rgba(20,38,80,.18)',
        ring: '0 0 0 4px rgba(32,56,112,.28)',
        up: '0 -12px 32px rgba(20,38,80,.10)',
      },
      fontSize: {
        h1: ['clamp(42px, 5.2vw, 68px)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        h2: ['clamp(32px, 4vw, 48px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        punch: ['clamp(24px, 2.6vw, 34px)', { lineHeight: '1.25' }],
        hindi: ['clamp(22px, 2vw, 26px)', { lineHeight: '1.4' }],
        eyebrow: ['12px', { lineHeight: '1.4', letterSpacing: '0.22em' }],
      },
      transitionTimingFunction: { brand: 'cubic-bezier(.2,.7,.2,1)' },
      spacing: { section: '88px', 'section-sm': '64px' },
    },
  },
  plugins: [],
} satisfies Config;
