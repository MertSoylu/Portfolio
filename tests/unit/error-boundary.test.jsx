import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../src/components/ErrorBoundary';

const Bomb = () => {
  throw new Error('Test crash');
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>safe child</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('safe child')).toBeInTheDocument();
  });

  it('renders fallback when child throws', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('button', { name: /reload|yenile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /home|ana sayfa/i })).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
