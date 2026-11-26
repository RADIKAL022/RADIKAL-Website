import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/ui/Container';
import { SmartLink } from '@/components/ui/SmartLink';
import type { Site } from '@/types/content';

import { SocialIcon } from './SocialIcon';

const linkClass = 'hover:underline underline-offset-4';

/** Footer: logo, contact details, social profiles, legal pages and copyright. */
export function SiteFooter({ site }: { site: Site }) {
  const { contact } = site;
  const tel = `tel:${contact.phone.replace(/[^\d+]/g, '')}`;
  return (
    <footer className="bg-cream text-forest">
      <Container className="flex flex-col gap-10 border-y border-forest/40 py-12">
        <Link href="/" className="self-start">
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={97}
            height={80}
            className="h-16 w-auto object-contain"
          />
        </Link>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-6">
            <address className="flex flex-col gap-1 not-italic">
              <a href={tel} className={`self-start ${linkClass}`}>
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className={`self-start ${linkClass}`}>
                {contact.email}
              </a>
              <span className="mt-4">{contact.location}</span>
            </address>
            {site.social.length > 0 ? (
              <nav aria-label={site.ui.socialNavLabel}>
                <ul className="flex gap-2">
                  {site.social.map((link) => (
                    <li key={link.href}>
                      <SmartLink
                        href={link.href}
                        aria-label={link.label}
                        className="flex size-11 items-center justify-center rounded-full hover:bg-mint"
                      >
                        <SocialIcon platform={link.platform} />
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
          <div className="flex flex-col gap-6 sm:items-end sm:text-right">
            <nav aria-label={site.ui.legalNavLabel}>
              <ul className="flex flex-col gap-1">
                {site.footer.legalLinks.map((link) => (
                  <li key={link.href}>
                    <SmartLink href={link.href} className={linkClass}>
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-sm">{site.footer.copyright}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
