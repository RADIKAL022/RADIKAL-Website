/** Fallback origin used for local builds when no site URL is configured. */
const LOCAL_ORIGIN = 'http://localhost:3000';

type Env = Readonly<Record<string, string | undefined>>;

/**
 * Normalises a configured origin: trims whitespace and trailing slashes and rejects anything
 * that is not an absolute http(s) URL, so canonical URLs can never be malformed.
 */
export function normaliseOrigin(value: string | undefined): string {
  const raw = value?.trim();
  if (!raw) return LOCAL_ORIGIN;
  const url = new URL(raw);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`Site URL must be an http(s) URL, got "${raw}"`);
  }
  return url.origin;
}

/**
 * Public origin from the environment: `NEXT_PUBLIC_SITE_URL`, else Vercel's production domain,
 * else localhost. Also used by scripts/generate-cms-config.ts (so: no path aliases here).
 */
export function resolveSiteUrl(env: Env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normaliseOrigin(explicit);
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return normaliseOrigin(vercel ? `https://${vercel}` : undefined);
}

/** Public origin of the site, e.g. `https://radikal.co`. */
export function getSiteUrl(): string {
  return resolveSiteUrl(process.env);
}

/** Absolute URL for a path on this site. */
export function absoluteUrl(pathname: string, origin: string = getSiteUrl()): string {
  return new URL(pathname, `${origin}/`).toString();
}
