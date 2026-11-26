import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { ContentImage } from '@/components/ui/ContentImage';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { childLevel, Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';
import { SmartLink } from '@/components/ui/SmartLink';
import { TONES } from '@/lib/design/tones';

import type { SectionProps } from './types';

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

/**
 * A list of items (values, solutions, programmes, initiatives). `grid` shows cards side by side;
 * `stacked` shows one item per row with the photo alternating left and right.
 */
export function FeatureGrid({ section, headingLevel, headingId }: SectionProps<'featureGrid'>) {
  const { tone } = section;
  const itemLevel = section.heading ? childLevel(headingLevel) : headingLevel;
  const stacked = section.layout === 'stacked';

  return (
    <Section
      tone={tone}
      anchor={section.anchor}
      labelledBy={section.heading ? headingId : undefined}
    >
      <Container className="flex flex-col gap-12">
        {section.eyebrow || section.heading || section.intro ? (
          <header className="flex max-w-prose flex-col gap-6">
            {section.eyebrow ? (
              <Eyebrow className={TONES[tone].muted}>{section.eyebrow}</Eyebrow>
            ) : null}
            {section.heading ? (
              <Heading level={headingLevel} id={headingId}>
                {section.heading}
              </Heading>
            ) : null}
            {section.intro ? <Markdown source={section.intro} tone={tone} /> : null}
          </header>
        ) : null}

        <div
          className={
            stacked ? 'flex flex-col gap-16 sm:gap-24' : `grid gap-10 ${COLUMNS[section.columns]}`
          }
        >
          {section.items.map((item, index) => {
            const reverse = stacked && index % 2 === 1;
            return (
              <Card
                key={`${item.title}-${index}`}
                className={
                  stacked
                    ? `gap-8 md:grid md:grid-cols-2 md:items-center md:gap-16 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`
                    : 'gap-4'
                }
              >
                {item.image ? (
                  <ContentImage
                    image={item.image}
                    sizes={
                      stacked
                        ? '(min-width: 768px) 50vw, 100vw'
                        : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                    }
                    frame="aspect-[4/3]"
                    className="rounded-card"
                  />
                ) : null}
                <div className="flex flex-col gap-3">
                  {item.label ? (
                    <p className={`font-display text-h3 ${TONES[tone].muted}`}>{item.label}</p>
                  ) : null}
                  <Heading level={itemLevel} size={stacked ? 'h2' : 'h3'}>
                    {item.href ? (
                      <SmartLink href={item.href} className={TONES[tone].link}>
                        {item.title}
                      </SmartLink>
                    ) : (
                      item.title
                    )}
                  </Heading>
                  {item.subtitle ? (
                    <p className={`text-eyebrow uppercase ${TONES[tone].muted}`}>{item.subtitle}</p>
                  ) : null}
                  {item.body ? <Markdown source={item.body} tone={tone} headingBase={4} /> : null}
                </div>
              </Card>
            );
          })}
        </div>

        {section.button ? (
          <Button link={section.button} tone={tone} className="self-start" />
        ) : null}
      </Container>
    </Section>
  );
}
