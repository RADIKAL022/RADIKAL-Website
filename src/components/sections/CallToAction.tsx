import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ContentImage } from '@/components/ui/ContentImage';
import { Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';

import type { SectionProps } from './types';

/**
 * A prompt to act, with an optional photo above.
 * - `banner` centres a heading, text and button.
 * - `statement`: a wide photo, the heading as one very large line under it (like the old home
 *   page), then the text and the button on a row under a thin rule, all in the site's column.
 */
export function CallToAction(props: SectionProps<'callToAction'>) {
  return props.section.style === 'statement' ? <Statement {...props} /> : <Banner {...props} />;
}

function Banner({ section, headingLevel, headingId }: SectionProps<'callToAction'>) {
  return (
    <Section tone={section.tone} anchor={section.anchor} labelledBy={headingId} spacing="large">
      <Container className="flex flex-col items-center gap-6 text-center">
        {section.image ? (
          <ContentImage
            image={section.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            frame="aspect-[4/3] w-full md:w-1/2"
            className="rounded-card"
          />
        ) : null}
        <Heading level={headingLevel} size="h2" id={headingId}>
          {section.heading}
        </Heading>
        {section.body ? (
          <Markdown source={section.body} tone={section.tone} className="max-w-prose" />
        ) : null}
        <Button link={section.button} tone={section.tone} context={section.heading} />
      </Container>
    </Section>
  );
}

function Statement({ section, headingLevel, headingId, isFirst }: SectionProps<'callToAction'>) {
  return (
    <Section tone={section.tone} anchor={section.anchor} labelledBy={headingId} spacing="large">
      <Container className="flex flex-col gap-8 sm:gap-10">
        {section.image ? (
          <ContentImage
            image={section.image}
            sizes="(min-width: 1200px) 1200px, 100vw"
            frame="aspect-[4/3] w-full sm:aspect-[16/9]"
            className="rounded-card"
            priority={isFirst}
          />
        ) : null}
        <Heading level={headingLevel} size="statement" id={headingId} className="text-center">
          {section.heading}
        </Heading>
        <div className="flex flex-col gap-6 border-t border-current/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
          {section.body ? (
            <Markdown
              source={section.body}
              tone={section.tone}
              className="max-w-prose font-display text-lead"
            />
          ) : null}
          <Button link={section.button} tone={section.tone} context={section.heading} />
        </div>
      </Container>
    </Section>
  );
}
