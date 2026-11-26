import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** A self-contained content item (feature, initiative, donation tier). */
export function Card({ children, className = '' }: CardProps) {
  return <article className={`flex flex-col ${className}`}>{children}</article>;
}
