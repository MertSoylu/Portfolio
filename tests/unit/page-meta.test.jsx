import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../src/context/LanguageContext';
import PageMeta from '../../src/components/PageMeta';

const renderMeta = (props) =>
  render(
    <HelmetProvider>
      <LanguageProvider>
        <PageMeta {...props} />
      </LanguageProvider>
    </HelmetProvider>,
  );

const robotsTags = () => Array.from(document.head.querySelectorAll('meta[name="robots"]'));

describe('PageMeta robots', () => {
  it('emits exactly one "index, follow" tag by default', async () => {
    renderMeta({ route: '/' });
    await waitFor(() => expect(robotsTags()).toHaveLength(1));
    expect(robotsTags()[0]).toHaveAttribute('content', 'index, follow');
  });

  it('emits "noindex" (and nothing else) when the noindex prop is set', async () => {
    renderMeta({ route: '/404', noindex: true });
    await waitFor(() => expect(robotsTags()).toHaveLength(1));
    expect(robotsTags()[0]).toHaveAttribute('content', 'noindex');
  });
});
