import { describe, expect, test } from 'bun:test';

import {
  canLoadMore,
  resolveAsyncListState,
} from '../src/components/async-list/async-list-state';

describe('async list state', () => {
  test.each([
    [
      'ready',
      { fetchStatus: 'paused', isError: true, isPending: false, itemCount: 2 },
    ],
    [
      'offline',
      { fetchStatus: 'paused', isError: false, isPending: true, itemCount: 0 },
    ],
    [
      'error',
      { fetchStatus: 'idle', isError: true, isPending: false, itemCount: 0 },
    ],
    [
      'idle',
      { fetchStatus: 'idle', isError: false, isPending: true, itemCount: 0 },
    ],
    [
      'loading',
      { fetchStatus: 'fetching', isError: false, isPending: true, itemCount: 0 },
    ],
    [
      'empty',
      { fetchStatus: 'idle', isError: false, isPending: false, itemCount: 0 },
    ],
  ])('resolves %s', (expected, input) => {
    expect(resolveAsyncListState(input)).toBe(expected);
  });

  test('allows only eligible pagination requests', () => {
    expect(
      canLoadMore({
        fetchStatus: 'idle',
        hasNextPage: true,
        isFetchingNextPage: false,
        isRefetching: false,
      }),
    ).toBe(true);

    for (const blocked of [
      {
        fetchStatus: 'paused',
        hasNextPage: true,
        isFetchingNextPage: false,
        isRefetching: false,
      },
      {
        fetchStatus: 'idle',
        hasNextPage: false,
        isFetchingNextPage: false,
        isRefetching: false,
      },
      {
        fetchStatus: 'idle',
        hasNextPage: true,
        isFetchingNextPage: true,
        isRefetching: false,
      },
      {
        fetchStatus: 'idle',
        hasNextPage: true,
        isFetchingNextPage: false,
        isRefetching: true,
      },
    ]) {
      expect(canLoadMore(blocked)).toBe(false);
    }
  });
});
