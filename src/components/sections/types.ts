import type { ReactNode } from 'react';

import type { HeadingLevel } from '@/components/ui/Heading';
import type { SectionOf, SectionType, Site } from '@/types/content';

/** Page-level data a section may need besides its own content. */
export interface SectionContext {
  site: Site;
  /** Absolute URL of the current page (for share links). */
  pageUrl: string;
}

/** Props every section component receives from the SectionRenderer. */
export interface SectionProps<T extends SectionType> {
  section: SectionOf<T>;
  /** 1 for the first section on the page (its heading is the page's h1), otherwise 2. */
  headingLevel: HeadingLevel;
  /** Unique id for the section heading, used for `aria-labelledby`. */
  headingId: string;
  /** True for the first section, whose image should load with high priority. */
  isFirst: boolean;
  context: SectionContext;
}

export type SectionComponent<T extends SectionType> = (props: SectionProps<T>) => ReactNode;
