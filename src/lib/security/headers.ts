/**
 * HTTP security headers, applied in `next.config.ts`: a strict policy for the static site
 * (no third-party scripts, embeds or framing).
 */

interface Header {
  key: string;
  value: string;
}

interface HeaderRule {
  source: string;
  headers: Header[];
}

type Directives = Record<string, readonly string[]>;

/** Serialises CSP directives into a header value. */
export function serializeCsp(directives: Directives): string {
  return Object.entries(directives)
    .map(([name, values]) => (values.length > 0 ? `${name} ${values.join(' ')}` : name))
    .join('; ');
}

/**
 * CSP for public pages. `'unsafe-inline'` for scripts is required because every page is
 * statically generated: Next.js inlines its hydration data, and nonces would force dynamic
 * rendering. Risk is low: there is no user-generated HTML (Markdown is rendered as React
 * elements) and no third-party script is allowed.
 */
export function siteCsp({ dev = false } = {}): string {
  return serializeCsp({
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'media-src': ["'self'"],
    'connect-src': ["'self'", ...(dev ? ['ws:'] : [])],
    'frame-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    ...(dev ? {} : { 'upgrade-insecure-requests': [] }),
  });
}

/** Headers shared by every response. */
export function baseHeaders(): Header[] {
  return [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value:
        'accelerometer=(), autoplay=(self), camera=(), display-capture=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), browsing-topics=()',
    },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ];
}

/** All header rules for `next.config.ts`. Later rules override earlier ones per key. */
export function securityHeaders({ dev = false } = {}): HeaderRule[] {
  return [
    { source: '/:path*', headers: baseHeaders() },
    {
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: siteCsp({ dev }) },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      ],
    },
  ];
}
