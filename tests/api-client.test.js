import { afterEach, describe, expect, test } from 'bun:test';
import { AxiosError } from 'axios';

process.env.EXPO_PUBLIC_API_URL ??= 'https://api.example.com';

const { ApiError } = await import('../src/lib/api-error');
const {
  apiClient,
  configureApiAuth,
  publicApiClient,
  setApiAccessToken,
} = await import('../src/lib/api-client');

afterEach(() => {
  configureApiAuth({
    onUnauthorized: undefined,
    refreshAccessToken: undefined,
  });
  setApiAccessToken(null);
});

describe('api client auth', () => {
  test('adds the bearer token without overriding an explicit header', async () => {
    setApiAccessToken('session-token');

    const response = await apiClient.get('/profile', {
      adapter: async (config) => ({
        config,
        data: config.headers.get('Authorization'),
        headers: {},
        status: 200,
        statusText: 'OK',
      }),
    });

    expect(response.data).toBe('Bearer session-token');
  });

  test('refreshes once and retries five concurrent 401 requests', async () => {
    let attempts = 0;
    let refreshes = 0;

    setApiAccessToken('expired-token');
    configureApiAuth({
      refreshAccessToken: async () => {
        refreshes += 1;
        await Promise.resolve();
        return 'fresh-token';
      },
    });

    const adapter = async (config) => {
      attempts += 1;

      if (config.headers.get('Authorization') === 'Bearer expired-token') {
        throw unauthorizedError(config);
      }

      return {
        config,
        data: config.headers.get('Authorization'),
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    const responses = await Promise.all(
      Array.from({ length: 5 }, (_, index) =>
        apiClient.get(`/resource/${index}`, { adapter }),
      ),
    );

    expect(responses.map((response) => response.data)).toEqual(
      Array.from({ length: 5 }, () => 'Bearer fresh-token'),
    );
    expect(refreshes).toBe(1);
    expect(attempts).toBe(10);
  });

  test('logs out once when refresh fails for concurrent requests', async () => {
    let refreshes = 0;
    let unauthorizedTransitions = 0;

    setApiAccessToken('expired-token');
    configureApiAuth({
      onUnauthorized: async () => {
        unauthorizedTransitions += 1;
        await Promise.resolve();
      },
      refreshAccessToken: async () => {
        refreshes += 1;
        throw new Error('Refresh failed');
      },
    });

    const results = await Promise.allSettled(
      Array.from({ length: 5 }, (_, index) =>
        apiClient.get(`/resource/${index}`, {
          adapter: async (config) => {
            throw unauthorizedError(config);
          },
        }),
      ),
    );

    expect(results.every((result) => result.status === 'rejected')).toBe(true);
    expect(refreshes).toBe(1);
    expect(unauthorizedTransitions).toBe(1);
  });

  test('logs out when a refreshed request is still unauthorized', async () => {
    let attempts = 0;
    let unauthorizedTransitions = 0;

    setApiAccessToken('expired-token');
    configureApiAuth({
      onUnauthorized: () => {
        unauthorizedTransitions += 1;
      },
      refreshAccessToken: async () => 'fresh-token',
    });

    const request = apiClient.get('/profile', {
      adapter: async (config) => {
        attempts += 1;
        throw unauthorizedError(config);
      },
    });

    await expect(request).rejects.toMatchObject({ kind: 'unauthorized', status: 401 });
    expect(attempts).toBe(2);
    expect(unauthorizedTransitions).toBe(1);
  });

  test('logs out immediately when no refresh callback is configured', async () => {
    let unauthorizedTransitions = 0;

    setApiAccessToken('expired-token');
    configureApiAuth({
      onUnauthorized: () => {
        unauthorizedTransitions += 1;
      },
    });

    const request = apiClient.get('/profile', {
      adapter: async (config) => {
        throw unauthorizedError(config);
      },
    });

    await expect(request).rejects.toBeInstanceOf(ApiError);
    expect(unauthorizedTransitions).toBe(1);
  });
});

describe('api error normalization', () => {
  test('maps network failures without leaking Axios errors', async () => {
    const request = publicApiClient.get('/profile', {
      adapter: async (config) => {
        throw new AxiosError('Network error', AxiosError.ERR_NETWORK, config);
      },
    });

    await expect(request).rejects.toMatchObject({ kind: 'network', retryable: true });
  });

  test('maps validation fields', async () => {
    const request = publicApiClient.post('/profile', null, {
      adapter: async (config) => {
        const response = {
          config,
          data: { errors: { email: 'Invalid email' } },
          headers: {},
          status: 422,
          statusText: 'Unprocessable Entity',
        };

        throw new AxiosError(
          'Validation failed',
          AxiosError.ERR_BAD_REQUEST,
          config,
          undefined,
          response,
        );
      },
    });

    await expect(request).rejects.toMatchObject({
      fields: { email: 'Invalid email' },
      kind: 'validation',
      retryable: false,
      status: 422,
    });
  });
});

function unauthorizedError(config) {
  const response = {
    config,
    data: null,
    headers: {},
    status: 401,
    statusText: 'Unauthorized',
  };

  return new AxiosError(
    'Unauthorized',
    AxiosError.ERR_BAD_REQUEST,
    config,
    undefined,
    response,
  );
}
