# Contributing

## Setup

```bash
nvm use            # Node 24 from .nvmrc
npm ci             # also installs the Husky pre-commit hook
npx playwright install chromium   # once, for e2e tests
```

## Workflow

1. Branch from `main` (`feat/…`, `fix/…`, `content/…`).
2. Make the change with tests. Before pushing: `npm run check` and, for UI changes,
   `npm run build && npm run test:e2e`.
3. Open a pull request; CI must be green.

The pre-commit hook runs Prettier and ESLint on staged files and a full type-check.

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`,
  `docs:`, `test:`, `chore:`, `refactor:`, `ci:`). Content edits use `content: …`.
- **TypeScript:** strict, no `any`, no non-null assertions (lint error). Types come from the zod
  schemas; do not hand-write content types.
- **Components:** Server Components unless interaction requires `'use client'`; keep client
  islands small. Short JSDoc on every exported component and function. No copy in components:
  every visible string comes from `content/`.
- **Styling:** only design-token utilities (`bg-moss`, `text-h2`, `max-w-content`…). Add new
  tokens to `@theme` in `src/app/globals.css`; never raw hex values in components. Section colour
  pairings live in `src/lib/design/tones.ts`.
- **Accessibility:** semantic elements first, ARIA only when needed, labelled controls, one h1 per
  page (the first section heading), keyboard-operable everything.
- **Dependencies:** pin exact versions (`.npmrc` has `save-exact`), justify each new one in the
  README, prefer a few lines of tested code over a package.

## Adding things

- **A page:** add `content/pages/<slug>.json` and a menu link. See the README.
- **A section type:** schema in `src/lib/content/schemas.ts`, component in
  `src/components/sections/` registered in `registry.ts`. The compiler and `registry.test.ts`
  tell you if one is missing.
- **A site-wide setting:** add it to `siteSchema` and to `content/site.json`.
