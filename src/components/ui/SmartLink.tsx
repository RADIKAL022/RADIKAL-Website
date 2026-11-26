import Link from 'next/link';
import type { ReactNode } from 'react';

interface SmartLinkProps {
  href: string;
  children: ReactNode;
  className?: string | undefined;
  'aria-label'?: string | undefined;
}

/** True for links that leave the site (http(s) URLs). */
function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Internal paths use next/link (client-side navigation and prefetching); external URLs open in
 * a new tab with `rel="noopener noreferrer"`; mailto:/tel: links are plain anchors.
 */
export function SmartLink({ href, children, className, ...rest }: SmartLinkProps) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
