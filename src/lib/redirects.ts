/**
 * Permanent redirects from the old Wix URLs to the new, readable ones.
 * The Wix site lived under `/radikal/<slug>` on wixsite.com and at `/<slug>` on a custom domain;
 * both forms are covered.
 */
export const LEGACY_SLUGS: Readonly<Record<string, string>> = {
  investinsaradi: '/invest-in-saradi',
  's-projects-side-by-side': '/our-solutions',
  'projects-6': '/our-initiatives',
  melissahurricanerelief: '/hurricane-melissa-relief',
  fundourinitiatives: '/fund-our-initiatives',
  blank: '/privacy-policy',
  'blank-1': '/accessibility-statement',
  'blank-2': '/terms-and-conditions',
  'blank-3': '/refund-policy',
  home: '/',
};

interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

/** Redirect rules for `next.config.ts`. */
export function legacyRedirects(): Redirect[] {
  const rules: Redirect[] = Object.entries(LEGACY_SLUGS).flatMap(([oldSlug, destination]) => [
    { source: `/${oldSlug}`, destination, permanent: true },
    { source: `/radikal/${oldSlug}`, destination, permanent: true },
  ]);
  rules.push(
    { source: '/radikal', destination: '/', permanent: true },
    { source: '/radikal/:path*', destination: '/:path*', permanent: true },
  );
  return rules;
}
