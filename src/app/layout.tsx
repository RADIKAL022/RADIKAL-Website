import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSite } from '@/lib/content/loader';
import { fraunces, nunitoSans } from '@/lib/fonts';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: site.seo.defaultTitle, template: site.seo.titleTemplate },
    description: site.seo.defaultDescription,
    applicationName: site.name,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#fffaf1', // matches --color-cream; metadata cannot read CSS variables
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const site = getSite();
  const origin = getSiteUrl();
  return (
    <html lang="en" className={`${fraunces.variable} ${nunitoSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink label={site.ui.skipLink} />
        <SiteHeader site={site} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter site={site} />
        <JsonLd data={[organizationJsonLd(site, origin), websiteJsonLd(site, origin)]} />
      </body>
    </html>
  );
}
