import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { childLevel, Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';
import { TONES } from '@/lib/design/tones';

import type { SectionProps } from './types';

/** Questions and answers. Uses native <details> so it works without JavaScript. */
export function Faq({ section, headingLevel, headingId }: SectionProps<'faq'>) {
  const { tone } = section;
  const questionLevel = childLevel(headingLevel);
  return (
    <Section tone={tone} anchor={section.anchor} labelledBy={headingId}>
      <Container className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <Heading level={headingLevel} size="h1" id={headingId}>
            {section.heading}
          </Heading>
          {section.intro ? <Markdown source={section.intro} tone={tone} /> : null}
          {section.subheading ? (
            <Eyebrow className={TONES[tone].muted}>{section.subheading}</Eyebrow>
          ) : null}
        </div>
        <div className="divide-y divide-current/30 border-y border-current/30">
          {section.items.map((item) => (
            <details key={item.question} className="group py-6" open>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <Heading level={questionLevel} size="h3">
                  {item.question}
                </Heading>
                <span
                  aria-hidden="true"
                  className="mt-1 text-h3 leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <Markdown source={item.answer} tone={tone} headingBase={4} className="pt-4" />
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
