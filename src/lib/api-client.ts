import {
  AxiosError,
  create as createAxiosClient,
  isAxiosError,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import { ApiError, isApiError } from '@/lib/api-error';

const API_TIMEOUT_MS = 15_000;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type ApiAuthConfig = {
  onUnauthorized?: () => Promise<void> | void;
  refreshAccessToken?: () => Promise<string | null>;
};

let accessToken: string | null = null;
let authConfig: ApiAuthConfig = {};
let refreshRequest: Promise<string | null> | null = null;
let unauthorizedRequest: Promise<void> | null = null;

const defaultConfig: CreateAxiosDefaults = {
  baseURL: env.apiUrl,
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

publicApiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

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
      return Promise.reject(toApiError(error));
    }

    const request = error.config as RetryableRequestConfig;

    if (!accessToken) {
      await handleUnauthorized();
      return Promise.reject(toApiError(error));
    }

    if (request._retry) {
      await handleUnauthorized();
      return Promise.reject(toApiError(error));
    }

    request._retry = true;

    if (!authConfig.refreshAccessToken) {
      await handleUnauthorized();
      return Promise.reject(toApiError(error));
    }

    refreshRequest ??= refreshAccessToken();
    const pendingRefresh = refreshRequest;

    let nextToken: string | null;

    try {
      nextToken = await pendingRefresh;
    } finally {
      if (refreshRequest === pendingRefresh) refreshRequest = null;
    }

    if (!nextToken) {
      return Promise.reject(toApiError(error));
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

  unauthorizedRequest ??= Promise.resolve()
    .then(() => authConfig.onUnauthorized?.())
    .catch(() => {
      // The in-memory token is already cleared even if persistence cleanup fails.
    })
    .finally(() => {
      unauthorizedRequest = null;
    });

  await unauthorizedRequest;
}

function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (!isAxiosError(error)) {
    return new ApiError('unknown', 'An unexpected error occurred');
  }

  if (error.code === AxiosError.ERR_CANCELED) {
    return new ApiError('cancelled', 'The request was cancelled');
  }

  if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
    return new ApiError('timeout', 'The request timed out', {
      retryable: true,
    });
  }

  const status = error.response?.status;
  const details = error.response?.data;

  if (!status) {
    return new ApiError('network', 'The network request failed', {
      retryable: true,
    });
  }

  if (status === 401) {
    return new ApiError('unauthorized', 'Authentication is required', {
      status,
    });
  }

  if (status === 422) {
    return new ApiError('validation', 'The request contains invalid data', {
      fields: extractValidationFields(details),
      status,
    });
  }

  if (status >= 500) {
    return new ApiError('server', 'The server could not complete the request', {
      retryable: true,
      status,
    });
  }

  return new ApiError('client', 'The request could not be completed', {
    status,
  });
}

function extractValidationFields(details: unknown): Record<string, string> | undefined {
  if (!isRecord(details) || !isRecord(details.errors)) return undefined;

  const fields = Object.fromEntries(
    Object.entries(details.errors).flatMap(([field, message]) =>
      typeof message === 'string' ? [[field, message]] : [],
    ),
  );

  return Object.keys(fields).length > 0 ? fields : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
