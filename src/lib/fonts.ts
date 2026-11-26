import { Fraunces, Nunito_Sans } from 'next/font/google';

/**
 * The Wix site used "Fraunces 120pt Light" for headings and "Avenir LT 35 Light" for body copy.
 * Fraunces is a free Google font; Nunito Sans is the closest free match for Avenir.
 * Both are variable fonts: one file per family covers every weight, which keeps the critical
 * path short on mobile. Fraunces also loads its optical-size axis so headings can use the
 * high-contrast "120pt" cut the old site used (see `globals.css`). The Latin subset includes the accents used in Kreyòl (è, ò, à).
 * next/font self-hosts them and sizes fallbacks to avoid layout shift.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});
