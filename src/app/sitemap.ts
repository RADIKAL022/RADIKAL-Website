import type { MetadataRoute } from 'next';

import { getPage, getPageSlugs, pathForSlug } from '@/lib/content/loader';
import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

/** Every indexable content page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  return getPageSlugs()
    .filter((slug) => !getPage(slug).seo.noindex)
    .map((slug) => {
      const pathname = pathForSlug(slug);
      return {
        url: absoluteUrl(pathname, origin),
        changeFrequency: 'monthly' as const,
        priority: pathname === '/' ? 1 : 0.7,
        alternates: { languages: { en: absoluteUrl(pathname, origin) } },
      };
    });
}
