import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SEO_META } from '../../src/utils/constants';
import { PROJECTS, caseStudyPath } from '../../src/data/projects';
import { CASE_STUDIES } from '../../src/data/caseStudies';

const CASE_STUDY_ROUTES = PROJECTS.map((project) => caseStudyPath(project.id));
const REQUIRED_ROUTES = [
  '/',
  '/web',
  '/android',
  '/cybersecurity',
  '/data-science',
  '/404',
  ...CASE_STUDY_ROUTES,
];

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

  it('every case study canonical matches its own route', () => {
    CASE_STUDY_ROUTES.forEach((route) => {
      expect(SEO_META[route].canonical).toBe(`https://mertsoylu.dev${route}`);
    });
  });
});

describe('sitemap.xml', () => {
  const sitemap = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  it('lists every case study route', () => {
    CASE_STUDY_ROUTES.forEach((route) => {
      expect(locs, route).toContain(SEO_META[route].canonical);
    });
  });

  it('lists every indexable route (everything but /404) and nothing else', () => {
    const indexable = REQUIRED_ROUTES.filter((route) => route !== '/404').map(
      (route) => SEO_META[route].canonical,
    );
    expect([...locs].sort()).toEqual([...indexable].sort());
  });
});

describe('project data', () => {
  it('every project has a case study with bilingual content', () => {
    PROJECTS.forEach((project) => {
      const study = CASE_STUDIES[project.id];
      expect(study, project.id).toBeDefined();
      ['subtitle', 'problem', 'solution', 'result'].forEach((field) => {
        expect(study[field].tr, `${project.id}.${field}.tr`).toBeTruthy();
        expect(study[field].en, `${project.id}.${field}.en`).toBeTruthy();
      });
      expect(study.decisions.tr.length).toBe(study.decisions.en.length);
    });
  });

  it('project ids are unique and exactly one project is featured', () => {
    const ids = PROJECTS.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(PROJECTS.filter((project) => project.featured)).toHaveLength(1);
  });
});
