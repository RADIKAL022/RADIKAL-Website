import { expect, test } from '@playwright/test';

import { ROUTES } from './routes';

/** Internal links already confirmed to resolve, shared across tests in a worker. */
const checkedLinks = new Map<string, number>();

for (const route of ROUTES) {
  test(`${route} renders without errors`, async ({ page, request }) => {
    const problems: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`page error: ${error.message}`));
    page.on('response', (response) => {
      if (response.status() >= 400 && new URL(response.url()).host === 'localhost:3000') {
        problems.push(`HTTP ${response.status()} ${response.url()}`);
      }
    });

    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.status(), 'status').toBe(200);

    // Exactly one h1, and the landmark structure is in place.
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('body > header')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('body > footer')).toHaveCount(1);
    expect(await page.locator('html').getAttribute('lang')).toBe('en');

    // Unique, non-empty metadata.
    await expect(page).toHaveTitle(/\S.* \| RADIKAL$/);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0).toBeGreaterThan(10);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

    // No broken images: scroll everything into view so lazy images load, then check each.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    });
    await page.waitForLoadState('networkidle');
    const images = page.locator('main img, header img, footer img');
    const count = await images.count();
    for (let index = 0; index < count; index += 1) {
      const image = images.nth(index);
      const alt = await image.getAttribute('alt');
      expect(alt, 'every image has an alt attribute').not.toBeNull();
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), {
          message: `image loads: ${(await image.getAttribute('src')) ?? ''}`,
        })
        .toBe(true);
    }

    // No broken internal links.
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href') ?? ''));
    for (const href of new Set(hrefs.map((href) => href.split('#')[0] ?? href))) {
      if (!checkedLinks.has(href)) {
        checkedLinks.set(href, (await request.get(href)).status());
      }
      expect(checkedLinks.get(href), `link ${href}`).toBe(200);
    }

    // Same-page anchors point at an element that exists.
    const anchors = await page
      .locator(`a[href^="#"], a[href^="${route}#"]`)
      .evaluateAll((links) => links.map((link) => (link.getAttribute('href') ?? '').split('#')[1]));
    for (const id of anchors) {
      if (id) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    }

    expect(problems).toEqual([]);
  });
}

test('menu opens as a dialog, traps focus and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Menu' });
  await button.click();
  const dialog = page.getByRole('dialog', { name: 'Main menu' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Our Story' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});

test('menu links navigate and close the menu', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'FAQ' }).click();
  await expect(page).toHaveURL(/\/faq$/);
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('h1')).toHaveText('Questions');
});

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/our-story');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to Main Content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('gallery opens photos full size', async ({ page }) => {
  await page.goto('/hurricane-melissa-relief');
  await page.locator('main ul button').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Next' }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('unknown pages return the custom 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
});

test('old Wix URLs redirect permanently', async ({ request }) => {
  for (const [from, to] of [
    ['/investinsaradi', '/invest-in-saradi'],
    ['/s-projects-side-by-side', '/our-solutions'],
    ['/projects-6', '/our-initiatives'],
    ['/radikal/our-story', '/our-story'],
    ['/blank-3', '/refund-policy'],
  ] as const) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

test('security headers, robots.txt and sitemap.xml', async ({ request }) => {
  const home = await request.get('/');
  const headers = home.headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['strict-transport-security']).toContain('max-age=');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-powered-by']).toBeUndefined();

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Sitemap:');

  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('<loc>http://localhost:3000/</loc>');
  expect(sitemap).toContain('/our-story</loc>');
  expect(sitemap).not.toContain('/privacy-policy</loc>');
});

test('structured data: Organization and WebSite everywhere, breadcrumbs on subpages', async ({
  page,
}) => {
  const types = async () =>
    page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.flatMap((script) => {
        const data = JSON.parse(script.textContent || 'null') as unknown;
        return (Array.isArray(data) ? data : [data]).map(
          (item) => (item as { '@type': string })['@type'],
        );
      }),
    );
  await page.goto('/');
  expect((await types()).sort()).toEqual(['Organization', 'WebSite']);
  await page.goto('/faq');
  expect((await types()).sort()).toEqual(['BreadcrumbList', 'Organization', 'WebSite']);
});

test('no horizontal scrolling at 320px on any page', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const route of ROUTES) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
});

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test.describe(`motion (${reducedMotion})`, () => {
    test.use({ reducedMotion });

    test('menu links and newly loaded posts animate in', async ({ page }) => {
      // Reduced motion still gets feedback, as a plain fade instead of a rise.
      const expected = reducedMotion === 'reduce' ? 'fade' : 'rise';
      const keyframesShipped = (name: string) =>
        page.evaluate(
          (keyframes) =>
            [...document.styleSheets].some((sheet) =>
              [...sheet.cssRules].some(
                (rule) => rule instanceof CSSKeyframesRule && rule.name === keyframes,
              ),
            ),
          name,
        );

      await page.goto('/get-involved');
      expect(await keyframesShipped(expected)).toBe(true);

      await page.getByRole('button', { name: 'Menu' }).click();
      const link = page.locator('#site-menu li').first();
      await expect(link).toHaveCSS('animation-name', expected);
      await page.keyboard.press('Escape');

      await page.getByRole('button', { name: 'Load More' }).click();
      await expect(page.locator('section ul.grid > li').nth(5)).toHaveCSS(
        'animation-name',
        expected,
      );
    });
  });
}
