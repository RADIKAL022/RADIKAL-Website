# Architecture and decisions

Each decision lists the choice, the reason and the trade-off.

## Rendering

- **Next.js App Router, every page statically generated.** `generateStaticParams` lists the files
  in `content/pages`; `dynamicParams = false` turns any other path into the static 404. _Why:_
  fastest possible pages, nothing to run per request, nothing to attack. _Trade-off:_ a content
  change needs a rebuild (a few minutes on Cloudflare), triggered by every push to `main`.
- **Server Components by default.** Small client islands only: the header menu (`MainMenu`), the
  gallery viewer (`GalleryLightbox`) and the podcast post feed (`PostFeed`). _Why:_ minimal JavaScript, better Core Web Vitals.
- **Routes are thin.** `src/app/**` only wires metadata and renders `ContentPage`; all logic is in
  `src/lib` and components.

## Content

- **JSON files in the repository, not a database.** _Why:_ free, versioned (every edit is a commit
  that can be reverted). _Trade-off:_ no real-time editing.
- **zod schemas are the single source of truth** (`src/lib/content/schemas.ts`). Types are
  inferred (`src/types/content.ts`); the loader validates every file at build time and reports
  `file: path.to.field: message`. _Why:_ a bad content edit fails the build instead of shipping a
  broken page; Cloudflare keeps the previous version.
- **Blank optional fields are "not set".** Cleared fields written as `""` or `{src:"",alt:""}` are
  normalised to `undefined` by `opt()` instead of failing. A half-filled image (picture without
  description) still fails.
- **Pages are ordered lists of typed sections** (`type` + props). `SectionRenderer` maps `type` to a
  component through `SECTION_REGISTRY`, typed `{ [K in SectionType]: SectionComponent<K> }`, so the
  registry is exhaustive at compile time.
- **First section heading = the page's only h1**, enforced by a schema refinement. _Why:_ the Wix
  site had several h1s per page; SEO and accessibility want one.
- **Markdown subset, parsed in-house** (`src/lib/markdown.ts`): paragraphs, headings, quotes, lists,
  links, bold, italic. Output is a tree rendered as React elements; unsafe link schemes are dropped.
  _Why:_ no HTML injection possible, no dependency.
- **Images use fixed-ratio frames with `next/image fill`.** _Why:_ editors never type pixel sizes,
  there is no layout shift, and next/image serves AVIF/WebP at the right width. `imageFit:
contain` exists for diagrams and logos.
- **Media originals kept at full resolution**, EXIF/GPS metadata stripped. _Trade-off:_ a few large
  files in the repository (≈16 MB total).

## Security headers (`src/lib/security/headers.ts`)

- All responses: HSTS (2 years, preload), `nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, CORP.
- Site CSP: `default-src 'self'`, no third-party origins, `frame-ancestors 'none'`,
  `object-src 'none'`, `upgrade-insecure-requests`. `script-src` includes `'unsafe-inline'`
  because statically generated Next.js pages inline their hydration data and nonces would force
  dynamic rendering. Risk accepted: no user-generated HTML, no third-party scripts.

## SEO

- Metadata API per page: title template, description, canonical, `hreflang` (`en` and
  `x-default`, the site is English-only like the Wix site), Open Graph and Twitter cards with the
  page or default share image.
- `sitemap.xml` (indexable pages only), `robots.txt` (allows everything, points to the sitemap), JSON-LD
  `Organization` and `WebSite` on every page, `BreadcrumbList` on subpages.
- Old Wix URLs redirect with 308 (`src/lib/redirects.ts`), including the `/radikal/` prefix.
- Clean URLs replace Wix's generated ones (`/s-projects-side-by-side` → `/our-solutions`,
  `/blank-1` → `/accessibility-statement`). _Trade-off:_ redirects needed, but the new URLs describe
  the pages.

## Design system

- Tokens defined once in `src/app/globals.css` (`@theme`): five colours from the Wix site, fonts,
  type scale, container widths, radii. The default Tailwind palette is removed
  (`--color-*: initial`), so raw colours cannot creep in.
- `src/lib/design/tones.ts` maps each section background to text, button and link colours in one
  place; every pairing meets WCAG AA (lowest: pale green on moss, 5.6:1).
- Fonts via `next/font` (self-hosted, `display: swap`, metric-matched fallbacks): Fraunces (the
  Wix heading font) and Nunito Sans (closest free match to Avenir Light).
- Accessibility: skip link, landmarks, one h1, visible focus ring, native `<dialog>` for menu and
  gallery (focus trap, Escape, focus return), `<details>` for FAQ, `prefers-reduced-motion`
  respected, videos never autoplay.

## Testing

- **Vitest**: schemas and error messages, loader against the real content (media exist, unique
  SEO, internal links resolve), Markdown parser, SEO helpers, section registry, headers, redirects.
- **Playwright** against the production build: every route on desktop and mobile (200, one h1,
  landmarks, title/description/canonical, no console errors, no broken images or internal links,
  anchors exist), 320 px without horizontal scroll, menu and gallery keyboard behaviour, skip link,
  404, redirects, headers, robots/sitemap, JSON-LD, and the entrance animations with and without
  reduced motion.
- `npm run content:parity` re-checks the old site's content against the JSON.
