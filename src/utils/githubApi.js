const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'MertSoylu';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Cache configuration
const CACHE_KEY = 'github_repos_cache';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes — shorter for fresher data
const RATE_LIMIT_KEY = 'github_api_rate_limit';
const README_CACHE_PREFIX = 'github_readme_cache';
const README_NOT_FOUND_SENTINEL = '__README_NOT_FOUND__';
const MAX_REQUESTS_PER_MINUTE = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
let reposMemoryCache = null;
let reposInFlightRequest = null;
let reposMemoryCacheTimestamp = 0;
const readmeMemoryCache = new Map();
const readmeInFlightRequests = new Map();

const defaultHeaders = {
  'Accept': 'application/vnd.github.v3+json',
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

const reserveRateLimitSlot = () => {
  const now = Date.now();
  const state = getRateLimitState();

  if (state.blockedUntil > now) {
    const waitSeconds = Math.ceil((state.blockedUntil - now) / 1000);
    throw new Error(`GitHub API is temporarily paused due to rate limiting. Try again in ${waitSeconds}s.`);
  }

  const nextState = { ...state };
  if (now - nextState.windowStart >= RATE_LIMIT_WINDOW_MS) {
    nextState.windowStart = now;
    nextState.requestCount = 0;
  }

  if (nextState.requestCount >= MAX_REQUESTS_PER_MINUTE) {
    nextState.blockedUntil = now + 60 * 1000;
    setRateLimitState(nextState);
    throw new Error('GitHub API request budget reached for this minute. Please wait 60 seconds.');
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

const getGitHubErrorMessage = (error, username = GITHUB_USERNAME) => {
  if (!error?.response) {
    return error?.message || 'Failed to fetch repositories from GitHub.';
  }

  const status = error?.response?.status;

  if (status === 401) {
    return 'GitHub API token is invalid or expired. Remove VITE_GITHUB_TOKEN to use unauthenticated access.';
  }

  if (status === 403) {
    return 'GitHub API rate limit reached. Please try again later.';
  }

  if (status === 429) {
    return 'Too many GitHub API requests. Please wait and try again.';
  }

  if (status === 404) {
    return `GitHub user "${username}" was not found. Check VITE_GITHUB_USERNAME.`;
  }

  if (status >= 500) {
    return 'GitHub is temporarily unavailable. Please try again soon.';
  }

  return 'Failed to fetch repositories from GitHub.';
};

const getReadmeCacheKey = (owner, repo) =>
  `${README_CACHE_PREFIX}_${owner.toLowerCase()}_${repo.toLowerCase()}`;

const parseGitHubUrlReference = (urlValue) => {
  if (!urlValue || typeof urlValue !== 'string') return null;

  try {
    const parsedUrl = new URL(urlValue);
    const host = parsedUrl.hostname.toLowerCase();
    const parts = parsedUrl.pathname.split('/').filter(Boolean);

    if (host === 'api.github.com' && parts[0] === 'repos' && parts.length >= 3) {
      return {
        owner: parts[1],
        repo: parts[2].replace(/\.git$/i, ''),
      };
    }

    if (host.endsWith('github.com') && parts.length >= 2) {
      return {
        owner: parts[0],
        repo: parts[1].replace(/\.git$/i, ''),
      };
    }
  } catch {
    return null;
  }

  return null;
};

const parseOwnerRepoReference = (value) => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const urlResult = parseGitHubUrlReference(trimmed);
  if (urlResult) return urlResult;

  const parts = trimmed.split('/').filter(Boolean);
  if (parts.length < 2) return null;

  return {
    owner: parts[0],
    repo: parts[1].replace(/\.git$/i, ''),
  };
};

const decodeBase64Content = (encodedContent = '') => {
  const normalized = encodedContent.replace(/\n/g, '');

  if (!normalized) return '';

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    const binary = window.atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(normalized, 'base64').toString('utf-8');
  }

  return '';
};

const getReadmeErrorMessage = (error, owner, repo) => {
  if (!error?.response) {
    return error?.message || `Failed to fetch README for ${owner}/${repo}.`;
  }

  const status = error.response.status;

  if (status === 401) return 'GitHub API token is invalid or expired.';
  if (status === 403) return 'GitHub API rate limit reached while loading README.';
  if (status === 429) return 'Too many GitHub API requests. Please wait and retry.';
  if (status >= 500) return 'GitHub is temporarily unavailable while loading README.';

  return `Failed to fetch README for ${owner}/${repo}.`;
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

export const resolveGitHubRepoReference = (repoReference) => {
  if (!repoReference) return null;

  if (typeof repoReference === 'string') {
    return parseOwnerRepoReference(repoReference);
  }

  if (typeof repoReference === 'object') {
    if (repoReference.owner && repoReference.repo) {
      return {
        owner: repoReference.owner,
        repo: repoReference.repo,
      };
    }

    if (repoReference.full_name) {
      return parseOwnerRepoReference(repoReference.full_name);
    }

    if (repoReference.html_url) {
      return parseOwnerRepoReference(repoReference.html_url);
    }

    if (repoReference.url) {
      return parseOwnerRepoReference(repoReference.url);
    }
  }

  return null;
};

export const fetchRepositoryReadme = async (repoReference) => {
  const resolvedRepo = resolveGitHubRepoReference(repoReference);
  if (!resolvedRepo) {
    return null;
  }

  const { owner, repo } = resolvedRepo;
  const cacheKey = getReadmeCacheKey(owner, repo);

  if (readmeMemoryCache.has(cacheKey)) {
    const cachedReadme = readmeMemoryCache.get(cacheKey);
    return cachedReadme === README_NOT_FOUND_SENTINEL ? null : cachedReadme;
  }

  const cachedReadme = getCachedData(cacheKey);
  if (cachedReadme) {
    readmeMemoryCache.set(cacheKey, cachedReadme.data);
    return cachedReadme.data === README_NOT_FOUND_SENTINEL ? null : cachedReadme.data;
  }

  if (readmeInFlightRequests.has(cacheKey)) {
    return readmeInFlightRequests.get(cacheKey);
  }

  reserveRateLimitSlot();

  const readmeRequest = apiFetch(`/repos/${owner}/${repo}/readme`)
    .then((response) => {
      const decodedReadme = decodeBase64Content(response?.data?.content || '');
      const normalizedReadme = decodedReadme.trim();
      const cachedValue = normalizedReadme ? decodedReadme : README_NOT_FOUND_SENTINEL;

      readmeMemoryCache.set(cacheKey, cachedValue);
      setCachedData(cacheKey, cachedValue);

      return normalizedReadme ? decodedReadme : null;
    })
    .catch((error) => {
      applyServerRateLimitCooldown(error);

      if (error?.response?.status === 404) {
        readmeMemoryCache.set(cacheKey, README_NOT_FOUND_SENTINEL);
        setCachedData(cacheKey, README_NOT_FOUND_SENTINEL);
        return null;
      }

      console.error(`Error fetching README for ${owner}/${repo}:`, error);
      throw new Error(getReadmeErrorMessage(error, owner, repo));
    })
    .finally(() => {
      readmeInFlightRequests.delete(cacheKey);
    });

  readmeInFlightRequests.set(cacheKey, readmeRequest);
  return readmeRequest;
};

// Subscribers for stale-while-revalidate updates
let reposUpdateListeners = new Set();

/**
 * Subscribe to repo data updates (stale-while-revalidate)
 * @param {Function} callback - Called with fresh repos when background refresh completes
 * @returns {Function} Unsubscribe function
 */
export const onReposUpdate = (callback) => {
  reposUpdateListeners.add(callback);
  return () => reposUpdateListeners.delete(callback);
};

/**
 * Background revalidation — fetches fresh data silently
 */
const revalidateRepos = () => {
  apiFetch(`/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100&type=public`)
    .then((response) => {
      const freshRepos = normalizeRepos(response.data);
      const staleIds = (reposMemoryCache || []).map(r => r.id).join(',');
      const freshIds = freshRepos.map(r => r.id).join(',');

      // Only notify if data actually changed
      if (staleIds !== freshIds) {
        reposMemoryCache = freshRepos;
        reposMemoryCacheTimestamp = Date.now();
        setCachedData(CACHE_KEY, freshRepos);
        reposUpdateListeners.forEach(cb => cb(freshRepos));
      }
    })
    .catch((error) => {
      applyServerRateLimitCooldown(error);
      console.warn('Background repo revalidation failed:', error);
    });
};

/**
 * Fetch all public repositories for a GitHub user.
 * Uses stale-while-revalidate: returns cached data immediately,
 * then fetches fresh data in background and notifies subscribers.
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

  reposInFlightRequest = apiFetch(`/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100&type=public`)
    .then((response) => {
      const repos = normalizeRepos(response.data);
      reposMemoryCache = repos;
      reposMemoryCacheTimestamp = Date.now();
      setCachedData(CACHE_KEY, repos);
      return repos;
    })
    .catch((error) => {
      applyServerRateLimitCooldown(error);
      console.error('Error fetching GitHub repositories:', error);
      throw new Error(getGitHubErrorMessage(error));
    })
    .finally(() => {
      reposInFlightRequest = null;
    });

  return reposInFlightRequest;
};

/**
 * Force clear all GitHub caches — use when data is known stale
 */
export const clearGitHubCache = () => {
  reposMemoryCache = null;
  reposMemoryCacheTimestamp = 0;
  readmeMemoryCache.clear();
  try {
    sessionStorage.removeItem(CACHE_KEY);
    // Clear all readme caches
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(README_CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch { /* ignore */ }
};

/**
 * Fetch a specific repository
 * @param {string} repoName - Name of the repository
 * @returns {Promise<Object>} Repository object
 */
export const fetchGitHubRepo = async (repoName) => {
  reserveRateLimitSlot();

  try {
    const response = await apiFetch(`/repos/${GITHUB_USERNAME}/${repoName}`);

    return {
      id: response.data.id,
      name: response.data.name,
      repo: response.data.name,
      owner: response.data.owner?.login || GITHUB_USERNAME,
      full_name: response.data.full_name,
      description: response.data.description,
      url: response.data.html_url,
      html_url: response.data.html_url,
      language: response.data.language,
      stargazers_count: response.data.stargazers_count,
      forks_count: response.data.forks_count,
      watchers_count: response.data.watchers_count,
      updated_at: response.data.updated_at,
      created_at: response.data.created_at,
      topics: response.data.topics || [],
    };
  } catch (error) {
    applyServerRateLimitCooldown(error);
    console.error(`Error fetching repository ${repoName}:`, error);
    throw new Error(getGitHubErrorMessage(error));
  }
};

/**
 * Fetch GitHub user profile information
 * @returns {Promise<Object>} User profile object
 */
export const fetchGitHubUser = async () => {
  reserveRateLimitSlot();

  try {
    const response = await apiFetch(`/users/${GITHUB_USERNAME}`);

    return {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar_url: response.data.avatar_url,
      html_url: response.data.html_url,
      repos_count: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      location: response.data.location,
      company: response.data.company,
      blog: response.data.blog,
      twitter: response.data.twitter_username,
    };
  } catch (error) {
    applyServerRateLimitCooldown(error);
    console.error('Error fetching GitHub user profile:', error);
    throw new Error(getGitHubErrorMessage(error));
  }
};
