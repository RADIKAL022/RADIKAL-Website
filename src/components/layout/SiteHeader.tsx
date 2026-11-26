import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import type { Site } from '@/types/content';

import { MainMenu } from './MainMenu';

/** Top bar: Menu button (left), logo (centre), primary call to action (right), as on the old site. */
export function SiteHeader({ site }: { site: Site }) {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/95 text-forest backdrop-blur">
      <div className="mx-auto grid max-w-content grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <div className="justify-self-start">
          <MainMenu
            items={site.menu}
            labels={{
              open: site.header.menuLabel,
              close: site.header.closeMenuLabel,
              nav: site.ui.mainNavLabel,
            }}
          />
        </div>
        <Link href="/" className="block">
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={78}
            height={64}
            preload
            className="h-14 w-auto object-contain"
          />
        </Link>
        <div className="justify-self-end">
          <Button link={site.header.button} tone="cream" className="min-h-11 px-5 py-2" />
        </div>
      </div>
    </header>
  );
}
