import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearRateLimitState, getGitHubErrorMessage } from '../../src/utils/githubApi';

describe('GitHub rate limiter', () => {
  beforeEach(() => {
    clearRateLimitState();
    localStorage.clear();
  });

  afterEach(() => {
    clearRateLimitState();
    localStorage.clear();
  });

  it('exposes distinct messages for 403 (server) and 429 (client budget)', () => {
    const serverMessage = getGitHubErrorMessage({
      response: { status: 403, headers: {} },
    });
    const localMessage = getGitHubErrorMessage({
      response: { status: 429, headers: {} },
    });

    expect(serverMessage).toMatch(/60\/hour/i);
    expect(localMessage).toMatch(/wait 60 seconds/i);
    expect(serverMessage).not.toBe(localMessage);
  });

  it('returns the underlying message when no response is attached', () => {
    const message = getGitHubErrorMessage(new Error('boom'));
    expect(message).toBe('boom');
  });
});
