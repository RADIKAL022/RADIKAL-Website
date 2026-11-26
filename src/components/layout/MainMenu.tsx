'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { SmartLink } from '@/components/ui/SmartLink';
import { DIALOG_MOTION, staggerDelay } from '@/lib/design/motion';
import type { MenuItem } from '@/types/content';

interface MainMenuProps {
  items: MenuItem[];
  labels: { open: string; close: string; nav: string };
}

const linkClass =
  'inline-block py-1 font-display text-h3 hover:underline aria-[current=page]:underline';

/**
 * Full-screen site menu (the old site used a "Menu" button on every screen size).
 * Built on the native <dialog>: focus moves into the menu, is trapped while open, Escape closes
 * it, and focus returns to the Menu button afterwards. The panel fades and slides in and out,
 * and the links rise one after another.
 */
export function MainMenu({ items, labels }: MainMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Close after client-side navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const ariaCurrent = (href: string | undefined) => (href === pathname ? 'page' : undefined);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-controls="site-menu"
        onClick={() => dialogRef.current?.showModal()}
        className="flex min-h-11 items-center gap-3 px-1 text-base"
      >
        <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
        {labels.open}
      </button>

      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-label={labels.nav}
        className={`m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-forest p-0 text-cream backdrop:bg-forest/60 ${DIALOG_MOTION} motion-safe:-translate-y-4 motion-safe:open:translate-y-0 motion-safe:starting:open:-translate-y-4`}
      >
        <div className="mx-auto flex max-w-content flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="flex min-h-11 items-center gap-3 px-1 text-base"
            >
              <span aria-hidden="true" className="text-h3 leading-none">
                ×
              </span>
              {labels.close}
            </button>
          </div>
          <nav aria-label={labels.nav}>
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <li
                  key={item.label}
                  className="flex animate-rise flex-col gap-3"
                  style={staggerDelay(index + 1)}
                >
                  {item.href ? (
                    <MenuLink
                      href={item.href}
                      current={ariaCurrent(item.href)}
                      className={linkClass}
                    >
                      {item.label}
                    </MenuLink>
                  ) : (
                    <span className="text-eyebrow text-mint uppercase">{item.label}</span>
                  )}
                  {item.children.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <MenuLink
                            href={child.href}
                            current={ariaCurrent(child.href)}
                            className={linkClass}
                          >
                            {child.label}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}

interface MenuLinkProps {
  href: string;
  current: 'page' | undefined;
  className: string;
  children: string;
}

/** Internal menu links mark the current page; external ones open in a new tab. */
function MenuLink({ href, current, className, children }: MenuLinkProps) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} aria-current={current} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <SmartLink href={href} className={className}>
      {children}
    </SmartLink>
  );
}
