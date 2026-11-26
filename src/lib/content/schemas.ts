import { z } from 'zod';

/**
 * Content schemas: the single source of truth for every editable piece of the site.
 * TypeScript types are inferred from these (see `src/types/content.ts`), the build fails
 * with a readable message when a JSON file does not match.
 */

const trimmed = (max: number) =>
  z.string().trim().min(1, 'must not be empty').max(max, `must be at most ${max} characters`);

/** True for values the CMS writes when an optional field is left blank. */
export function isBlank(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value).every((inner) => isBlank(inner));
  }
  return false;
}

/**
 * An optional field. A cleared field written as "" or as an object of empty strings is treated
 * as "not set" instead of failing validation.
 */
function opt<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (isBlank(value) ? undefined : value), schema.optional());
}

/** A link target: an internal path, an http(s) URL, or a mailto:/tel: link. */
export const hrefSchema = z
  .string()
  .trim()
  .regex(
    /^(\/(?!\/)[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\-\s()]+|#[\w-]+)$/,
    'must start with "/", "https://", "http://", "mailto:", "tel:" or "#"',
  );

/** An image stored in `public/images`, with mandatory alternative text. */
export const imageSchema = z.object({
  src: z
    .string()
    .regex(/^\/images\/[\w\-./]+\.(?:jpe?g|png|webp|avif|gif)$/i, 'must be a file in /images/'),
  alt: trimmed(250),
});

export const linkSchema = z.object({
  label: trimmed(80),
  href: hrefSchema,
});

/** Background colour scheme of a section; maps to design tokens in `globals.css`. */
export const toneSchema = z.enum(['cream', 'sage', 'mint', 'moss', 'forest']);

/** Lightweight Markdown (paragraphs, bullet lists, links, bold, italic). */
const markdown = (max: number) =>
  z.string().trim().min(1, 'must not be empty').max(max, `must be at most ${max} characters`);

const sectionBase = {
  /** Optional anchor id so other pages can link to `/page#anchor`. */
  anchor: opt(z.string().regex(/^[a-z0-9-]+$/, 'use lowercase letters, numbers and dashes')),
  tone: toneSchema.default('cream'),
};

export const heroSectionSchema = z.object({
  type: z.literal('hero'),
  ...sectionBase,
  heading: trimmed(120),
  body: opt(markdown(1500)),
  image: opt(imageSchema),
});

export const textBlockSectionSchema = z.object({
  type: z.literal('textBlock'),
  ...sectionBase,
  eyebrow: opt(trimmed(120)),
  heading: opt(trimmed(160)),
  subheading: opt(trimmed(200)),
  body: opt(markdown(8000)),
  image: opt(imageSchema),
  imagePosition: z.enum(['left', 'right', 'top', 'bottom']).default('right'),
  /** `contain` shows the whole image (for diagrams and logos); `cover` crops to fill. */
  imageFit: z.enum(['cover', 'contain']).default('cover'),
  align: z.enum(['left', 'center']).default('left'),
  button: opt(linkSchema),
});

export const featureItemSchema = z.object({
  label: opt(trimmed(40)),
  title: trimmed(160),
  subtitle: opt(trimmed(160)),
  body: opt(markdown(3000)),
  image: opt(imageSchema),
  /** Optional page the item title links to. */
  href: opt(hrefSchema),
});

export const featureGridSectionSchema = z.object({
  type: z.literal('featureGrid'),
  ...sectionBase,
  eyebrow: opt(trimmed(120)),
  heading: opt(trimmed(160)),
  intro: opt(markdown(3000)),
  layout: z.enum(['grid', 'stacked']).default('grid'),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  items: z.array(featureItemSchema).min(1).max(24),
  button: opt(linkSchema),
});

export const callToActionSectionSchema = z.object({
  type: z.literal('callToAction'),
  ...sectionBase,
  heading: trimmed(120),
  body: opt(markdown(800)),
  button: linkSchema,
  style: z.enum(['banner', 'statement']).default('banner'),
  /** Optional photo shown above the heading. */
  image: opt(imageSchema),
});

export const donationTierSchema = z.object({
  amount: trimmed(20),
  description: trimmed(400),
});

export const donationSectionSchema = z.object({
  type: z.literal('donation'),
  ...sectionBase,
  heading: trimmed(120),
  body: opt(markdown(800)),
  frequencyLabel: opt(trimmed(40)),
  frequencies: z.array(trimmed(40)).max(4).default([]),
  amountLabel: opt(trimmed(40)),
  tiers: z.array(donationTierSchema).min(1).max(12),
  button: linkSchema,
  showShareLinks: z.boolean().default(true),
});

export const gallerySectionSchema = z.object({
  type: z.literal('gallery'),
  ...sectionBase,
  heading: opt(trimmed(160)),
  images: z.array(imageSchema).min(1).max(40),
});

export const faqSectionSchema = z.object({
  type: z.literal('faq'),
  ...sectionBase,
  heading: trimmed(120),
  intro: opt(markdown(1500)),
  subheading: opt(trimmed(120)),
  items: z
    .array(z.object({ question: trimmed(200), answer: markdown(3000) }))
    .min(1)
    .max(50),
});

/** One post shown in a social feed (a copy of an Instagram post, without tracking). */
export const socialPostSchema = z.object({
  image: imageSchema,
  /** Post text, shown on hover and in the full-size view. Line breaks are kept. */
  caption: opt(trimmed(2200)),
  /** Shown as written, e.g. "March 5, 2020". */
  date: opt(trimmed(40)),
  /** Takes two columns and two rows of the grid. */
  large: z.boolean().default(false),
  /** The original post (e.g. on Instagram), opened from the full-size view. */
  href: opt(hrefSchema),
});

export const socialProfileSectionSchema = z.object({
  type: z.literal('socialProfile'),
  ...sectionBase,
  heading: trimmed(120),
  name: opt(trimmed(120)),
  description: opt(trimmed(600)),
  image: opt(imageSchema),
  /** Website shown under the description as a plain link (the bio link on Instagram). */
  website: opt(linkSchema),
  links: z.array(linkSchema).min(1).max(6),
  posts: z.array(socialPostSchema).max(60).default([]),
  /** Posts shown before "Load more"; blank shows them all. */
  visiblePosts: opt(z.number().int().min(1).max(60)),
  loadMoreLabel: opt(trimmed(40)),
});

export const videoSectionSchema = z.object({
  type: z.literal('video'),
  ...sectionBase,
  heading: opt(trimmed(160)),
  body: opt(markdown(1500)),
  video: z.object({
    // New uploads land in /images (the CMS media folder); /videos holds the original file.
    src: z
      .string()
      .regex(
        /^\/(?:videos|images)\/[\w\-./]+\.(?:mp4|webm)$/i,
        'must be an .mp4 or .webm file in /videos/ or /images/',
      ),
    poster: imageSchema,
    /** Accessible name of the video, read by screen readers (like alt text). */
    label: trimmed(250),
    /** Optional WebVTT captions file (needed if the video has speech). */
    captions: opt(
      z
        .string()
        .regex(
          /^\/(?:videos|images)\/[\w\-./]+\.vtt$/i,
          'must be a .vtt file in /videos/ or /images/',
        ),
    ),
  }),
});

/** Every section type a page can contain. Add new types here (and in the registry and CMS). */
export const sectionSchema = z.discriminatedUnion('type', [
  heroSectionSchema,
  textBlockSectionSchema,
  featureGridSectionSchema,
  callToActionSectionSchema,
  donationSectionSchema,
  gallerySectionSchema,
  faqSectionSchema,
  socialProfileSectionSchema,
  videoSectionSchema,
]);

export const seoSchema = z.object({
  title: trimmed(70),
  description: trimmed(200),
  image: opt(imageSchema),
  noindex: z.boolean().default(false),
});

export const pageSchema = z
  .object({
    /** Short name used in breadcrumbs. */
    title: trimmed(60),
    seo: seoSchema,
    sections: z.array(sectionSchema).min(1),
  })
  .refine((page) => hasHeading(page.sections[0]), {
    error: 'the first section must have a heading (it becomes the page title, h1)',
    path: ['sections', 0, 'heading'],
  });

function hasHeading(section: z.infer<typeof sectionSchema> | undefined): boolean {
  return section !== undefined && 'heading' in section && Boolean(section.heading);
}

const menuChildSchema = linkSchema;

export const menuItemSchema = z.object({
  label: trimmed(60),
  href: opt(hrefSchema),
  children: z.array(menuChildSchema).max(10).default([]),
});

export const socialLinkSchema = z.object({
  platform: z.enum(['linkedin', 'facebook', 'instagram', 'tiktok', 'youtube', 'x']),
  label: trimmed(40),
  href: z.url({ protocol: /^https$/ }),
});

export const siteSchema = z.object({
  name: trimmed(60),
  tagline: trimmed(200),
  logo: imageSchema,
  header: z.object({
    menuLabel: trimmed(30),
    closeMenuLabel: trimmed(30),
    button: linkSchema,
  }),
  menu: z.array(menuItemSchema).min(1).max(12),
  contact: z.object({
    phone: trimmed(40),
    email: z.email(),
    location: trimmed(120),
  }),
  social: z.array(socialLinkSchema).max(8),
  footer: z.object({
    legalLinks: z.array(linkSchema).max(8),
    copyright: trimmed(200),
  }),
  share: z.object({
    label: trimmed(60),
    facebook: trimmed(40),
    x: trimmed(40),
    whatsapp: trimmed(40),
  }),
  ui: z.object({
    skipLink: trimmed(60),
    mainNavLabel: trimmed(40),
    legalNavLabel: trimmed(40),
    socialNavLabel: trimmed(40),
    galleryClose: trimmed(30),
    galleryPrevious: trimmed(30),
    galleryNext: trimmed(30),
    /** Name of the Instagram icon in a post's full-size view (read by screen readers). */
    postLink: trimmed(60),
    breadcrumbHome: trimmed(30),
  }),
  notFound: z.object({
    title: trimmed(80),
    heading: trimmed(120),
    body: trimmed(400),
    button: linkSchema,
  }),
  seo: z.object({
    titleTemplate: z
      .string()
      .trim()
      .regex(/%s/, 'must contain %s where the page title goes')
      .max(80),
    defaultTitle: trimmed(70),
    defaultDescription: trimmed(200),
    shareImage: imageSchema,
  }),
});
