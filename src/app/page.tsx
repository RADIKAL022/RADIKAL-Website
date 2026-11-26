import type { Metadata } from 'next';

import { ContentPage } from '@/components/page/ContentPage';
import { getPage, getSite, HOME_SLUG } from '@/lib/content/loader';
import { buildPageMetadata } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    site: getSite(),
    page: getPage(HOME_SLUG),
    pathname: '/',
    origin: getSiteUrl(),
  });
}

export default function HomePage() {
  return <ContentPage slug={HOME_SLUG} />;
}
