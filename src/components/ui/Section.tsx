import type { ReactNode } from 'react';

import { TONES } from '@/lib/design/tones';
import type { Tone } from '@/types/content';

interface SectionProps {
  children: ReactNode;
  tone: Tone;
  /** Id of the heading that names this section (for assistive technology). */
  labelledBy?: string | undefined;
  anchor?: string | undefined;
  /** Vertical padding; `none` for full-bleed media. */
  spacing?: 'none' | 'regular' | 'large';
  className?: string;
}

const SPACING = {
  none: '',
  regular: 'py-16 sm:py-20',
  large: 'py-20 sm:py-28',
} as const;

/** A full-width page band with a background tone from the design tokens. */
export function Section({
  children,
  tone,
  labelledBy,
  anchor,
  spacing = 'regular',
  className = '',
}: SectionProps) {
  return (
    <section
      id={anchor}
      aria-labelledby={labelledBy}
      className={`${TONES[tone].section} ${SPACING[spacing]} ${className}`}
    >
      {children}
    </section>
  );
}
