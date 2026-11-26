import type { CSSProperties } from 'react';
import { images } from '../../generated/images';

const OPT = '/assets/optimized';

/**
 * Drifting mesh-gradient blobs (phones/tablets). Three large blurred colour fields —
 * navy, blue, green — slowly float on alternate loops behind the hero content; the
 * white text-wash above keeps the headline crisp. Paused off-screen via the hero's
 * data-paused (set by usePauseWhenHidden) through the [class*='fx-'] rule.
 */
const BLOBS: CSSProperties[] = [
  {
    left: '-18%',
    top: '-8%',
    width: '72%',
    height: '52%',
    background: 'radial-gradient(circle at center, #16295e, transparent 70%)',
    '--dur': '15s',
    '--mx': '9%',
    '--my': '7%',
  } as CSSProperties,
  {
    right: '-20%',
    top: '2%',
    width: '70%',
    height: '50%',
    background: 'radial-gradient(circle at center, #2d5fc4, transparent 70%)',
    '--dur': '18s',
    '--d': '-5s',
    '--mx': '-10%',
    '--my': '9%',
  } as CSSProperties,
  {
    left: '10%',
    bottom: '-14%',
    width: '82%',
    height: '54%',
    background: 'radial-gradient(circle at center, #1f9a52, transparent 72%)',
    '--dur': '17s',
    '--d': '-9s',
    '--mx': '8%',
    '--my': '-8%',
  } as CSSProperties,
];
const foliage = images['hero-foliage'];
/**
 * Optional sky photo: drop it in as public/assets/hero-sky.jpg and run `npm run images`.
 * Shown faded and softly blurred over the gradient sky; until then the gradient is used.
 */
type ImgMeta = { src: string; width: number; height: number; widths: readonly number[] };
const sky = (images as unknown as Record<string, ImgMeta | undefined>)['hero-sky'];
const skySet = (fmt: 'avif' | 'webp') =>
  sky ? sky.widths.map((w) => `${OPT}/hero-sky-${w}.${fmt} ${w}w`).join(', ') : '';
const set = (fmt: 'avif' | 'webp') =>
  foliage.widths.map((w) => `${OPT}/hero-foliage-${w}.${fmt} ${w}w`).join(', ');

/**
 * Hero backdrop: open sky (soft blue → near-white), a few very soft clouds, two
 * hairline gold curves across the lower third, and an out-of-focus foliage band
 * along the bottom (blur baked into the image, fading up into the sky).
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="hero-sky absolute inset-0" />

      {/* drifting neon mesh gradient (phones/tablets) */}
      <div className="absolute inset-0 overflow-hidden lg:hidden">
        {BLOBS.map((style, i) => (
          <div key={i} className="fx-hero-blob absolute" style={style} />
        ))}
      </div>

      {sky && (
        <picture>
          <source type="image/avif" srcSet={skySet('avif')} sizes="100vw" />
          <source type="image/webp" srcSet={skySet('webp')} sizes="100vw" />
          <img
            src={sky.src}
            alt=""
            width={sky.width}
            height={sky.height}
            loading="eager"
            decoding="async"
            className="absolute inset-[-24px] h-[calc(100%+48px)] w-[calc(100%+48px)] max-w-none object-cover object-top opacity-45 [filter:blur(6px)] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_92%)]"
          />
        </picture>
      )}

      {/* light wash behind the text column keeps navy/green text crisp over the sky */}
      <div className="hero-text-wash absolute inset-0" />

      {/* soft clouds */}
      <div className="hero-cloud absolute left-[-8%] top-[8%] h-[34%] w-[46%]" />
      <div className="hero-cloud absolute right-[-6%] top-[2%] h-[30%] w-[40%] opacity-80" />
      <div className="hero-cloud absolute left-[30%] top-[30%] h-[22%] w-[36%] opacity-60" />

      {/* hairline gold curves */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[6%] h-[34%] w-full"
        fill="none"
      >
        <path
          d="M-20 210 C 360 120, 760 260, 1460 120"
          className="stroke-gold-400"
          strokeWidth="1"
          strokeOpacity="0.3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-20 250 C 420 170, 900 290, 1460 170"
          className="stroke-gold-400"
          strokeWidth="1"
          strokeOpacity="0.22"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* out-of-focus foliage band */}
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes="100vw" />
        <source type="image/webp" srcSet={set('webp')} sizes="100vw" />
        <img
          src={foliage.src}
          alt=""
          width={foliage.width}
          height={foliage.height}
          loading="eager"
          decoding="async"
          className="absolute inset-x-0 bottom-0 h-[13%] min-h-[80px] w-full object-cover object-bottom"
        />
      </picture>

      {/* phones/tablets: soft green ground wave under the cards */}
      <svg
        viewBox="0 0 390 60"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[52px] w-full lg:hidden"
      >
        <path d="M0 26 C 110 2, 250 4, 390 18 L390 60 L0 60 Z" fill="#fff" fillOpacity="0.7" />
        <path d="M0 38 C 120 16, 260 18, 390 30 L390 60 L0 60 Z" className="fill-green-700" />
      </svg>
    </div>
  );
}
