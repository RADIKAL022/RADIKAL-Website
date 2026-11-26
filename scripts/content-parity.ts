/**
 * Content parity check: maps every heading, paragraph, button, link and image crawled from the
 * old Wix site (docs/source/wix/*.json) to the JSON key that now holds it, and writes
 * docs/CONTENT-PARITY.md. Exits with code 1 if any item is neither found nor explained.
 *
 * Run: npm run content:parity
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { LEGACY_SLUGS } from '../src/lib/redirects.ts';

interface WixItem {
  kind: string;
  text?: string;
  href?: string;
  level?: number;
  wixMedia?: string;
  wixFileName?: string | null;
  title?: string;
  type?: string;
  label?: string | null;
  src?: string;
  links?: string[];
}

interface WixPage {
  wixUrl: string;
  wixTitle: string;
  newSlug: string;
  items: WixItem[];
}

interface Leaf {
  file: string;
  key: string;
  value: string;
}

const root = process.cwd();
const sourceDir = path.join(root, 'docs', 'source', 'wix');
const media = JSON.parse(readFileSync(path.join(sourceDir, '_media.json'), 'utf8')) as {
  media: Record<string, string>;
  video: Record<string, string>;
};

/** Items intentionally not copied as-is, with the reason. Matched on exact Wix text. */
const EXPLAINED: Record<string, string> = {
  Option: 'Wix payment-form radio label; giving levels are listed instead (no payment backend).',
  Other: 'Wix payment form "other amount" option; not available without a payment backend.',
  '0/100': 'Character counter of the Wix comment box; no form on the new site.',
  'Comment (optional)': 'Wix payment-form comment box; no form on the new site.',
  'Copy link': 'Wix share widget button; Facebook, X and WhatsApp share links are kept.',
  'Load more': 'Button of the embedded Instagram feed; replaced by a link to the profile.',
  'Enter your email here':
    'Wix newsletter form field; replaced by the "Sign Up" button (email link) until a newsletter provider is chosen.',
  'Thanks for submitting!': 'Wix newsletter form confirmation; no form on the new site.',
  Menu: 'Header button label (content/site.json → header.menuLabel).',
  'Powered and secured by Wix': 'Wix branding, no longer true.',
};

const EXPLAINED_PATTERNS: [RegExp, string][] = [
  [
    /^(Invest|Donate|Contribute) \$[\d,]+( Monthly)?$/,
    'Dynamic Wix payment button ("<verb> <amount> <frequency>"); kept as the verb in the section\'s Give button.',
  ],
];

const normalise = (value: string) =>
  value
    .replace(/\\([\\*_])/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[\u00a0\u200b]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function leaves(file: string): Leaf[] {
  const data = JSON.parse(readFileSync(path.join(root, file), 'utf8')) as unknown;
  const out: Leaf[] = [];
  const walk = (value: unknown, key: string) => {
    if (typeof value === 'string') out.push({ file, key, value });
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        walk(item, `${key}[${index}]`);
      });
    } else if (value && typeof value === 'object') {
      for (const [name, inner] of Object.entries(value)) walk(inner, key ? `${key}.${name}` : name);
    }
  };
  walk(data, '');
  return out;
}

const siteLeaves = leaves('content/site.json');
const pageLeaves = new Map(
  readdirSync(path.join(root, 'content', 'pages'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => [name.slice(0, -5), leaves(`content/pages/${name}`)] as const),
);
const allLeaves = [...siteLeaves, ...[...pageLeaves.values()].flat()];

/** New URL for an old Wix URL. */
function newHref(href: string): string {
  const prefix = 'https://nora936.wixsite.com/radikal';
  if (!href.startsWith(prefix)) return href;
  const slug = href.slice(prefix.length).replace(/^\//, '');
  if (!slug) return '/';
  return LEGACY_SLUGS[slug] ?? `/${slug}`;
}

function findText(text: string, preferred: Leaf[]): Leaf | undefined {
  const wanted = normalise(text);
  if (!wanted) return undefined;
  const search = (pool: Leaf[]) =>
    pool.find((leaf) => normalise(leaf.value) === wanted) ??
    pool.find((leaf) => normalise(leaf.value).includes(wanted));
  return search(preferred) ?? search(siteLeaves) ?? search(allLeaves);
}

const where = (leaf: Leaf) => `\`${leaf.file}\` → \`${leaf.key}\``;
const cell = (value: string) => {
  const flat = value.replace(/\s+/g, ' ').replace(/\|/g, '\\|');
  return flat.length > 110 ? `${flat.slice(0, 107)}…` : flat;
};

interface Row {
  kind: string;
  content: string;
  location: string;
  status: 'Found' | 'Explained' | 'MISSING';
}

function checkItem(item: WixItem, preferred: Leaf[]): Row {
  const kind = item.kind === 'heading' ? `h${String(item.level)}` : item.kind;

  if (item.kind === 'image' && item.wixMedia) {
    const file = media.media[item.wixMedia];
    const leaf = file ? allLeaves.find((l) => l.value === `/images/${file}`) : undefined;
    const preferredLeaf = file ? preferred.find((l) => l.value === `/images/${file}`) : undefined;
    const hit = preferredLeaf ?? leaf;
    return {
      kind,
      content: `${item.wixMedia}${item.wixFileName ? ` (${item.wixFileName})` : ''}`,
      location: hit ? `\`public/images/${file ?? ''}\` · ${where(hit)}` : '—',
      status: hit ? 'Found' : 'MISSING',
    };
  }
  if (item.kind === 'video' && item.src) {
    const target = media.video[item.src];
    const hit = allLeaves.find((leaf) => leaf.value === target);
    return {
      kind,
      content: item.src,
      location: hit ? `\`public${target ?? ''}\` · ${where(hit)}` : '—',
      status: hit ? 'Found' : 'MISSING',
    };
  }
  if (item.kind === 'embed') {
    return {
      kind,
      content: item.title ?? 'embed',
      location:
        'Replaced by a "socialProfile" section: profile, links and (for the podcast) a static copy of the posts; no third-party script.',
      status: 'Explained',
    };
  }
  if (item.kind === 'form-input' || item.kind === 'form-textarea') {
    return {
      kind,
      content: `${item.type ?? 'textarea'}${item.label ? ` "${item.label}"` : ''}`,
      location: 'Wix form control; the new site has no forms (see "Needs the owner").',
      status: 'Explained',
    };
  }

  const text = item.text ?? '';
  const explanation =
    EXPLAINED[text] ?? EXPLAINED_PATTERNS.find(([pattern]) => pattern.test(text))?.[1];
  const hit = findText(text, preferred);
  if (hit) {
    let location = where(hit);
    if (item.href === 'mailto:info@mysite.com') {
      location +=
        ' · link fixed: Wix pointed to `mailto:info@mysite.com` (template error); now `mailto:<contact.email>`';
    } else if (item.href && !item.href.startsWith('#')) {
      const target = newHref(item.href);
      const hrefLeaf = findHref(target, preferred);
      location += ` · link: \`${item.href.replace('https://nora936.wixsite.com/radikal', '') || '/'}\` → \`${target}\`${hrefLeaf ? '' : ' (target set per section)'}`;
    }
    return { kind, content: text, location, status: 'Found' };
  }
  if (explanation) return { kind, content: text, location: explanation, status: 'Explained' };
  if (text === '© 2035 by radikal.co. Powered and secured by Wix') {
    const copyright = findText('© 2035 by radikal.co.', siteLeaves);
    return {
      kind,
      content: text,
      location: `${copyright ? where(copyright) : '—'} ("Powered and secured by Wix" removed)`,
      status: copyright ? 'Explained' : 'MISSING',
    };
  }
  return { kind, content: text, location: '—', status: 'MISSING' };
}

function findHref(href: string, preferred: Leaf[]): Leaf | undefined {
  const base = href.split('#')[0] ?? href;
  return [...preferred, ...siteLeaves].find(
    (leaf) => leaf.key.endsWith('href') && (leaf.value.split('#')[0] ?? '') === base,
  );
}

const lines: string[] = [
  '# Content parity: old Wix site → new site',
  '',
  'Generated by `npm run content:parity` from the crawl in `docs/source/wix/`. Every heading,',
  'paragraph, list item, button, link and image of the Wix site is listed with the JSON key that',
  'now holds it. **Found** = present word for word; **Explained** = intentionally replaced (reason',
  'given); **MISSING** = not carried over (the script fails if any exist).',
  '',
  'Markdown formatting (bold) and line wrapping are not counted as changes. Texts that the Wix site',
  'split over several lines (e.g. the home introduction) are one paragraph in the new site.',
  '',
];

let missing = 0;
let total = 0;

function table(rows: Row[]) {
  lines.push('| # | Wix element | Wix content | New location | Status |', '|---|---|---|---|---|');
  rows.forEach((row, index) => {
    total += 1;
    if (row.status === 'MISSING') missing += 1;
    lines.push(
      `| ${String(index + 1)} | ${row.kind} | ${cell(row.content)} | ${row.location} | ${row.status} |`,
    );
  });
  lines.push('');
}

const site = JSON.parse(readFileSync(path.join(sourceDir, '_site.json'), 'utf8')) as {
  items: WixItem[];
};
lines.push('## Header and footer (every page)', '');
table(site.items.map((item) => checkItem(item, siteLeaves)));

const pages = readdirSync(sourceDir)
  .filter((name) => !name.startsWith('_') && name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(path.join(sourceDir, name), 'utf8')) as WixPage);
const ORDER = [
  'home',
  'invest-in-saradi',
  'our-story',
  'our-values',
  'our-solutions',
  'our-impact',
  'our-initiatives',
  'hurricane-melissa-relief',
  'fund-our-initiatives',
  'get-involved',
  'faq',
  'privacy-policy',
  'accessibility-statement',
  'terms-and-conditions',
  'refund-policy',
];
pages.sort((a, b) => ORDER.indexOf(a.newSlug) - ORDER.indexOf(b.newSlug));

for (const page of pages) {
  const newPath = page.newSlug === 'home' ? '/' : `/${page.newSlug}`;
  lines.push(
    `## ${page.wixTitle.replace(' | RADIKAL', '')}`,
    '',
    `- Wix: ${page.wixUrl}`,
    `- New: \`${newPath}\` · file \`content/pages/${page.newSlug}.json\``,
    `- Page title: "${page.wixTitle}" → \`seo.title\` + site title template`,
    '',
  );
  table(page.items.map((item) => checkItem(item, pageLeaves.get(page.newSlug) ?? [])));
}

lines.push(
  '## Summary',
  '',
  `${String(total)} items checked, ${String(missing)} missing.`,
  '',
  'Open questions for the owner are listed in `docs/CONTENT-INVENTORY.md` under "Needs the owner".',
  '',
);
writeFileSync(path.join(root, 'docs', 'CONTENT-PARITY.md'), lines.join('\n'));
console.warn(`[parity] ${String(total)} items checked, ${String(missing)} missing`);
if (missing > 0) process.exitCode = 1;
