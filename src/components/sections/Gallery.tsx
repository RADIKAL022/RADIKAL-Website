import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';

import { GalleryLightbox } from './GalleryLightbox';
import type { SectionProps } from './types';

/** A grid of photos; selecting one opens it full size. */
export function Gallery({
  section,
  headingLevel,
  headingId,
  isFirst,
  context,
}: SectionProps<'gallery'>) {
  const { ui } = context.site;
  return (
    <Section
      tone={section.tone}
      anchor={section.anchor}
      labelledBy={section.heading ? headingId : undefined}
    >
      <Container className="flex flex-col gap-10">
        {section.heading ? (
          <Heading level={headingLevel} id={headingId}>
            {section.heading}
          </Heading>
        ) : null}
        <GalleryLightbox
          images={section.images}
          eager={isFirst}
          labels={{ close: ui.galleryClose, previous: ui.galleryPrevious, next: ui.galleryNext }}
        />
      </Container>
    </Section>
  );
}
