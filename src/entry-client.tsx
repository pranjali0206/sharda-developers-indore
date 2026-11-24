import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './styles/index.css';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import { captureAttribution } from './lib/attribution';

captureAttribution();
initAnalytics();
window.__sdReady = true;

// Continuous effects (ripple, marquee, particles, neon borders, waves…) start once the
// entrance sequence has finished AND the visitor engages (move, scroll, touch, key).
// Until then every section shows its finished, static state. Keeps load fast and saves battery.
function scheduleLoops() {
  const root = document.documentElement;
  const events = ['pointermove', 'pointerdown', 'scroll', 'touchstart', 'keydown'] as const;
  let done = false;
  const start = () => {
    if (done) return;
    done = true;
    events.forEach((e) => window.removeEventListener(e, onInteract));
    const wait = Math.max(0, 2800 - performance.now());
    setTimeout(() => root.classList.add('loops-on'), wait);
  };
  const onInteract = () => start();
  events.forEach((e) => window.addEventListener(e, onInteract, { passive: true, once: true }));
}
scheduleLoops();

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Pre-rendered pages hydrate; `npm run dev` (no pre-render) mounts fresh.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
