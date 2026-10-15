import { useCallback, useEffect, useState } from 'react';
import { clearRateLimitState, fetchGitHubRepos, onReposUpdate } from '../utils/githubApi';

/**
 * Public GitHub repos with a loading / success / error status. Subscribes to the stale-while-revalidate
 * updates from githubApi so a background refresh replaces the list on screen without a reload.
 * `retry` is a user action: it clears the local request budget before fetching again.
 */
export const useGitHubRepos = () => {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: 'loading', repos: [], error: null });

  useEffect(() => {
    let active = true;
    setState((prev) => (prev.status === 'loading' ? prev : { status: 'loading', repos: [], error: null }));

    const unsubscribe = onReposUpdate((repos) => {
      if (active) setState({ status: 'success', repos, error: null });
    });

    fetchGitHubRepos()
      .then((repos) => {
        if (active) setState({ status: 'success', repos, error: null });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', repos: [], error });
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    clearRateLimitState();
    setAttempt((count) => count + 1);
  }, []);

  return { ...state, retry };
};
