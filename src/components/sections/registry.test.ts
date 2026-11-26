import { describe, expect, it } from 'vitest';

import { sectionSchema } from '@/lib/content/schemas';

import { SECTION_REGISTRY } from './registry';

const schemaTypes = sectionSchema.options.map((option) => option.shape.type.value).sort();

describe('section registry', () => {
  it('has exactly one component per section type in the schema', () => {
    expect(Object.keys(SECTION_REGISTRY).sort()).toEqual(schemaTypes);
    for (const component of Object.values(SECTION_REGISTRY)) {
      expect(typeof component).toBe('function');
    }
  });
});
