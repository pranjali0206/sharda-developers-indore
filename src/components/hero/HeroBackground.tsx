import { site } from '../../content/site';
import { images } from '../../generated/images';

const OPT = '/assets/optimized';
const srcset = (name: keyof typeof images, fmt: 'avif' | 'webp') =>
  images[name].widths.map((w) => `${OPT}/${name}-${w}.${fmt} ${w}w`).join(', ');

function Birds() {
  return (
    <>
      {/* desktop */}
      <svg
        viewBox="0 0 140 50"
        fill="none"
        className="absolute right-[120px] top-[110px] hidden h-[50px] w-[140px] opacity-50 lg:block"
      >
        <path
          d="M10 30 q8 -9 16 0 q8 -9 16 0"
          className="stroke-birds"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M60 14 q6 -7 12 0 q6 -7 12 0"
          className="stroke-birds"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M100 36 q5 -6 10 0 q5 -6 10 0"
          className="stroke-birds"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {/* mobile / tablet */}
      <svg
        viewBox="0 0 90 40"
        fill="none"
        className="absolute right-2 top-[150px] h-8 w-[72px] opacity-50 lg:hidden"
      >
        <path
          d="M6 26 q6 -7 12 0 q6 -7 12 0"
          className="stroke-birds"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M44 12 q5 -6 10 0 q5 -6 10 0"
          className="stroke-birds"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M66 30 q4 -5 8 0 q4 -5 8 0"
          className="stroke-birds"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

function Wave() {
  return (
    <>
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 hidden h-[190px] w-full lg:block"
      >
        <defs>
          <linearGradient id="hero-wave-d" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2F7D45" stopOpacity="0.55" />
            <stop offset="1" stopColor="#1D5E33" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path d="M0 150 C 360 60, 760 210, 1440 70 L1440 220 L0 220 Z" fill="url(#hero-wave-d)" />
        <path
          d="M0 120 C 420 40, 820 170, 1440 40"
          fill="none"
          stroke="rgba(255,255,255,.7)"
          strokeWidth="2"
        />
      </svg>
      <svg
        viewBox="0 0 390 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[68px] h-[110px] w-full md:bottom-0 lg:hidden"
      >
        <defs>
          <linearGradient id="hero-wave-m" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2F7D45" stopOpacity="0.45" />
            <stop offset="1" stopColor="#1D5E33" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M0 90 C 120 40, 230 110, 390 30 L390 120 L0 120 Z" fill="url(#hero-wave-m)" />
        <path
          d="M0 72 C 130 24, 240 92, 390 14"
          fill="none"
          stroke="rgba(255,255,255,.75)"
          strokeWidth="1.6"
        />
      </svg>
    </>
  );
}

/**
 * Hero backdrop, bottom to top: real photo (blurred) → white wash → sun glow → birds →
 * green wave. One <picture> with art direction (desktop / phone crops), so only one
 * photo downloads.
 */
export function HeroBackground() {
  const { image } = site.home.hero.photo;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Skyline: blur is baked into the file; motion is transform-only (slow pan + zoom). */}
      <div className="hero-sky-in absolute inset-0">
        <div className="hero-pan absolute inset-[-6%]">
          <picture>
            <source type="image/avif" srcSet={srcset(image, 'avif')} sizes="115vw" />
            <source type="image/webp" srcSet={srcset(image, 'webp')} sizes="115vw" />
            <img
              src={images[image].src}
              alt=""
              width={images[image].width}
              height={images[image].height}
              loading="eager"
              decoding="async"
              {...{ fetchpriority: 'high' }}
              className="h-full w-full object-cover object-[50%_62%] lg:object-[center_58%]"
            />
          </picture>
        </div>
      </div>
      <div className="hero-wash absolute inset-0" />
      <div className="hero-sun absolute right-[-120px] top-[-100px] h-[380px] w-[380px] rounded-full lg:right-[-160px] lg:top-[-160px] lg:h-[640px] lg:w-[640px]" />
      <Birds />
      <Wave />
    </div>
  );
}
