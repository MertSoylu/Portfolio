import { describe, expect, it } from 'vitest';
import { SEO_META } from '../../src/utils/constants';

const REQUIRED_ROUTES = ['/', '/web', '/android', '/cybersecurity', '/data-science', '/404'];

describe('SEO_META', () => {
  it('defines all expected routes', () => {
    REQUIRED_ROUTES.forEach((route) => {
      expect(SEO_META[route]).toBeDefined();
    });
  });

  it('every route exposes tr/en title and description', () => {
    REQUIRED_ROUTES.forEach((route) => {
      const meta = SEO_META[route];
      expect(meta.tr.title).toBeTruthy();
      expect(meta.tr.description).toBeTruthy();
      expect(meta.en.title).toBeTruthy();
      expect(meta.en.description).toBeTruthy();
      expect(meta.canonical).toMatch(/^https:\/\//);
      expect(meta.ogImage).toMatch(/^https:\/\//);
    });
  });

  it('all routes reference the single og-image asset', () => {
    REQUIRED_ROUTES.forEach((route) => {
      expect(SEO_META[route].ogImage).toMatch(/\/og-image\.png$/);
    });
  });

  it('canonical URLs match route paths', () => {
    expect(SEO_META['/'].canonical).toMatch(/\/$/);
    expect(SEO_META['/web'].canonical).toMatch(/\/web$/);
    expect(SEO_META['/android'].canonical).toMatch(/\/android$/);
    expect(SEO_META['/cybersecurity'].canonical).toMatch(/\/cybersecurity$/);
    expect(SEO_META['/data-science'].canonical).toMatch(/\/data-science$/);
  });
});
