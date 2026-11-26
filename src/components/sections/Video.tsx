import { getImageProps } from 'next/image';

import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';

import type { SectionProps } from './types';

/** Heading and text beside a self-hosted video (no autoplay; plays only when asked). */
export function Video({ section, headingLevel, headingId }: SectionProps<'video'>) {
  const { video, tone } = section;
  // Serve the poster through the image optimiser (AVIF/WebP, resized) instead of the original file.
  const poster = getImageProps({
    src: video.poster.src,
    alt: video.poster.alt,
    width: 320,
    height: 320,
  }).props.src;
  return (
    <Section
      tone={tone}
      anchor={section.anchor}
      labelledBy={section.heading ? headingId : undefined}
    >
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-6">
          {section.heading ? (
            <Heading level={headingLevel} id={headingId}>
              {section.heading}
            </Heading>
          ) : null}
          {section.body ? <Markdown source={section.body} tone={tone} /> : null}
        </div>
        {/* Captions are optional content (a .vtt file set in the CMS), so the static rule cannot see them. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          controls
          playsInline
          preload="none"
          poster={poster}
          aria-label={video.label}
          className="aspect-square w-full rounded-card bg-forest object-cover"
        >
          <source src={video.src} type={video.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          {video.captions ? (
            <track kind="captions" src={video.captions} srcLang="en" label="English" default />
          ) : null}
        </video>
      </Container>
    </Section>
  );
}
