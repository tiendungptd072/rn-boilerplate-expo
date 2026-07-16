import { afterEach, describe, expect, test } from 'bun:test';
import { AxiosError, isAxiosError } from 'axios';

import {
  apiClient,
  configureApiAuth,
  setApiAccessToken,
} from '../src/lib/api-client';

afterEach(() => {
  configureApiAuth({
    onUnauthorized: undefined,
    refreshAccessToken: undefined,
  });
  setApiAccessToken(null);
});

describe('api client', () => {
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

  test('refreshes once and retries concurrent 401 requests', async () => {
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
        const response = {
          config,
          data: null,
          headers: {},
          status: 401,
          statusText: 'Unauthorized',
        };

        throw new AxiosError(
          'Unauthorized',
          AxiosError.ERR_BAD_REQUEST,
          config,
          undefined,
          response,
        );
      }

      return {
        config,
        data: config.headers.get('Authorization'),
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    const responses = await Promise.all([
      apiClient.get('/profile', { adapter }),
      apiClient.get('/settings', { adapter }),
    ]);

    expect(responses.map((response) => response.data)).toEqual([
      'Bearer fresh-token',
      'Bearer fresh-token',
    ]);
    expect(refreshes).toBe(1);
    expect(attempts).toBe(4);
  });

  test('keeps failures rejected for React Query', async () => {
    try {
      await apiClient.get('/profile', {
        adapter: async (config) => {
          throw new AxiosError('Network error', AxiosError.ERR_NETWORK, config);
        },
      });
    } catch (error) {
      expect(isAxiosError(error)).toBe(true);
      return;
    }

    throw new Error('Expected the API request to reject');
  });
});
