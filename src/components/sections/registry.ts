import type { SectionType } from '@/types/content';

import { CallToAction } from './CallToAction';
import { Donation } from './Donation';
import { Faq } from './Faq';
import { FeatureGrid } from './FeatureGrid';
import { Gallery } from './Gallery';
import { Hero } from './Hero';
import { SocialProfile } from './SocialProfile';
import { TextBlock } from './TextBlock';
import type { SectionComponent } from './types';
import { Video } from './Video';

/**
 * Maps every section `type` to its component. The mapped type makes this exhaustive: adding a
 * type to `sectionSchema` without registering a component here is a compile error.
 */
export const SECTION_REGISTRY: { readonly [K in SectionType]: SectionComponent<K> } = {
  hero: Hero,
  textBlock: TextBlock,
  featureGrid: FeatureGrid,
  callToAction: CallToAction,
  donation: Donation,
  gallery: Gallery,
  faq: Faq,
  socialProfile: SocialProfile,
  video: Video,
};
