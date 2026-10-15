const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'MertSoylu';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPOS_PATH = `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100&type=public`;

// Cache configuration
const CACHE_KEY = 'github_repos_cache';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes — shorter for fresher data
const RATE_LIMIT_KEY = 'github_api_rate_limit';
const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
let reposMemoryCache = null;
let reposInFlightRequest = null;
let reposMemoryCacheTimestamp = 0;
let revalidating = false;

const defaultHeaders = {
  Accept: 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

/**
 * Lightweight fetch wrapper replacing axios (~37KB gzip savings)
 */
const apiFetch = async (path) => {
  const url = `${GITHUB_API_BASE}${path}`;
  const response = await fetch(url, { headers: defaultHeaders });

  if (!response.ok) {
    const error = new Error(`GitHub API error: ${response.status}`);
    error.response = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
    throw error;
  }

  return { data: await response.json(), headers: Object.fromEntries(response.headers.entries()) };
};

/**
 * Get cached data from sessionStorage
 */
const getCachedData = (key) => {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return { data, timestamp };
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

/**
 * Save data to sessionStorage cache
 */
const setCachedData = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Failed to cache data:', e);
  }
};

const getRateLimitState = () => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) {
      return { windowStart: Date.now(), requestCount: 0, blockedUntil: 0 };
    }

    const parsed = JSON.parse(raw);
    return {
      windowStart: Number(parsed.windowStart) || Date.now(),
      requestCount: Number(parsed.requestCount) || 0,
      blockedUntil: Number(parsed.blockedUntil) || 0,
    };
  } catch {
    localStorage.removeItem(RATE_LIMIT_KEY);
    return { windowStart: Date.now(), requestCount: 0, blockedUntil: 0 };
  }
};

const setRateLimitState = (state) => {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save rate limit state:', e);
  }
};

// Local budget errors carry `status: 429` so the UI can tell them apart without parsing the English message.
const budgetError = (message) => Object.assign(new Error(message), { status: 429 });

const reserveRateLimitSlot = () => {
  const now = Date.now();
  const state = getRateLimitState();

  if (state.blockedUntil > now) {
    const waitSeconds = Math.ceil((state.blockedUntil - now) / 1000);
    throw budgetError(`GitHub API is temporarily paused due to rate limiting. Try again in ${waitSeconds}s.`);
  }

  const nextState = { ...state };
  if (now - nextState.windowStart >= RATE_LIMIT_WINDOW_MS) {
    nextState.windowStart = now;
    nextState.requestCount = 0;
  }

  if (nextState.requestCount >= MAX_REQUESTS_PER_MINUTE) {
    nextState.blockedUntil = now + 60 * 1000;
    setRateLimitState(nextState);
    throw budgetError('GitHub API request budget reached for this minute. Please wait 60 seconds.');
  }

  nextState.requestCount += 1;
  setRateLimitState(nextState);
};

const applyServerRateLimitCooldown = (error) => {
  const status = error?.response?.status;
  if (status !== 403 && status !== 429) return;

  const resetHeader = error?.response?.headers?.['x-ratelimit-reset'];
  const now = Date.now();
  let blockedUntil = now + 5 * 60 * 1000;

  if (resetHeader) {
    const resetUnix = Number(resetHeader) * 1000;
    if (Number.isFinite(resetUnix) && resetUnix > now) {
      blockedUntil = resetUnix;
    }
  }

  const state = getRateLimitState();
  const nextState = {
    ...state,
    blockedUntil,
  };
  setRateLimitState(nextState);
};

export const getGitHubErrorMessage = (error, username = GITHUB_USERNAME) => {
  if (!error?.response) {
    return error?.message || 'Failed to fetch repositories from GitHub.';
  }

  const status = error?.response?.status;

  if (status === 401) {
    return 'GitHub API token is invalid or expired. Remove VITE_GITHUB_TOKEN to use unauthenticated access.';
  }

  if (status === 403) {
    return 'GitHub API rate limit reached (60/hour for unauthenticated requests). Try again later.';
  }

  if (status === 429) {
    return 'Local request budget reached. Please wait 60 seconds.';
  }

  if (status === 404) {
    return `GitHub user "${username}" was not found. Check VITE_GITHUB_USERNAME.`;
  }

  if (status >= 500) {
    return 'GitHub is temporarily unavailable. Please try again soon.';
  }

  return 'Failed to fetch repositories from GitHub.';
};

const normalizeRepos = (rawRepos) =>
  rawRepos
    .filter((repo) => !repo.fork)
    .filter((repo) => repo.name !== 'MertSoylu')
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      repo: repo.name,
      owner: repo.owner?.login || GITHUB_USERNAME,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      topics: repo.topics || [],
    }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

export const getGitHubUsername = () => GITHUB_USERNAME;
export const getGitHubProfileUrl = () => `https://github.com/${GITHUB_USERNAME}`;
export const clearRateLimitState = () => localStorage.removeItem(RATE_LIMIT_KEY);

// Subscribers for stale-while-revalidate updates
const reposUpdateListeners = new Set();

/**
 * Subscribe to repo data updates (stale-while-revalidate)
 * @param {Function} callback - Called with fresh repos when background refresh completes
 * @returns {Function} Unsubscribe function
 */
export const onReposUpdate = (callback) => {
  reposUpdateListeners.add(callback);
  return () => reposUpdateListeners.delete(callback);
};

// What a listener can actually see change: the set of repos, their last push and their stars.
const repoSignature = (repos) =>
  (repos || []).map((r) => `${r.id}:${r.updated_at}:${r.stargazers_count}`).join(',');

/**
 * Background revalidation — fetches fresh data silently. Spends a slot from the same local budget as
 * a foreground fetch; when the budget is exhausted the stale list simply stays on screen.
 */
const revalidateRepos = () => {
  if (revalidating) return;

  try {
    reserveRateLimitSlot();
  } catch {
    return;
  }

  revalidating = true;
  apiFetch(REPOS_PATH)
    .then((response) => {
      const freshRepos = normalizeRepos(response.data);
      const changed = repoSignature(reposMemoryCache) !== repoSignature(freshRepos);

      reposMemoryCache = freshRepos;
      reposMemoryCacheTimestamp = Date.now();
      setCachedData(CACHE_KEY, freshRepos);

      // Only notify if data actually changed
      if (changed) reposUpdateListeners.forEach((cb) => cb(freshRepos));
    })
    .catch((error) => {
      applyServerRateLimitCooldown(error);
      console.warn('Background repo revalidation failed:', error);
    })
    .finally(() => {
      revalidating = false;
    });
};

/**
 * Fetch all public repositories for a GitHub user.
 * Uses stale-while-revalidate: returns cached data immediately,
 * then fetches fresh data in background and notifies subscribers.
 * Rejected errors carry the HTTP status (or 429 for the local budget) as `error.status`.
 * @returns {Promise<Array>} Array of repository objects
 */
export const fetchGitHubRepos = async () => {
  // 1. Fresh memory cache — return immediately
  if (reposMemoryCache && Date.now() - reposMemoryCacheTimestamp <= CACHE_TTL) {
    return reposMemoryCache;
  }

  // 2. Session cache — return stale data + revalidate in background
  const cached = getCachedData(CACHE_KEY);
  if (cached) {
    reposMemoryCache = cached.data;
    reposMemoryCacheTimestamp = cached.timestamp;
    // Stale data served, revalidate in background
    revalidateRepos();
    return cached.data;
  }

  // 3. No cache at all — must wait for fresh fetch
  if (reposInFlightRequest) {
    return reposInFlightRequest;
  }

  reserveRateLimitSlot();

  reposInFlightRequest = apiFetch(REPOS_PATH)
    .then((response) => {
      const repos = normalizeRepos(response.data);
      reposMemoryCache = repos;
      reposMemoryCacheTimestamp = Date.now();
      setCachedData(CACHE_KEY, repos);
      return repos;
    })
    .catch((error) => {
      applyServerRateLimitCooldown(error);
      console.warn('Error fetching GitHub repositories:', error);
      throw Object.assign(new Error(getGitHubErrorMessage(error)), { status: error?.response?.status });
    })
    .finally(() => {
      reposInFlightRequest = null;
    });

  return reposInFlightRequest;
};
