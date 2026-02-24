import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'MertSoylu';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Cache configuration
const CACHE_KEY = 'github_repos_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms
const RATE_LIMIT_KEY = 'github_api_rate_limit';
const MAX_REQUESTS_PER_MINUTE = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/**
 * Get cached data from localStorage
 */
const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Save data to localStorage cache
 */
const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
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

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
});

const getGitHubErrorMessage = (error, username = GITHUB_USERNAME) => {
  const status = error?.response?.status;

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

  if (error?.code === 'ERR_NETWORK') {
    return 'Network error while reaching GitHub. Check your internet connection.';
  }

  return 'Failed to fetch repositories from GitHub.';
};

export const getGitHubUsername = () => GITHUB_USERNAME;
export const getGitHubProfileUrl = () => `https://github.com/${GITHUB_USERNAME}`;

/**
 * Fetch all public repositories for a GitHub user
 * @returns {Promise<Array>} Array of repository objects
 */
export const fetchGitHubRepos = async () => {
  // Check cache first
  const cached = getCachedData(CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    reserveRateLimitSlot();

    const response = await apiClient.get(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100&type=public`
    );

    // Filter out forked repositories if desired, and sort by recent
    const repos = response.data
      .filter((repo) => !repo.fork) // Exclude forked repos
      .filter((repo) => repo.name !== 'MertSoylu') // Exclude MertSoylu repo
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
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

    // Cache the results
    setCachedData(CACHE_KEY, repos);

    return repos;
  } catch (error) {
    applyServerRateLimitCooldown(error);
    console.error('Error fetching GitHub repositories:', error);
    throw new Error(getGitHubErrorMessage(error));
  }
};

/**
 * Fetch a specific repository
 * @param {string} repoName - Name of the repository
 * @returns {Promise<Object>} Repository object
 */
export const fetchGitHubRepo = async (repoName) => {
  try {
    reserveRateLimitSlot();

    const response = await apiClient.get(
      `/repos/${GITHUB_USERNAME}/${repoName}`
    );

    return {
      id: response.data.id,
      name: response.data.name,
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
  try {
    reserveRateLimitSlot();

    const response = await apiClient.get(`/users/${GITHUB_USERNAME}`);

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
