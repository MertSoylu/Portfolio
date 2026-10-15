import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../src/context/LanguageContext';
import CaseStudyPage from '../../src/pages/CaseStudyPage';

// jsdom has no IntersectionObserver (framer-motion's Reveal and the scroll-spy both need one).
// This fake records its instances so a test can fire intersection entries by hand.
let observers = [];
class FakeIntersectionObserver {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    observers.push(this);
  }
  observe(target) {
    this.targets.push(target);
  }
  unobserve() {}
  disconnect() {
    this.targets = [];
  }
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  observers = [];
  window.IntersectionObserver = FakeIntersectionObserver;
  globalThis.IntersectionObserver = FakeIntersectionObserver;
});

afterEach(() => {
  delete window.IntersectionObserver;
  delete globalThis.IntersectionObserver;
});

const renderAt = (path, language = 'en') => {
  window.localStorage.setItem('language', language);
  return render(
    <HelmetProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/case-study/:id" element={<CaseStudyPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </HelmetProvider>,
  );
};

describe('CaseStudyPage', () => {
  it('renders an unknown id as the lazy-loaded 404 page', async () => {
    renderAt('/case-study/does-not-exist');
    // NotFoundPage is lazy: wait for it. Its h1 carries the status ("404: Page not found").
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/404|not found/i);
  });

  it('renders numbered sections with a contents list for the same sections', () => {
    renderAt('/case-study/typesprint');

    expect(screen.getByRole('heading', { level: 1, name: 'TypeSprint' })).toBeInTheDocument();
    const sectionHeadings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual(['Problem', 'Solution', 'Product decisions', 'Result']);

    // The mobile jump list and the lg rail both list every section (one is display:none by CSS).
    const contents = screen.getAllByRole('navigation', { name: 'Contents' });
    expect(contents).toHaveLength(2);
    contents.forEach((nav) => {
      expect(
        within(nav)
          .getAllByRole('link')
          .map((link) => link.getAttribute('href')),
      ).toEqual(['#problem', '#solution', '#decisions', '#result']);
    });
  });

  it('keeps the project and "other projects" navigation landmarks', () => {
    renderAt('/case-study/noble', 'tr');
    expect(screen.getByRole('navigation', { name: 'Proje gezinme' })).toBeInTheDocument();
    const others = screen.getByRole('navigation', { name: 'Diğer projeler' });
    expect(within(others).queryByRole('link', { name: /NOBLE/ })).toBeNull();
  });

  it('shows the gallery with explicit dimensions and a non-duplicated alt', () => {
    renderAt('/case-study/noble');
    const shots = screen
      .getAllByRole('img')
      .filter((img) => img.getAttribute('src')?.startsWith('/previews/noble/'));
    expect(shots).toHaveLength(5);
    shots.forEach((img) => {
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
      expect(img.getAttribute('alt').length).toBeGreaterThan(40);
    });
  });

  it('marks the section being read with aria-current="location" (scroll-spy)', () => {
    renderAt('/case-study/typesprint');

    // The scroll-spy observer is the one that watches the page's section elements.
    const spy = observers.find((observer) => observer.targets.some((target) => target.id === 'problem'));
    expect(spy).toBeDefined();
    expect(screen.queryAllByRole('link', { current: 'location' })).toHaveLength(0);

    const fire = (id, isIntersecting) =>
      act(() => spy.callback([{ target: document.getElementById(id), isIntersecting }]));

    fire('solution', true);
    const current = screen.getAllByRole('link', { current: 'location' });
    expect(current.length).toBeGreaterThan(0);
    current.forEach((link) => expect(link).toHaveAttribute('href', '#solution'));

    // When the section leaves the band and the next one enters, the mark moves.
    fire('solution', false);
    fire('decisions', true);
    screen
      .getAllByRole('link', { current: 'location' })
      .forEach((link) => expect(link).toHaveAttribute('href', '#decisions'));
  });
});
