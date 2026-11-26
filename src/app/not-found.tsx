import type { Metadata } from 'next';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { getSite } from '@/lib/content/loader';

export function generateMetadata(): Metadata {
  return { title: getSite().notFound.title, robots: { index: false, follow: true } };
}

/** Custom 404 page; its wording is editable in Site settings. */
export default function NotFound() {
  const { notFound } = getSite();
  return (
    <Section tone="moss" spacing="large" labelledBy="not-found-heading">
      <Container className="flex flex-col items-start gap-6">
        <Heading level={1} id="not-found-heading">
          {notFound.heading}
        </Heading>
        <p className="max-w-prose text-lead">{notFound.body}</p>
        <Button link={notFound.button} tone="moss" />
      </Container>
    </Section>
  );
}
