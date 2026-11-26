import { describe, expect, it } from 'vitest';

import { parseContent } from './parse';
import { hrefSchema, isBlank, pageSchema, sectionSchema, siteSchema } from './schemas';

const minimalPage = {
  title: 'Test',
  seo: { title: 'Test', description: 'A test page.' },
  sections: [{ type: 'textBlock', heading: 'Hello', body: 'World' }],
};

describe('pageSchema', () => {
  it('accepts a minimal page and applies defaults', () => {
    const page = pageSchema.parse(minimalPage);
    expect(page.seo.noindex).toBe(false);
    expect(page.sections[0]).toMatchObject({
      type: 'textBlock',
      tone: 'cream',
      imagePosition: 'right',
      imageFit: 'cover',
      align: 'left',
    });
  });

  it('requires the first section to have a heading (the page h1)', () => {
    const result = pageSchema.safeParse({
      ...minimalPage,
      sections: [{ type: 'textBlock', body: 'No heading' }],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['sections', 0, 'heading']);
  });

  it('rejects unknown section types', () => {
    const result = pageSchema.safeParse({
      ...minimalPage,
      sections: [{ type: 'carousel', heading: 'x' }],
    });
    expect(result.success).toBe(false);
  });

  it('treats blank optional values written by the CMS as unset', () => {
    const section = sectionSchema.parse({
      type: 'textBlock',
      heading: 'Hello',
      eyebrow: '',
      image: { src: '', alt: '' },
      button: { label: '  ', href: '' },
      anchor: '',
    });
    expect(section).not.toHaveProperty('eyebrow', '');
    expect('image' in section && section.image).toBeFalsy();
    expect('button' in section && section.button).toBeFalsy();
  });

  it('still rejects half-filled optional objects', () => {
    const result = sectionSchema.safeParse({
      type: 'textBlock',
      heading: 'Hello',
      image: { src: '/images/a.jpg', alt: '' },
    });
    expect(result.success).toBe(false);
  });

  it('only accepts site files: images from /images, videos from /videos or /images', () => {
    expect(
      sectionSchema.safeParse({
        type: 'hero',
        heading: 'x',
        image: { src: 'https://evil.example/a.jpg', alt: 'a' },
      }).success,
    ).toBe(false);
    const video = (src: string) =>
      sectionSchema.safeParse({
        type: 'video',
        video: { src, poster: { src: '/images/a.jpg', alt: 'a' }, label: 'a' },
      }).success;
    expect(video('https://evil.example/a.mp4')).toBe(false);
    expect(video('/images/a.jpg')).toBe(false);
    // The original lives in /videos; CMS uploads go to the shared media folder, /images.
    expect(video('/videos/a.mp4')).toBe(true);
    expect(video('/images/a.mp4')).toBe(true);
  });

  it('social feed: posts default to none, blank CMS values are unset, "large" defaults off', () => {
    const base = {
      type: 'socialProfile',
      heading: 'Podcast',
      links: [{ label: 'Follow', href: 'https://www.instagram.com/x/' }],
    };
    expect(sectionSchema.parse(base)).toMatchObject({ posts: [] });

    const section = sectionSchema.parse({
      ...base,
      website: { label: '', href: '' },
      visiblePosts: '',
      loadMoreLabel: '',
      posts: [{ image: { src: '/images/a.jpg', alt: 'a' }, caption: '', date: '' }],
    });
    expect(section).toMatchObject({ posts: [{ large: false }] });
    expect('visiblePosts' in section && section.visiblePosts).toBeFalsy();
    expect('website' in section && section.website).toBeFalsy();
    expect(
      sectionSchema.safeParse({ ...base, posts: [{ image: { src: '/images/a.jpg', alt: '' } }] })
        .success,
    ).toBe(false);
  });

  it('enforces maximum lengths', () => {
    const result = pageSchema.safeParse({
      ...minimalPage,
      seo: { title: 'x'.repeat(71), description: 'ok' },
    });
    expect(result.success).toBe(false);
  });
});

describe('hrefSchema', () => {
  it.each([
    '/our-story',
    '/fund-our-initiatives#makaya',
    'https://radikal.co',
    'mailto:info@radikal.co',
    'tel:+18777234525',
    '#top',
  ])('accepts %s', (href) => {
    expect(hrefSchema.safeParse(href).success).toBe(true);
  });

  it.each(['javascript:alert(1)', '//evil.example', 'data:text/html,hi', 'our-story', 'ftp://x'])(
    'rejects %s',
    (href) => {
      expect(hrefSchema.safeParse(href).success).toBe(false);
    },
  );
});

describe('isBlank', () => {
  it('detects empty values and objects of empty values', () => {
    expect(isBlank(undefined)).toBe(true);
    expect(isBlank(null)).toBe(true);
    expect(isBlank('   ')).toBe(true);
    expect(isBlank({ src: '', alt: { nested: '' } })).toBe(true);
    expect(isBlank({ src: 'x', alt: '' })).toBe(false);
    expect(isBlank([])).toBe(false);
    expect(isBlank(0)).toBe(false);
  });
});

describe('parseContent', () => {
  it('names the file and the exact field in its error', () => {
    expect(() => parseContent(siteSchema, { name: '' }, 'content/site.json')).toThrow(
      /Content error in content\/site\.json:\n {2}- name: must not be empty/,
    );
  });

  it('formats array indices in paths', () => {
    expect(() =>
      parseContent(
        pageSchema,
        { ...minimalPage, sections: [{ type: 'faq', heading: 'Q', items: [{ question: '' }] }] },
        'content/pages/faq.json',
      ),
    ).toThrow(/sections\[0\]\.items\[0\]\.question/);
  });
});
