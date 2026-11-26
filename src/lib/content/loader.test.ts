import { existsSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import type { Section } from '@/types/content';

import { getPage, getPageSlugs, getSite, HOME_SLUG, pathForSlug } from './loader';

/** Every image or video path referenced by a section. */
function mediaPaths(section: Section): string[] {
  const paths: string[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (value && typeof value === 'object') {
      for (const [key, inner] of Object.entries(value)) {
        if ((key === 'src' || key === 'captions') && typeof inner === 'string') paths.push(inner);
        else visit(inner);
      }
    }
  };
  visit(section);
  return paths;
}

describe('content loader (real content files)', () => {
  const slugs = getPageSlugs();

  it('finds the home page and every page from the old site', () => {
    expect(slugs).toEqual(
      [
        'accessibility-statement',
        'faq',
        'fund-our-initiatives',
        'get-involved',
        'home',
        'hurricane-melissa-relief',
        'invest-in-saradi',
        'our-impact',
        'our-initiatives',
        'our-solutions',
        'our-story',
        'our-values',
        'privacy-policy',
        'refund-policy',
        'terms-and-conditions',
      ].sort(),
    );
  });

  it('validates site.json', () => {
    expect(getSite().name).toBe('RADIKAL');
  });

  it.each(slugs)('validates content/pages/%s.json and its media exist', (slug) => {
    const page = getPage(slug);
    for (const file of page.sections.flatMap(mediaPaths)) {
      expect(existsSync(path.join(process.cwd(), 'public', file)), `${slug}: ${file}`).toBe(true);
    }
  });

  it('gives every page a unique SEO title and description', () => {
    const pages = slugs.map((slug) => getPage(slug));
    expect(new Set(pages.map((page) => page.seo.title)).size).toBe(pages.length);
    expect(new Set(pages.map((page) => page.seo.description)).size).toBe(pages.length);
  });

  it('only links menu, footer and page buttons to pages that exist', () => {
    const site = getSite();
    const internal = new Set(slugs.map(pathForSlug));
    const hrefs = [
      site.header.button.href,
      ...site.menu.flatMap((item) => [item.href, ...item.children.map((child) => child.href)]),
      ...site.footer.legalLinks.map((link) => link.href),
      ...slugs.flatMap((slug) =>
        getPage(slug).sections.flatMap((section) => {
          const found: string[] = [];
          JSON.stringify(section, (key, value: unknown) => {
            if ((key === 'href' || key === 'button') && typeof value === 'string')
              found.push(value);
            return value;
          });
          return found;
        }),
      ),
    ].filter((href): href is string => typeof href === 'string' && href.startsWith('/'));
    for (const href of hrefs) {
      expect(internal.has(href.split('#')[0] ?? href), href).toBe(true);
    }
  });

  it('rejects slugs that could escape the content folder', () => {
    expect(() => getPage('../site')).toThrow(/Invalid page slug/);
  });

  it('maps the home slug to /', () => {
    expect(pathForSlug(HOME_SLUG)).toBe('/');
    expect(pathForSlug('our-story')).toBe('/our-story');
  });
});
