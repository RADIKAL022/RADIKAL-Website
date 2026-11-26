# RADIKAL website

The website of RADIKAL, rebuilt from the old Wix site as a fast, accessible static site. All
text and pictures live in JSON files under `content/`, validated at build time.

- **Visitors** get static pages (Next.js, deployed on Vercel): no database, no tracking, no
  third-party scripts.
- **Content** changes are edits to `content/site.json` and `content/pages/<slug>.json`; every push
  to `main` redeploys on Vercel within a minute or two.
- **Developers** get a typed content model (zod), one component per section type, and a test
  suite that checks content, links, accessibility basics and security headers.

| Guide                                          | For                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| [Deployment and setup](docs/DEPLOYMENT.md)     | Vercel, environment, domain                                          |
| [Architecture](docs/ARCHITECTURE.md)           | Decisions and trade-offs                                             |
| [Contributing](CONTRIBUTING.md)                | Workflow, conventions, adding a section type or page                 |
| [Content inventory](docs/CONTENT-INVENTORY.md) | Everything found on the Wix site, and **what still needs the owner** |
| [Content parity](docs/CONTENT-PARITY.md)       | Every Wix item mapped to its JSON key (generated)                    |
| [Quality report](docs/QUALITY-REPORT.md)       | What was verified, how, Lighthouse scores, known limitations         |

## Run it locally

Requirements: Node 24 (see `.nvmrc`) and npm 11.

```bash
npm ci
cp .env.example .env.local   # optional locally; defaults work
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                            | What it does                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                                   |
| `npm run build`                   | Production build; every page is statically generated and all content is validated                    |
| `npm start`                       | Serve the production build                                                                           |
| `npm run lint`                    | ESLint (Next, typescript-eslint strict + type-checked, jsx-a11y strict, import order), zero warnings |
| `npm run typecheck`               | `tsc --noEmit` (strict)                                                                              |
| `npm run format` / `format:check` | Prettier                                                                                             |
| `npm test`                        | Unit tests (Vitest)                                                                                  |
| `npm run test:e2e`                | Playwright smoke + e2e tests against the production build (run `npm run build` first)                |
| `npm run content:parity`          | Re-checks the old-site content against the JSON and rewrites `docs/CONTENT-PARITY.md`                |
| `npm run check`                   | Format, lint, types, unit tests and build in one go                                                  |

## Architecture at a glance

```
            content/site.json ─┐
  content/pages/<slug>.json ───┤  read + validated with zod at build time
                               ▼  (src/lib/content: schemas → loader)
 src/app (routes only) ──► ContentPage ──► SectionRenderer ──► SECTION_REGISTRY[type]
   /, /[slug], 404,                          (first section      ├─ Hero, TextBlock, FeatureGrid
   sitemap, robots, icons                     heading = h1)      ├─ CallToAction, Donation, Gallery*
                                                                 └─ Faq, SocialProfile, Video
 src/components/ui ── Button, SmartLink, Container, Section, Heading, Card, ContentImage, Markdown
 src/components/layout ── SiteHeader + MainMenu*, SiteFooter, SkipLink        (* = client island)

 publish: commit to main on GitHub ──► Vercel build (content validated) ──► live
```

### Folder map

```
content/                 Editable content (JSON). site.json + pages/<slug>.json
docs/                    Guides, inventory, parity report, quality report; source/wix = crawl data
e2e/                     Playwright tests (every route, menu, 404, redirects, headers, motion)
public/images, videos    Media
scripts/                 content-parity.ts (run by Node directly)
src/app/                 Routes only: layout, pages, 404, sitemap, robots, icons
src/components/ui/       Design-system primitives
src/components/layout/   Header, menu, footer, skip link, social icons
src/components/sections/ One component per section type + typed registry + renderer
src/components/page/     ContentPage (loads a page and renders its sections)
src/lib/content/         zod schemas (single source of truth), loader, error formatting
src/lib/security/        Security headers and CSP
src/lib/                 SEO helpers, Markdown parser, redirects, site URL, fonts, share links
src/types/               Types inferred from the schemas
test/stubs/              Test-only stand-ins
```

## The content model

- `content/site.json`: organisation name, tagline, logo, header button, main menu, contact
  details, social links, footer, share-link labels, small interface texts, 404 page, SEO defaults.
- `content/pages/<slug>.json`: one file per page (`home.json` is `/`, any other file is `/<slug>`):
  `title`, `seo` (`title`, `description`, optional `image`, `noindex`) and `sections`, an ordered
  list of typed blocks:

| `type`          | Used for                                                                               |
| --------------- | -------------------------------------------------------------------------------------- |
| `hero`          | Large opening heading + introduction + wide photo (home)                               |
| `textBlock`     | Heading, text, optional photo (left/right/top/bottom) and button                       |
| `featureGrid`   | Lists of items: values, solutions, programmes, initiatives (cards or alternating rows) |
| `callToAction`  | Prompt to act, optionally as a huge statement ("INVEST IN WOMEN")                      |
| `donation`      | Giving levels, give button, share links                                                |
| `gallery`       | Photo grid with full-size viewer                                                       |
| `faq`           | Questions and answers                                                                  |
| `socialProfile` | Instagram-style profile: picture, bio, links, follow buttons, optional post grid       |
| `video`         | Self-hosted video with poster and optional captions                                    |

Text fields that need formatting use a small Markdown subset (bold, italic, links, headings,
quotes, lists),
rendered as React elements (never raw HTML). A bad edit fails the build with a message naming the
file and field, e.g. `Content error in content/pages/faq.json: sections[0].items[2].question:
must not be empty`, so the live site keeps the last good version.

### Add a new page

Create `content/pages/<slug>.json` (copy a similar page; the first section must have a heading)
and link it from the main menu in `content/site.json`. The file name is the URL
(`our-team.json` → `/our-team`); the page is statically generated and added to the sitemap
automatically.

### Add a new section type

One schema and one component; TypeScript and the tests enforce the rest:

1. `src/lib/content/schemas.ts`: add a `z.object({ type: z.literal('myType'), ... })` to `sectionSchema`.
2. `src/components/sections/MyType.tsx`: the component (`SectionProps<'myType'>`), registered in `registry.ts`.

`registry.ts` is typed as an exhaustive map, so a missing entry is a compile error.

## Dependencies (and why)

Runtime: `next`, `react`, `react-dom` (framework), `zod` (content validation and type inference),
`server-only` (guarantees the file-system content loader never reaches the browser bundle).

Development: `typescript`, `@types/*`; `tailwindcss` + `@tailwindcss/postcss` (styling with
design tokens); `eslint`, `@eslint/js`, `eslint-config-next`, `typescript-eslint`,
`eslint-plugin-jsx-a11y`, `eslint-plugin-simple-import-sort`, `eslint-config-prettier` (linting);
`prettier` + `prettier-plugin-tailwindcss` (formatting); `husky` + `lint-staged` (pre-commit);
`vitest` (unit tests); `@playwright/test` (e2e).

Deliberately not dependencies: no Markdown, YAML, icon or image-size library is needed (small,
tested in-house code instead).

## If the site stops updating after an edit

A content edit that breaks validation makes the Vercel build fail; **the live site keeps the last
good version**. Either fix the field named in the build error and push again, or revert the last
commit (`git revert <sha> && git push`, or GitHub Desktop: **History → right-click → Revert
changes in commit**).
