'use client';

import Image from 'next/image';

import type { ImageData } from '@/types/content';

import { LightboxDialog, type LightboxLabels, useLightbox } from './Lightbox';

interface GalleryLightboxProps {
  images: ImageData[];
  labels: LightboxLabels;
  /** Load the first row with high priority (the gallery opens the page). */
  eager: boolean;
}

/** Thumbnail grid that opens a full-size viewer. */
export function GalleryLightbox({ images, labels, eager }: GalleryLightboxProps) {
  const lightbox = useLightbox(images.length);
  const active = lightbox.current === null ? undefined : images[lightbox.current];

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => {
                lightbox.open(index);
              }}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                preload={eager && index < 2}
                fetchPriority={eager && index < 2 ? 'high' : undefined}
                className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <LightboxDialog lightbox={lightbox} count={images.length} label={active?.alt} labels={labels}>
        {active ? (
          <Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-contain" />
        ) : null}
      </LightboxDialog>
    </>
  );
}
