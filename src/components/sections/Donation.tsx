import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Markdown } from '@/components/ui/Markdown';
import { Section } from '@/components/ui/Section';
import { SmartLink } from '@/components/ui/SmartLink';
import { TONES } from '@/lib/design/tones';
import { type SharePlatform, shareUrls } from '@/lib/share';

import type { SectionProps } from './types';

const SHARE_ORDER: readonly SharePlatform[] = ['facebook', 'x', 'whatsapp'];

/**
 * Giving levels with what each amount funds, and a button to give. The original Wix payment
 * form is replaced by a link (set per section in the CMS) because the site has no payment backend.
 */
export function Donation({ section, headingLevel, headingId, context }: SectionProps<'donation'>) {
  const { tone } = section;
  const share = shareUrls(context.pageUrl);
  const labels = context.site.share;

  return (
    <Section tone={tone} anchor={section.anchor} labelledBy={headingId}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Heading level={headingLevel} id={headingId}>
            {section.heading}
          </Heading>
          {section.body ? <Markdown source={section.body} tone={tone} /> : null}
          {section.frequencyLabel && section.frequencies.length > 0 ? (
            <p>
              <span className="font-normal">{section.frequencyLabel}: </span>
              {section.frequencies.join(' · ')}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-8">
          {section.amountLabel ? (
            <p className={`text-eyebrow uppercase ${TONES[tone].muted}`}>{section.amountLabel}</p>
          ) : null}
          <ul className="grid gap-4 sm:grid-cols-2">
            {section.tiers.map((tier) => (
              <li
                key={`${tier.amount}-${tier.description}`}
                className="flex flex-col gap-2 rounded-card border border-current/30 p-5"
              >
                <span className="font-display text-h3">{tier.amount}</span>
                <span>{tier.description}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Button link={section.button} tone={tone} />
            {section.showShareLinks ? (
              <nav aria-label={labels.label}>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {SHARE_ORDER.map((platform) => (
                    <li key={platform}>
                      <SmartLink href={share[platform]} className={TONES[tone].link}>
                        {labels[platform]}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
