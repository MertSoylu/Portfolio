import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

// githubApi keeps its caches in module state, so each test loads a fresh copy.
describe('GitHub repo fetching', () => {
  const blockBudget = () =>
    localStorage.setItem(
      'github_api_rate_limit',
      JSON.stringify({ windowStart: Date.now(), requestCount: 0, blockedUntil: Date.now() + 60_000 }),
    );

  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('rejects with status 429 when the local budget is exhausted', async () => {
    blockBudget();
    const { fetchGitHubRepos } = await import('../../src/utils/githubApi');

    await expect(fetchGitHubRepos()).rejects.toMatchObject({ status: 429 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('keeps serving the cached list without a background request when the budget is exhausted', async () => {
    const cached = [{ id: 1, name: 'cached-repo', updated_at: '2026-01-01T00:00:00Z' }];
    sessionStorage.setItem('github_repos_cache', JSON.stringify({ data: cached, timestamp: Date.now() }));
    blockBudget();
    const { fetchGitHubRepos } = await import('../../src/utils/githubApi');

    await expect(fetchGitHubRepos()).resolves.toEqual(cached);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('spends one budget slot on the background refresh and notifies subscribers of changes', async () => {
    const cached = [{ id: 1, name: 'old', updated_at: '2026-01-01T00:00:00Z' }];
    sessionStorage.setItem('github_repos_cache', JSON.stringify({ data: cached, timestamp: Date.now() }));
    fetch.mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => [
        { id: 2, name: 'fresh', updated_at: '2026-02-01T00:00:00Z', fork: false, owner: { login: 'x' } },
      ],
    });
    const { fetchGitHubRepos, onReposUpdate } = await import('../../src/utils/githubApi');
    const listener = vi.fn();
    onReposUpdate(listener);

    await expect(fetchGitHubRepos()).resolves.toEqual(cached);
    await vi.waitFor(() => expect(listener).toHaveBeenCalledTimes(1));

    expect(listener.mock.calls[0][0][0]).toMatchObject({ id: 2, name: 'fresh' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem('github_api_rate_limit')).requestCount).toBe(1);
  });
});
