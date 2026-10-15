import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import ScrambleText from '../../src/components/ui/ScrambleText';

// framer-motion caches the media query at module level, so drive the preference through a mock instead.
const reduced = vi.hoisted(() => ({ value: false }));
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => reduced.value,
}));

let observers = [];
class FakeIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    observers.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  observers = [];
  reduced.value = false;
  window.IntersectionObserver = FakeIntersectionObserver;
  globalThis.IntersectionObserver = FakeIntersectionObserver;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  delete window.IntersectionObserver;
  delete globalThis.IntersectionObserver;
});

describe('ScrambleText', () => {
  it('always keeps the real text in the DOM and decodes once into view', () => {
    const { container } = render(<ScrambleText text="01 / Projects" />);
    expect(container).toHaveTextContent('01 / Projects');
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toHaveTextContent('');

    act(() => observers[0].callback([{ isIntersecting: true }]));
    act(() => vi.advanceTimersByTime(100));
    // Mid-effect: an aria-hidden overlay shows scrambled glyphs of the same length, separators intact.
    expect(overlay.textContent).toHaveLength('01 / Projects'.length);
    expect(overlay.textContent[3]).toBe('/');

    act(() => vi.advanceTimersByTime(800));
    expect(overlay).toHaveTextContent('');
    expect(container.firstChild.firstChild).toHaveTextContent('01 / Projects');
    expect(container.firstChild.firstChild.style.color).toBe('');
  });

  it('does nothing under reduced motion', () => {
    reduced.value = true;
    const { container } = render(<ScrambleText text="02 / Stack" />);
    expect(observers).toHaveLength(0);
    expect(container).toHaveTextContent('02 / Stack');
  });
});
