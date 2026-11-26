import Image from 'next/image';

import type { ImageData } from '@/types/content';

interface ContentImageProps {
  image: ImageData;
  /** Responsive `sizes` hint so the browser downloads the right width. */
  sizes: string;
  /** Classes that give the frame its size, usually an aspect ratio such as `aspect-[4/3]`. */
  frame: string;
  fit?: 'cover' | 'contain';
  priority?: boolean;
  className?: string;
}

/**
 * Wrapper around next/image for CMS images. Editors never enter pixel sizes: each layout reserves
 * a fixed frame (so there is no layout shift) and the image fills it.
 */
export function ContentImage({
  image,
  sizes,
  frame,
  fit = 'cover',
  priority = false,
  className = '',
}: ContentImageProps) {
  return (
    <div className={`relative overflow-hidden ${frame} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? 'high' : undefined}
        className={fit === 'cover' ? 'object-cover' : 'object-contain'}
      />
    </div>
  );
}
