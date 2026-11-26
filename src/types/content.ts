import type { z } from 'zod';

import type {
  featureItemSchema,
  imageSchema,
  linkSchema,
  menuItemSchema,
  pageSchema,
  sectionSchema,
  siteSchema,
  socialLinkSchema,
  socialPostSchema,
  toneSchema,
} from '@/lib/content/schemas';

/** Types inferred from the zod schemas (the single source of truth). */
export type ImageData = z.infer<typeof imageSchema>;
export type LinkData = z.infer<typeof linkSchema>;
export type Tone = z.infer<typeof toneSchema>;
export type FeatureItem = z.infer<typeof featureItemSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SocialPost = z.infer<typeof socialPostSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section['type'];
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;
export type Page = z.infer<typeof pageSchema>;
export type Site = z.infer<typeof siteSchema>;
