import type { Section, SectionType } from '@/types/content';

import { SECTION_REGISTRY } from './registry';
import type { SectionComponent, SectionContext } from './types';

interface SectionRendererProps {
  sections: readonly Section[];
  context: SectionContext;
}

/**
 * Renders a page's ordered list of sections. The first section's heading becomes the page's
 * single h1; all others start at h2.
 */
export function SectionRenderer({ sections, context }: SectionRendererProps) {
  return sections.map((section, index) => {
    const Component = getSectionComponent(section.type);
    return (
      <Component
        key={`${section.type}-${index}`}
        section={section}
        headingLevel={index === 0 ? 1 : 2}
        headingId={`section-${index}-heading`}
        isFirst={index === 0}
        context={context}
      />
    );
  });
}

/**
 * Looks up a section component. TypeScript cannot correlate `section.type` with the union
 * member inside `.map`, so the lookup is widened once here; the registry itself stays exhaustive
 * and each component is only ever called with its own section type.
 */
function getSectionComponent(type: SectionType): SectionComponent<SectionType> {
  return SECTION_REGISTRY[type] as SectionComponent<SectionType>;
}
