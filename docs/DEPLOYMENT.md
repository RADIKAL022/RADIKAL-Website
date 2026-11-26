# Deployment

The site is static (every page is generated at build time) and runs on **Vercel**; the free
Hobby plan is enough. No database, no server-side secrets, no paid service.

## Environment variables

Set in **Vercel → Project → Settings → Environment Variables** (Production). `.env.example`
lists them.

| Name                   | Example              | Used for                                        |
| ---------------------- | -------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://radikal.co` | Canonical URLs, sitemap, Open Graph, robots.txt |

If it is missing, the build falls back to Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.

## Go live

1. <https://vercel.com/new> → **Import Git Repository** → choose this repository.
2. Framework preset: **Next.js** (detected); build command and output: defaults. Node.js version:
   **24.x** (Settings → General; matches `.nvmrc` and `engines`).
3. Add `NEXT_PUBLIC_SITE_URL=https://radikal.co` and **Deploy**. Check the `*.vercel.app` URL.
4. **Settings → Domains → Add** `radikal.co`, then `www.radikal.co` redirecting to `radikal.co`.
5. At the DNS provider (remove the old Wix records first):
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`

   (Use the exact values Vercel shows if they differ.)

6. Wait for **Valid Configuration** (HTTPS is automatic), then **Redeploy** once.
7. Check `https://radikal.co/robots.txt` and `https://radikal.co/sitemap.xml`, then submit the
   sitemap in Google Search Console.

Every push to `main` deploys production automatically; pull requests get preview deployments.

Old Wix addresses (`/investinsaradi`, `/s-projects-side-by-side`, `/blank-1`, …, and
`/radikal/<page>`) redirect permanently to the new ones (`src/lib/redirects.ts`), so links and
search rankings carry over.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request: `npm ci` (frozen lockfile), format
check, lint, type-check, unit tests, build, Playwright smoke tests, and `npm audit` for production
dependencies. Dependabot (`.github/dependabot.yml`) opens weekly grouped update PRs.

If a content change fails validation, the build fails and Vercel keeps serving the previous
deployment; the build log names the file and field.
