import type { MetadataRoute } from 'next';

import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml', origin),
    host: origin,
  };
}
