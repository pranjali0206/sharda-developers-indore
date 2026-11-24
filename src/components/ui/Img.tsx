import type { CSSProperties } from 'react';
import { images, type ImageName } from '../../generated/images';

interface ImgProps {
  name: ImageName;
  alt: string;
  /** The `sizes` attribute, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold image: eager + high fetch priority. */
  priority?: boolean;
  draggable?: boolean;
  onLoad?: () => void;
}

const OPT = '/assets/optimized';

/**
 * Responsive <picture> (AVIF → WebP → original). Widths come from the generated
 * manifest, so dropping a higher-resolution original into public/assets and
 * re-running `npm run images` upgrades every usage without code changes.
 */
export function Img({ name, alt, sizes, className, style, priority, draggable, onLoad }: ImgProps) {
  const img = images[name];
  const set = (fmt: string) => img.widths.map((w) => `${OPT}/${name}-${w}.${fmt} ${w}w`).join(', ');
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={img.src}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // React 18 warns on camelCase fetchPriority; the lowercase attribute is passed through.
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        className={className}
        style={style}
        draggable={draggable}
        onLoad={onLoad}
      />
    </picture>
  );
}
