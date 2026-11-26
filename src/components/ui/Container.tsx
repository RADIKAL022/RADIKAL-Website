import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Centres content at the site's maximum width with the standard side gutters. */
export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
