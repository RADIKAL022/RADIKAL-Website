# Quality report

What was verified before hand-over, how, and what is known not to be done. Everything marked ✅
was run on 2026-11-25 on Windows 11, Node 24.19.0, npm 11.17.0, against commit `HEAD` of `main`.

## Definition of done

| #   | Requirement                                                                       | Status                             | Evidence                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Content parity: every Wix page, heading, paragraph, button, link and image mapped | ✅                                 | [`CONTENT-PARITY.md`](CONTENT-PARITY.md): 412 items, 0 missing (`npm run content:parity` exits 1 otherwise). Open questions: [`CONTENT-INVENTORY.md` → Needs the owner](CONTENT-INVENTORY.md#needs-the-owner)                                                                    |
| 2a  | Lint, type-check, build                                                           | ✅                                 | `npm run lint` (0 problems, `--max-warnings 0`), `npm run typecheck` (0 errors), `npm run build` (15 pages statically generated, no warnings)                                                                                                                                    |
| 2b  | Unit tests                                                                        | ✅                                 | `npm test`: 9 files, 120 tests passed                                                                                                                                                                                                                                            |
| 2c  | Smoke / e2e tests                                                                 | ✅                                 | `npm run test:e2e`: all routes on desktop and mobile + feature tests, see below                                                                                                                                                                                                  |
| 2d  | Lighthouse for each page                                                          | ✅ recorded; 95+ target partly met | Table below. Desktop: 100 in all four categories on every page. Mobile: Accessibility, Best Practices 100 everywhere, SEO 100 on all indexable pages; Performance 97–100 on text-led pages and 90–95 on photo-led pages under simulated throttling (98 with DevTools throttling) |
| 4   | No secrets; small logical commits                                                 | ✅                                 | `.env*` ignored (only `.env.example` committed); `git grep` for token patterns finds only fake test values; Conventional Commits history                                                                                                                                         |

## Checks and how they were run

| Check          | Command                                                           | Result                                                                                                                       |
| -------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Formatting     | `npm run format:check`                                            | All files formatted                                                                                                          |
| Lint           | `npm run lint`                                                    | 0 errors, 0 warnings (Next core-web-vitals, typescript-eslint strict + stylistic type-checked, jsx-a11y strict, import sort) |
| Types          | `npm run typecheck`                                               | strict, `noUncheckedIndexedAccess`, no `any`, no non-null assertions                                                         |
| Unit tests     | `npm test`                                                        | 120 passed                                                                                                                   |
| Build          | `npm run build`                                                   | 15 content pages statically generated                                                                                        |
| E2E            | `npm run build && npm run test:e2e`                               | 51 passed (desktop + mobile projects), see the list below                                                                    |
| Dependencies   | `npm audit`                                                       | 0 vulnerabilities (full tree, dev included)                                                                                  |
| Content parity | `npm run content:parity`                                          | 412 checked, 0 missing                                                                                                       |
| Secrets        | `git grep` for `gho_`/`ghp_`/`github_pat_`/`client_secret` values | none outside tests                                                                                                           |

### What the e2e suite covers (Playwright, Chromium, production build)

- Every route (15) on **desktop and Pixel 7**: HTTP 200, exactly one `h1`, one banner/main/footer
  landmark, `lang="en"`, title `… | RADIKAL`, meta description, canonical; no console errors or
  page errors; no 4xx/5xx from the site; every image loads (`naturalWidth > 0`) and has an `alt`;
  every internal link returns 200; every in-page anchor exists.
- 320 px wide: no horizontal scroll on any page.
- Menu: opens as a dialog named "Main menu", Escape closes it and focus returns to the button;
  menu links navigate and close it. Skip link is the first tab stop and jumps to `#main`. Gallery
  opens, Next works, Escape closes.
- Unknown URL → custom 404 with status 404. Old Wix URLs → 308 to the new ones.
- Headers: CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, no `X-Powered-By`.
- `robots.txt` allows crawling and points to the sitemap; `sitemap.xml` lists indexable pages only.
- JSON-LD: Organization + WebSite on every page, BreadcrumbList on subpages.
- Motion: menu links and newly loaded podcast posts animate in, as a fade when the visitor asks
  for reduced motion.

### Visual check

Screenshots of the home, Invest in Saradi, Our Values and Fund Our Initiatives pages at 1280 px and
375 px were compared with the Wix site: same colour bands (moss hero, sage bands, cream
background), Fraunces headings, centred logo with "Menu" and "Invest" in the header, bird
illustration, large "INVEST IN WOMEN" statement, footer layout.

## Lighthouse

Lighthouse 13.6.0, Chromium 159 headless, against `next start` on localhost with the image cache warmed (as on a CDN after the first visitor). **Median of 3 runs** per page and form factor, default simulated throttling (mobile: slow 4G, 4× CPU, Moto G Power viewport; desktop preset). Scores: Performance / Accessibility / Best Practices / SEO.

| Page                        | Mobile                | Desktop               | Mobile perf, DevTools throttling¹ |
| --------------------------- | --------------------- | --------------------- | --------------------------------- |
| `/`                         | 93 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 1.8 s)                    |
| `/invest-in-saradi`         | 94 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 1.6 s)                    |
| `/our-story`                | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | —                                 |
| `/our-values`               | 94 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 2.0 s)                    |
| `/our-solutions`            | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | —                                 |
| `/our-impact`               | 97 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | —                                 |
| `/our-initiatives`          | 95 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 2.0 s)                    |
| `/hurricane-melissa-relief` | 91 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 2.1 s)                    |
| `/fund-our-initiatives`     | 90 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 2.0 s)                    |
| `/get-involved`             | 93 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 98 (LCP 1.8 s)                    |
| `/faq`                      | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | —                                 |
| `/privacy-policy`           | 100 / 100 / 100 / 69  | 100 / 100 / 100 / 69  | —                                 |
| `/accessibility-statement`  | 98 / 100 / 100 / 69   | 100 / 100 / 100 / 69  | —                                 |
| `/terms-and-conditions`     | 97 / 100 / 100 / 69   | 100 / 100 / 100 / 69  | —                                 |
| `/refund-policy`            | 100 / 100 / 100 / 69  | 100 / 100 / 100 / 69  | —                                 |

**SEO 69 on the four legal pages is intentional**: they are the unedited Wix templates and are marked `noindex` until the owner provides real text; Lighthouse scores `noindex` as "page is blocked from indexing". Every other page scores 100 for SEO.

¹ On pages whose largest element is a photo, the default _simulated_ mobile score is 90–95: on localhost the server answers so fast that Next.js scripts run before the first paint, so Lighthouse's simulator charges all script download and CPU time to the photo's LCP (~3.0 s), while text-led pages score 97–100. Re-running those pages with real, browser-applied throttling (`--throttling-method=devtools`, same slow-4G and 4× CPU profile) gives **98** with LCP 1.6–2.1 s. The LCP photo is preloaded with `fetchpriority=high`, served as AVIF at quality 60, CSS is inlined and only two font files are preloaded; experiments with WebP-only images and without font preloading made scores worse and were reverted. Re-measure on the production URL with PageSpeed Insights after launch.

## Known limitations and trade-offs

- **Payments and newsletter** are not implemented (no paid services, no backend): donation and
  sign-up buttons open an email until the owner provides links. See "Needs the owner".
- **Lighthouse was measured locally** (`next start`, no CDN, no HTTP/2), not on Vercel. Mobile
  performance under simulated slow 4G is the weakest score on photo-heavy pages; desktop and the
  other three categories are 100.
- **`script-src 'unsafe-inline'`** on public pages: required for statically generated Next.js
  pages without nonces. No third-party scripts and no raw HTML from content mitigate it.
- **Content editing** is done in the JSON files under `content/` (validated at build time); this
  repository has no online editor.
- **Legal pages** are the unedited Wix templates (copied word for word as required), hidden from
  search engines until real text is provided.
- **Video** is the 360p rendition (the highest Wix serves publicly) and has no captions file.
- **Alt texts** were written by the developer (Wix had none) and should be reviewed by the owner.
- **Repository size**: original photos are kept at full resolution (~14 MB of images, 4 MB video).
