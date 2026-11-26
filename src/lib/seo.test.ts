import { describe, expect, it } from 'vitest';

import { getPage, getSite } from './content/loader';
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from './seo';
import { absoluteUrl, normaliseOrigin, resolveSiteUrl } from './site-url';

const origin = 'https://radikal.co';
const site = getSite();

describe('buildPageMetadata', () => {
  const page = getPage('our-story');
  const metadata = buildPageMetadata({ site, page, pathname: '/our-story', origin });

  it('uses the title template and the page description', () => {
    expect(metadata.title).toEqual({ absolute: 'Our Story | RADIKAL' });
    expect(metadata.description).toBe(page.seo.description);
  });

  it('sets canonical and hreflang alternates', () => {
    expect(metadata.alternates?.canonical).toBe('https://radikal.co/our-story');
    expect(metadata.alternates?.languages).toEqual({
      en: 'https://radikal.co/our-story',
      'x-default': 'https://radikal.co/our-story',
    });
  });

  it('falls back to the default share image for Open Graph and Twitter', () => {
    expect(metadata.openGraph?.images).toEqual([
      { url: 'https://radikal.co/images/radikal-share.png', alt: site.seo.shareImage.alt },
    ]);
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('marks noindex pages', () => {
    const legal = buildPageMetadata({
      site,
      page: getPage('privacy-policy'),
      pathname: '/privacy-policy',
      origin,
    });
    expect(legal.robots).toEqual({ index: false, follow: true });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});

describe('JSON-LD', () => {
  it('describes the organisation with contact details and social profiles', () => {
    const org = organizationJsonLd(site, origin);
    expect(org).toMatchObject({
      '@type': 'Organization',
      name: 'RADIKAL',
      url: 'https://radikal.co/',
      logo: 'https://radikal.co/images/radikal-logo.png',
      email: 'info@radikal.co',
    });
    expect(org.sameAs).toContain('https://www.instagram.com/radikal.coop');
  });

  it('links the website to the organisation', () => {
    expect(websiteJsonLd(site, origin).publisher).toEqual({ '@id': `${origin}/#organization` });
  });

  it('numbers breadcrumb items from 1', () => {
    const crumbs = breadcrumbJsonLd(
      [
        { name: 'Home', pathname: '/' },
        { name: 'FAQ', pathname: '/faq' },
      ],
      origin,
    );
    expect(crumbs.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(crumbs.itemListElement[1]?.item).toBe('https://radikal.co/faq');
  });

  it('escapes < so content cannot close the script tag', () => {
    expect(serializeJsonLd({ text: '</script><script>alert(1)</script>' })).not.toContain('<');
  });
});

describe('site URL helpers', () => {
  it('normalises origins and rejects other protocols', () => {
    expect(normaliseOrigin(' https://radikal.co/ ')).toBe('https://radikal.co');
    expect(normaliseOrigin(undefined)).toBe('http://localhost:3000');
    expect(() => normaliseOrigin('ftp://radikal.co')).toThrow(/http\(s\)/);
  });

  it('prefers NEXT_PUBLIC_SITE_URL, then the Vercel production domain', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://radikal.co' })).toBe(origin);
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'radikal.vercel.app' })).toBe(
      'https://radikal.vercel.app',
    );
    expect(resolveSiteUrl({})).toBe('http://localhost:3000');
  });

  it('builds absolute URLs', () => {
    expect(absoluteUrl('/faq', origin)).toBe('https://radikal.co/faq');
  });
});
