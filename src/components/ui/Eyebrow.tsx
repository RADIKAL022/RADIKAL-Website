import type { ReactNode } from 'react';

/** Small label shown above a heading. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-eyebrow font-normal uppercase ${className}`}>{children}</p>;
}
