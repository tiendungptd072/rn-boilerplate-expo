import {
  create as createAxiosClient,
  isAxiosError,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_TIMEOUT_MS = 15_000;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ApiAuthConfig = {
  onUnauthorized?: () => Promise<void> | void;
  refreshAccessToken?: () => Promise<string | null>;
};

let accessToken: string | null = null;
let authConfig: ApiAuthConfig = {};
let refreshRequest: Promise<string | null> | null = null;

const defaultConfig: CreateAxiosDefaults = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: API_TIMEOUT_MS,
};

/** Use for public endpoints such as login and refresh token. */
export const publicApiClient = createAxiosClient(defaultConfig);

/** Use for authenticated endpoints. */
export const apiClient = createAxiosClient(defaultConfig);

/** Keeps the Axios authorization header in sync with the active session. */
export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

/**
 * Adds optional refresh-token behavior without coupling the HTTP client to a
 * specific backend response shape. The refresh callback should use
 * `publicApiClient` so it cannot trigger the authenticated interceptor.
 */
export function configureApiAuth(config: ApiAuthConfig) {
  authConfig = { ...authConfig, ...config };
}

apiClient.interceptors.request.use((config) => {
  if (accessToken && !config.headers.has('Authorization')) {
    config.headers.setAuthorization(`Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const request = error.config as RetryableRequestConfig;

    if (!accessToken || request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;

    if (!authConfig.refreshAccessToken) {
      await handleUnauthorized();
      return Promise.reject(error);
    }

    refreshRequest ??= refreshAccessToken();

    let nextToken: string | null;

    try {
      nextToken = await refreshRequest;
    } finally {
      refreshRequest = null;
    }

    if (!nextToken) {
      return Promise.reject(error);
    }

    request.headers.setAuthorization(`Bearer ${nextToken}`);
    return apiClient(request);
  },
);

async function refreshAccessToken() {
  let token: string | null = null;

  try {
    token = (await authConfig.refreshAccessToken?.()) ?? null;
  } catch {
    // Keep the original 401 as the React Query error.
  }

  if (!token) {
    await handleUnauthorized();
    return null;
  }

  setApiAccessToken(token);
  return token;
}

async function handleUnauthorized() {
  setApiAccessToken(null);

  try {
    await authConfig.onUnauthorized?.();
  } catch {
    // The in-memory token is already cleared even if persistence cleanup fails.
  }
}
