import { readdirSync } from 'node:fs';
import path from 'node:path';

/** Every public route, derived from the content files (same rule as the app). */
export const ROUTES: readonly string[] = readdirSync(path.join(process.cwd(), 'content', 'pages'))
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.slice(0, -'.json'.length))
  .map((slug) => (slug === 'home' ? '/' : `/${slug}`))
  .sort();
