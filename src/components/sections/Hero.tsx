import { Container } from '@/components/ui/Container';
import { ContentImage } from '@/components/ui/ContentImage';
import { Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';

import type { SectionProps } from './types';

/** Opening band: large heading beside an introduction, optionally followed by a wide photo. */
export function Hero({ section, headingLevel, headingId, isFirst }: SectionProps<'hero'>) {
  return (
    <Section tone={section.tone} anchor={section.anchor} labelledBy={headingId} spacing="none">
      <Container className="grid gap-8 py-16 sm:py-24 md:grid-cols-2 md:items-center md:gap-16">
        <Heading level={headingLevel} size="h1" id={headingId}>
          {section.heading}
        </Heading>
        {section.body ? (
          <div className="max-w-md md:border-b md:border-current md:pb-8">
            <Markdown source={section.body} tone={section.tone} />
          </div>
        ) : null}
      </Container>
      {section.image ? (
        <ContentImage
          image={section.image}
          sizes="100vw"
          frame="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
          priority={isFirst}
        />
      ) : null}
    </Section>
  );
}
