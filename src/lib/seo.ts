import type { Metadata } from 'next';

import type { Page, Site } from '@/types/content';

import { absoluteUrl } from './site-url';

interface PageMetadataInput {
  site: Site;
  page: Page;
  pathname: string;
  origin: string;
}

/** Builds the Next.js Metadata for a content page (title, description, canonical, OG, Twitter). */
export function buildPageMetadata({ site, page, pathname, origin }: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(pathname, origin);
  const image = page.seo.image ?? site.seo.shareImage;
  const imageUrl = absoluteUrl(image.src, origin);
  const title = site.seo.titleTemplate.replace('%s', page.seo.title);

  return {
    title: { absolute: title },
    description: page.seo.description,
    alternates: {
      canonical,
      languages: { en: canonical, 'x-default': canonical },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: site.name,
      title,
      description: page.seo.description,
      locale: 'en_US',
      images: [{ url: imageUrl, alt: image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.seo.description,
      images: [{ url: imageUrl, alt: image.alt }],
    },
    robots: page.seo.noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/** JSON-LD for the organisation behind the site. */
export function organizationJsonLd(site: Site, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: site.name,
    url: absoluteUrl('/', origin),
    logo: absoluteUrl(site.logo.src, origin),
    description: site.tagline,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: { '@type': 'PostalAddress', addressCountry: site.contact.location },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: site.contact.email,
        telephone: site.contact.phone,
      },
    ],
    sameAs: site.social.map((link) => link.href),
  } as const;
}

/** JSON-LD for the website itself. */
export function websiteJsonLd(site: Site, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: site.name,
    url: absoluteUrl('/', origin),
    inLanguage: 'en',
    publisher: { '@id': `${origin}/#organization` },
  } as const;
}

/** JSON-LD BreadcrumbList for a subpage (Home > Page). */
export function breadcrumbJsonLd(
  items: readonly { name: string; pathname: string }[],
  origin: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname, origin),
    })),
  } as const;
}

/**
 * Serialises JSON-LD for a `<script type="application/ld+json">` tag, escaping `<` so content
 * can never close the script element early.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
