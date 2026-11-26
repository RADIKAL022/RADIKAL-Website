import 'server-only';

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { Page, Site } from '@/types/content';

import { parseContent } from './parse';
import { pageSchema, siteSchema } from './schemas';

/** Root folder of the editable JSON content. */
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

/** The home page lives in `content/pages/home.json` and is served at `/`. */
export const HOME_SLUG = 'home';

function readJson(file: string): unknown {
  const raw = readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw) as unknown;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Content error in ${path.relative(process.cwd(), file)}: invalid JSON (${reason})`,
    );
  }
}

/** Shared site data (`content/site.json`), validated. */
export function getSite(): Site {
  const file = path.join(CONTENT_DIR, 'site.json');
  return parseContent(siteSchema, readJson(file), path.relative(process.cwd(), file));
}

/** Slugs of every page file, home included, sorted for stable output. */
export function getPageSlugs(): string[] {
  return readdirSync(PAGES_DIR)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length))
    .sort();
}

/** One page (`content/pages/<slug>.json`), validated. Throws if it does not exist. */
export function getPage(slug: string): Page {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid page slug "${slug}"`);
  }
  const file = path.join(PAGES_DIR, `${slug}.json`);
  return parseContent(pageSchema, readJson(file), path.relative(process.cwd(), file));
}

/** URL path for a page slug. */
export function pathForSlug(slug: string): string {
  return slug === HOME_SLUG ? '/' : `/${slug}`;
}
