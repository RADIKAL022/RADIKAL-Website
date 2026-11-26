import type { ReactNode } from 'react';

import { TONES } from '@/lib/design/tones';
import type { LinkData, Tone } from '@/types/content';

import { SmartLink } from './SmartLink';

interface ButtonProps {
  link: LinkData;
  /** Background the button sits on; picks a contrasting style. */
  tone: Tone;
  /**
   * Extra context for screen readers and search engines when the label alone is vague
   * ("Learn More"), usually the section heading. Visually hidden.
   */
  context?: string | undefined;
  /** Decorative icon before the label (hidden from screen readers by the icon itself). */
  icon?: ReactNode;
  className?: string;
}

/** A call-to-action link styled as a button. */
export function Button({ link, tone, context, icon, className = '' }: ButtonProps) {
  return (
    <SmartLink
      href={link.href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-8 py-3 text-base font-normal tracking-wide transition-colors duration-200 ${TONES[tone].button} ${className}`}
    >
      {icon}
      {link.label}
      {context ? <span className="sr-only">: {context}</span> : null}
    </SmartLink>
  );
}
