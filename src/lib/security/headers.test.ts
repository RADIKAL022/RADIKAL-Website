import { describe, expect, it } from 'vitest';

import { LEGACY_SLUGS, legacyRedirects } from '../redirects';
import { securityHeaders, siteCsp } from './headers';

describe('Content-Security-Policy', () => {
  it('site: no third-party origins, no framing, no eval in production', () => {
    const csp = siteCsp();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toMatch(/https?:\/\//);
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('site: allows eval only in development (React refresh)', () => {
    expect(siteCsp({ dev: true })).toContain("'unsafe-eval'");
  });
});

describe('securityHeaders', () => {
  const rules = securityHeaders();
  const find = (source: string) => rules.find((rule) => rule.source === source);

  it('sends HSTS, nosniff, referrer and permissions policies everywhere', () => {
    const keys = find('/:path*')?.headers.map((header) => header.key) ?? [];
    expect(keys).toEqual(
      expect.arrayContaining([
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
        'X-Frame-Options',
      ]),
    );
  });

  it('applies the strict site CSP to every route', () => {
    expect(rules).toContainEqual({
      source: '/:path*',
      headers: expect.arrayContaining([
        { key: 'Content-Security-Policy', value: siteCsp() },
      ]) as unknown,
    });
  });
});

describe('legacyRedirects', () => {
  it('redirects every old Wix slug permanently, with and without /radikal', () => {
    const rules = legacyRedirects();
    expect(rules).toContainEqual({
      source: '/s-projects-side-by-side',
      destination: '/our-solutions',
      permanent: true,
    });
    expect(rules).toContainEqual({
      source: '/radikal/blank-1',
      destination: '/accessibility-statement',
      permanent: true,
    });
    expect(rules).toHaveLength(Object.keys(LEGACY_SLUGS).length * 2 + 2);
  });
});
