import type { NextConfig } from 'next';

import { legacyRedirects } from './src/lib/redirects';
import { securityHeaders } from './src/lib/security/headers';

const dev = process.env.NODE_ENV === 'development';

// On Cloudflare's build servers (Workers Builds sets WORKERS_CI) the site address must be set:
// otherwise canonical URLs and the sitemap would point search engines at localhost.
if (process.env.WORKERS_CI && !process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  throw new Error(
    'Set NEXT_PUBLIC_SITE_URL (e.g. https://radikal.co) in Cloudflare: Settings → Build → Build variables.',
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Inline the (small) stylesheet so it does not block the first paint.
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Photos are served at quality 60: visually clean in AVIF/WebP, ~30% lighter than the default 75.
    qualities: [60],
    // Content images are large originals; cap generated widths to what layouts need.
    deviceSizes: [360, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  headers() {
    return Promise.resolve(securityHeaders({ dev }));
  },
  redirects() {
    return Promise.resolve(legacyRedirects());
  },
};

export default nextConfig;
