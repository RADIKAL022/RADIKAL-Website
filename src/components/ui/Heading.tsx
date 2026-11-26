import type { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3;

interface HeadingProps {
  level: HeadingLevel;
  /** Visual size, independent of the semantic level. Defaults to the level's size. */
  size?: 'h1' | 'h2' | 'h3' | 'statement';
  id?: string | undefined;
  children: ReactNode;
  className?: string;
}

const SIZES = {
  statement: 'text-statement uppercase',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
} as const;

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

/** Renders the semantic heading for `level` with a design-system size. */
export function Heading({ level, size, id, children, className = '' }: HeadingProps) {
  const Tag = TAGS[level];
  const visual = size ?? TAGS[level];
  return (
    <Tag id={id} className={`${SIZES[visual]} ${className}`}>
      {children}
    </Tag>
  );
}

/** The level for headings nested one step below `level` (never deeper than h3). */
export function childLevel(level: HeadingLevel): HeadingLevel {
  return level === 1 ? 2 : 3;
}
