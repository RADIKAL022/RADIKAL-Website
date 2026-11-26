# Deployment (Cloudflare Workers)

The site runs on **Cloudflare Workers** through the OpenNext adapter (`@opennextjs/cloudflare`):
every page is prerendered at build time and served from Cloudflare's network; `next/image`
resizes pictures through **Cloudflare Images**. The free plan is enough. No database, no secrets.

| File                  | Purpose                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| `wrangler.jsonc`      | Worker name, compatibility flags, static assets, Images binding          |
| `open-next.config.ts` | OpenNext settings: read-only static-assets cache (no R2 or KV to create) |
| `npm run preview`     | Build and run the Cloudflare version locally (http://localhost:8787)     |
| `npm run deploy`      | Build and upload from your computer (after `npx wrangler login`)         |

## Environment variable

| Name                   | Example              | Used for                                        |
| ---------------------- | -------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://radikal.co` | Canonical URLs, sitemap, Open Graph, robots.txt |

It is read **at build time**, so it goes in the build variables (step 3). A Workers Builds build
fails on purpose if it is missing, so the live site can never point search engines at a wrong
address.

## Go live

1. **Connect GitHub.** Cloudflare dashboard → **Workers & Pages → Create → Import a repository**
   → authorise the Cloudflare GitHub app for the `RADIKAL022` organisation (an organisation owner
   may need to approve it) → choose `RADIKAL-Website`.
2. **Build settings** (same screen):
   - Project name: `radikal-website` (must match `name` in `wrangler.jsonc`)
   - Production branch: `main`
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
   - Root directory: `/` (default)
3. **Build variables** (Advanced settings → Build variables): `NEXT_PUBLIC_SITE_URL` =
   `https://radikal.co`. Node.js 24 is picked up from `.nvmrc`.
4. **Deploy**, then open the `https://radikal-website.<your-subdomain>.workers.dev` address and
   check a few pages and pictures.
5. **Move the domain to Cloudflare.** Dashboard → **Add a domain** → `radikal.co` → Free plan.
   Cloudflare imports the existing DNS records: delete the old Wix ones. At the registrar of
   radikal.co, replace the nameservers with the two Cloudflare shows. Wait until the domain is
   **Active** (minutes to 24 hours).
6. **Attach the domain.** Worker → **Settings → Domains & Routes → Add → Custom domain** →
   `radikal.co`; again for `www.radikal.co`. Then **radikal.co → Rules → Redirect Rules** →
   "Redirect from WWW to root" template (301), so there is one address.
7. **Check:** `https://radikal.co/robots.txt`, `https://radikal.co/sitemap.xml`, a picture
   loading, and an old Wix address such as `https://radikal.co/investinsaradi` (should redirect).
8. **Google Search Console:** add `radikal.co`, submit `https://radikal.co/sitemap.xml`.

Every push to `main` now builds and deploys automatically; other branches get preview versions.

Old Wix addresses (`/investinsaradi`, `/s-projects-side-by-side`, `/blank-1`, …, and
`/radikal/<page>`) redirect permanently to the new ones (`src/lib/redirects.ts`), so links and
search rankings carry over. Security headers and redirects come from `next.config.ts`; OpenNext
applies them in the Worker.

## Limits on the free plan

- Workers: 100,000 requests per day.
- Cloudflare Images: 5,000 unique transformations per month free. The site needs a few hundred
  (each picture at a few widths, AVIF and WebP), and results are cached.

Check the current numbers on Cloudflare's pricing pages before relying on them.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request: `npm ci` (frozen lockfile), format
check, lint, type-check, unit tests, build, Playwright smoke tests, and `npm audit` for production
dependencies. Dependabot (`.github/dependabot.yml`) opens weekly grouped update PRs.

If a content change fails validation, the build fails and Cloudflare keeps serving the previous
version; the build log names the file and field.

## Troubleshooting

| Symptom                                              | Cause and fix                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Build fails: "Set NEXT_PUBLIC_SITE_URL"              | Add it under Settings → Build → Build variables, then retry the build            |
| Deploy fails: name mismatch                          | The Worker's name must be `radikal-website` (as in `wrangler.jsonc`)             |
| Pictures do not load, or load full size              | Workers → the Worker → Settings → Bindings: the `IMAGES` binding must be present |
| `radikal.co` shows an old page or a Cloudflare error | The domain is not Active yet, or the custom domain is not attached (steps 5–6)   |
