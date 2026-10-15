import { describe, expect, it } from 'vitest';
import { PROJECTS, UI_COPY, getProject, pick, previewAlt } from '../../src/data/projects';
import { CASE_STUDIES } from '../../src/data/caseStudies';

describe('pick', () => {
  it('reads the requested language', () => {
    expect(pick({ tr: 'Canlı', en: 'Live' }, true)).toBe('Canlı');
    expect(pick({ tr: 'Canlı', en: 'Live' }, false)).toBe('Live');
  });

  it('falls back to the other language when a translation is missing or empty', () => {
    expect(pick({ en: 'Live' }, true)).toBe('Live');
    expect(pick({ tr: 'Canlı' }, false)).toBe('Canlı');
    expect(pick({ tr: '', en: 'Live' }, true)).toBe('Live');
  });

  it('returns plain strings and arrays untouched and never undefined', () => {
    expect(pick('Rust', true)).toBe('Rust');
    expect(pick(['a', 'b'], false)).toEqual(['a', 'b']);
    expect(pick(undefined, true)).toBe('');
    expect(pick(null, false)).toBe('');
    expect(pick({ tr: ['bir'], en: ['one'] }, false)).toEqual(['one']);
  });
});

describe('project copy', () => {
  const resolvesInBothLanguages = (value) => {
    expect(pick(value, true), JSON.stringify(value)).toBeTruthy();
    expect(pick(value, false), JSON.stringify(value)).toBeTruthy();
  };

  it('every tag and result tag resolves in both languages', () => {
    PROJECTS.forEach((project) => {
      project.tags.forEach(resolvesInBothLanguages);
      CASE_STUDIES[project.id].resultTags.forEach(resolvesInBothLanguages);
    });
  });

  it('result tags that differ between languages are bilingual objects', () => {
    const tagsOf = (id) => CASE_STUDIES[id].resultTags.map((tag) => pick(tag, true));
    expect(tagsOf('typesprint')).toEqual(['JavaScript', 'WPM', 'Çok dilli', 'Liderlik tablosu']);
    expect(tagsOf('msscan')).toContain('Hız sınırlama');
  });

  it('case study facts are bilingual, start with the shared "Platform" label and are never empty', () => {
    PROJECTS.forEach((project) => {
      const { facts } = CASE_STUDIES[project.id];
      expect(facts.length, project.id).toBeGreaterThan(0);
      facts.forEach((fact) => {
        resolvesInBothLanguages(fact.label);
        resolvesInBothLanguages(fact.value);
      });
      expect(pick(facts[0].label, false), project.id).toBe('Platform');
    });
  });

  it('typesprint no longer labels its word pools as "Language"', () => {
    const labels = CASE_STUDIES.typesprint.facts.map((fact) => pick(fact.label, false));
    expect(labels).not.toContain('Language');
  });

  it('gallery shots carry real dimensions, a caption and a descriptive alt that differs from it', () => {
    PROJECTS.forEach((project) => {
      (CASE_STUDIES[project.id].gallery ?? []).forEach((shot) => {
        expect(shot.width, shot.src).toBeGreaterThan(0);
        expect(shot.height, shot.src).toBeGreaterThan(0);
        [true, false].forEach((isTurkish) => {
          const alt = pick(shot.alt, isTurkish);
          expect(alt, shot.src).toBeTruthy();
          expect(alt, shot.src).not.toBe(pick(shot.caption, isTurkish));
        });
      });
    });
  });

  it('external-link screen reader note lives in UI_COPY', () => {
    resolvesInBothLanguages(UI_COPY.newTab);
  });

  it('previewAlt is built from the summary, not a bare "<title> preview"', () => {
    const project = getProject('msscan');
    expect(previewAlt(project, false)).toContain(project.summary.en);
    expect(previewAlt(project, true)).toContain(project.summary.tr);
    expect(previewAlt(project, false)).not.toBe(`${project.title} preview`);
  });
});
