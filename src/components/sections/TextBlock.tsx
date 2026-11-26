import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ContentImage } from '@/components/ui/ContentImage';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';
import { TONES } from '@/lib/design/tones';

import type { SectionProps } from './types';

/**
 * Heading, copy and an optional button, with an optional photo beside (left/right),
 * above (top) or below (bottom) the text.
 */
export function TextBlock({
  section,
  headingLevel,
  headingId,
  isFirst,
}: SectionProps<'textBlock'>) {
  const { image, imagePosition, tone } = section;
  const beside = image && (imagePosition === 'left' || imagePosition === 'right');
  const centered = section.align === 'center' && !beside;

  const text = (
    <div className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : ''}`}>
      {section.eyebrow ? <Eyebrow className={TONES[tone].muted}>{section.eyebrow}</Eyebrow> : null}
      {section.heading ? (
        <Heading level={headingLevel} id={headingId}>
          {section.heading}
        </Heading>
      ) : null}
      {section.subheading ? <p className="text-lead">{section.subheading}</p> : null}
      {section.body ? <Markdown source={section.body} tone={tone} className="max-w-prose" /> : null}
      {section.button ? (
        <Button
          link={section.button}
          tone={tone}
          context={section.heading}
          className={centered ? '' : 'self-start'}
        />
      ) : null}
    </div>
  );

  const media = image ? (
    <ContentImage
      image={image}
      priority={isFirst}
      fit={section.imageFit}
      sizes={beside ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1200px) 1200px, 100vw'}
      frame={beside ? 'aspect-[4/5] md:aspect-auto md:h-full md:min-h-[28rem]' : 'aspect-[16/9]'}
      className="rounded-card"
    />
  ) : null;

  return (
    <Section
      tone={tone}
      anchor={section.anchor}
      labelledBy={section.heading ? headingId : undefined}
    >
      <Container
        className={
          beside
            ? 'grid items-center gap-10 md:grid-cols-2 md:gap-16'
            : `flex flex-col gap-10 ${centered ? 'items-center' : ''}`
        }
      >
        {imagePosition === 'left' || imagePosition === 'top' ? (
          <>
            {media}
            {text}
          </>
        ) : (
          <>
            {text}
            {media}
          </>
        )}
      </Container>
    </Section>
  );
}
