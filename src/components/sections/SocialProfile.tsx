import { SocialIcon } from '@/components/layout/SocialIcon';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ContentImage } from '@/components/ui/ContentImage';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { SmartLink } from '@/components/ui/SmartLink';
import { TONES } from '@/lib/design/tones';

import { PostFeed } from './PostFeed';
import type { SectionProps } from './types';

/** True for links to an Instagram profile, which get the Instagram glyph like on the old site. */
function isInstagram(href: string): boolean {
  return /^https?:\/\/(www\.)?instagram\.com\//i.test(href);
}

/**
 * A social account or podcast laid out like an Instagram profile: picture, account name,
 * description, website link, follow buttons and an optional grid of posts. Replaces the
 * third-party Instagram feed widgets of the old site (no tracking scripts).
 */
export function SocialProfile({
  section,
  headingLevel,
  headingId,
  context,
}: SectionProps<'socialProfile'>) {
  const { tone, posts } = section;
  const { ui } = context.site;

  // Only a heading and links (the home "Follow us on Instagram" band): centred, links as text.
  const compact =
    !section.name &&
    !section.description &&
    !section.image &&
    !section.website &&
    posts.length === 0;
  if (compact) {
    return (
      <Section tone={tone} anchor={section.anchor} labelledBy={headingId}>
        <Container className="flex flex-col items-center gap-2 text-center">
          <Heading level={headingLevel} id={headingId}>
            {section.heading}
          </Heading>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <SmartLink
                  href={link.href}
                  className="font-display text-h3 underline-offset-4 hover:underline"
                >
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone={tone} anchor={section.anchor} labelledBy={headingId}>
      <Container className="flex flex-col gap-8">
        <Heading level={headingLevel} id={headingId}>
          {section.heading}
        </Heading>
        <div
          className={`flex flex-col gap-10 border-t border-current/40 pt-8 ${posts.length > 0 ? 'border-b pb-12' : ''}`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {section.image ? (
              <ContentImage
                image={section.image}
                sizes="64px"
                frame="size-16 shrink-0"
                fit="contain"
                className="bg-white"
              />
            ) : null}
            <div className="flex flex-1 flex-col gap-3">
              {section.name ? <p className="font-display text-h3">{section.name}</p> : null}
              {section.description ? (
                <p className="max-w-prose whitespace-pre-line">{section.description}</p>
              ) : null}
              {section.website ? (
                <SmartLink
                  href={section.website.href}
                  className={`max-w-prose break-all ${TONES[tone].link}`}
                >
                  {section.website.label}
                </SmartLink>
              ) : null}
            </div>
            <ul className="flex flex-wrap gap-4">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Button
                    link={link}
                    tone={tone}
                    icon={isInstagram(link.href) ? <SocialIcon platform="instagram" /> : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>
          {posts.length > 0 ? (
            <PostFeed
              posts={posts}
              visible={section.visiblePosts}
              loadMoreLabel={section.loadMoreLabel}
              account={{ name: section.name, image: section.image }}
              labels={{
                close: ui.galleryClose,
                previous: ui.galleryPrevious,
                next: ui.galleryNext,
                viewPost: ui.postLink,
              }}
              buttonClass={TONES[tone].button}
            />
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
