import type { Tone } from '@/types/content';

interface ToneClasses {
  /** Section background and text colour. */
  section: string;
  /** Primary button on this background. */
  button: string;
  /** Secondary text (eyebrows, captions). */
  muted: string;
  /** Inline link colour. */
  link: string;
}

/** Maps each section tone to design-token classes, so contrast is decided in one place. */
export const TONES: Readonly<Record<Tone, ToneClasses>> = {
  cream: {
    section: 'bg-cream text-forest',
    button: 'bg-moss text-cream hover:bg-forest',
    muted: 'text-moss',
    link: 'text-moss underline decoration-1 underline-offset-4 hover:text-forest',
  },
  mint: {
    section: 'bg-mint text-forest',
    button: 'bg-moss text-cream hover:bg-forest',
    muted: 'text-moss',
    link: 'text-forest underline decoration-1 underline-offset-4',
  },
  sage: {
    section: 'bg-sage text-forest',
    button: 'bg-moss text-cream hover:bg-forest',
    muted: 'text-forest',
    link: 'text-forest underline decoration-1 underline-offset-4',
  },
  moss: {
    section: 'bg-moss text-cream',
    button: 'bg-cream text-forest hover:bg-mint',
    muted: 'text-mint',
    link: 'text-cream underline decoration-1 underline-offset-4',
  },
  forest: {
    section: 'bg-forest text-cream',
    button: 'bg-cream text-forest hover:bg-mint',
    muted: 'text-mint',
    link: 'text-cream underline decoration-1 underline-offset-4',
  },
};
