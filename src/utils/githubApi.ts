import axios, { AxiosError } from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'MertSoylu';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Cache configuration
const CACHE_KEY = 'github_repos_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms
const RATE_LIMIT_KEY = 'github_api_rate_limit';
const MAX_REQUESTS_PER_MINUTE = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export interface GitHubRepo {
  id: number | string;
  name: string;
  description: string | null;
  url: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
}

export interface GitHubUser {
  name: string | null;
  login: string;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  repos_count: number;
  followers: number;
  following: number;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter: string | null;
}

interface RateLimitState {
  windowStart: number;
  requestCount: number;
  blockedUntil: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheEntry<T> = JSON.parse(cached);
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

const setCachedData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Failed to cache data:', e);
  }
};

const getRateLimitState = (): RateLimitState => {
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

const setRateLimitState = (state: RateLimitState): void => {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save rate limit state:', e);
  }
};

const reserveRateLimitSlot = (): void => {
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

const applyServerRateLimitCooldown = (error: unknown): void => {
  const axiosError = error as AxiosError;
  const status = axiosError?.response?.status;
  if (status !== 403 && status !== 429) return;

  const headers = axiosError?.response?.headers as Record<string, string> | undefined;
  const resetHeader = headers?.['x-ratelimit-reset'];
  const now = Date.now();
  let blockedUntil = now + 5 * 60 * 1000;

  if (resetHeader) {
    const resetUnix = Number(resetHeader) * 1000;
    if (Number.isFinite(resetUnix) && resetUnix > now) {
      blockedUntil = resetUnix;
    }
  }

  const state = getRateLimitState();
  setRateLimitState({ ...state, blockedUntil });
};

const apiClient = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
});

const getGitHubErrorMessage = (error: unknown, username = GITHUB_USERNAME): string => {
  const axiosError = error as AxiosError;
  const status = axiosError?.response?.status;

  if (status === 403) return 'GitHub API rate limit reached. Please try again later.';
  if (status === 429) return 'Too many GitHub API requests. Please wait and try again.';
  if (status === 404) return `GitHub user "${username}" was not found. Check VITE_GITHUB_USERNAME.`;
  if (status !== undefined && status >= 500) return 'GitHub is temporarily unavailable. Please try again soon.';
  if (axiosError?.code === 'ERR_NETWORK') return 'Network error while reaching GitHub. Check your internet connection.';

  return 'Failed to fetch repositories from GitHub.';
};

export const getGitHubUsername = (): string => GITHUB_USERNAME;
export const getGitHubProfileUrl = (): string => `https://github.com/${GITHUB_USERNAME}`;

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const cached = getCachedData<GitHubRepo[]>(CACHE_KEY);
  if (cached) return cached;

  try {
    reserveRateLimitSlot();

    const response = await apiClient.get<GitHubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100&type=public`
    );

    const repos: GitHubRepo[] = (response.data as unknown[])
      .filter((repo) => {
        const r = repo as { fork: boolean; name: string };
        return !r.fork && r.name !== 'MertSoylu';
      })
      .map((repo) => {
        const r = repo as {
          id: number;
          name: string;
          description: string | null;
          html_url: string;
          language: string | null;
          stargazers_count: number;
          forks_count: number;
          watchers_count: number;
          updated_at: string;
          created_at: string;
          topics: string[];
        };
        return {
          id: r.id,
          name: r.name,
          description: r.description,
          url: r.html_url,
          html_url: r.html_url,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          watchers_count: r.watchers_count,
          updated_at: r.updated_at,
          created_at: r.created_at,
          topics: r.topics || [],
        };
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    setCachedData(CACHE_KEY, repos);
    return repos;
  } catch (error) {
    applyServerRateLimitCooldown(error);
    console.error('Error fetching GitHub repositories:', error);
    throw new Error(getGitHubErrorMessage(error));
  }
};

export const fetchGitHubRepo = async (repoName: string): Promise<GitHubRepo> => {
  try {
    reserveRateLimitSlot();

    const response = await apiClient.get(`/repos/${GITHUB_USERNAME}/${repoName}`);
    const r = response.data;

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      watchers_count: r.watchers_count,
      updated_at: r.updated_at,
      created_at: r.created_at,
      topics: r.topics || [],
    };
  } catch (error) {
    applyServerRateLimitCooldown(error);
    console.error(`Error fetching repository ${repoName}:`, error);
    throw new Error(getGitHubErrorMessage(error));
  }
};

export const fetchGitHubUser = async (): Promise<GitHubUser> => {
  try {
    reserveRateLimitSlot();

    const response = await apiClient.get(`/users/${GITHUB_USERNAME}`);
    const u = response.data;

    return {
      name: u.name,
      login: u.login,
      bio: u.bio,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      repos_count: u.public_repos,
      followers: u.followers,
      following: u.following,
      location: u.location,
      company: u.company,
      blog: u.blog,
      twitter: u.twitter_username,
    };
  } catch (error) {
    applyServerRateLimitCooldown(error);
    console.error('Error fetching GitHub user profile:', error);
    throw new Error(getGitHubErrorMessage(error));
  }
};
