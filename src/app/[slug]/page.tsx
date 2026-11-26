import type { Metadata } from 'next';

import { ContentPage } from '@/components/page/ContentPage';
import { getPage, getPageSlugs, getSite, HOME_SLUG, pathForSlug } from '@/lib/content/loader';
import { buildPageMetadata } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Only slugs with a content file exist; anything else is a static 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPageSlugs()
    .filter((slug) => slug !== HOME_SLUG)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    site: getSite(),
    page: getPage(slug),
    pathname: pathForSlug(slug),
    origin: getSiteUrl(),
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ContentPage slug={slug} />;
}
