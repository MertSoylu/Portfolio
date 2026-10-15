import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../src/context/LanguageContext';
import Hero from '../../src/components/Hero';

// No network: the hero's "Now" panel asks GitHub for the repo count.
vi.mock('../../src/hooks/useGitHubRepos', () => ({
  useGitHubRepos: () => ({ status: 'loading', repos: [], error: null, retry: () => {} }),
}));

// jsdom has no IntersectionObserver (framer-motion's Reveal needs one).
class FakeIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

let getContext;

beforeEach(() => {
  window.localStorage.setItem('language', 'en');
  window.IntersectionObserver = FakeIntersectionObserver;
  globalThis.IntersectionObserver = FakeIntersectionObserver;
  // jsdom has no WebGL (and logs "not implemented" for getContext): behave like a browser that refuses it.
  getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  getContext.mockRestore();
  delete window.IntersectionObserver;
  delete globalThis.IntersectionObserver;
});

const renderHero = () =>
  render(
    <LanguageProvider>
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    </LanguageProvider>,
  );

describe('Hero without WebGL', () => {
  it('renders the real h1 text immediately and keeps it as the fallback', async () => {
    const { container } = renderHero();

    const heading = screen.getByRole('heading', { level: 1, name: 'Mert Soylu' });
    expect(heading).toHaveTextContent('Mert Soylu');
    expect(container.querySelectorAll('h1')).toHaveLength(1);

    // The name canvas is decorative: hidden from assistive tech.
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');

    // The lazy engine loads after the window has loaded, finds no WebGL and settles on the plain text.
    const box = container.querySelector('[data-ascii-name]');
    await waitFor(() => expect(box).toHaveAttribute('data-status', 'plain'), { timeout: 3000 });
    expect(screen.getByRole('heading', { level: 1, name: 'Mert Soylu' })).toBeInTheDocument();
  });

  it('keeps the hero contracts: CV download link and a single h1', () => {
    const { container } = renderHero();
    const cv = container.querySelector('a[href="/cv.pdf"][download]');
    expect(cv).not.toBeNull();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'hero-title');
  });

  it('does not throw when idle callbacks fire after unmount', async () => {
    const { unmount } = renderHero();
    unmount();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    expect(getContext).not.toHaveBeenCalled();
  });
});
