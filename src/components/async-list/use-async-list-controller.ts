import type { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

import {
  canLoadMore,
  resolveAsyncListState,
} from './async-list-state';

type AsyncListControllerOptions<TData, TItem, TError> = {
  getErrorMessage?: (error: TError) => string;
  query: UseInfiniteQueryResult<TData, TError>;
  selectItems: (data: TData) => readonly TItem[];
};

/** Adapts TanStack Query v5 infinite-query state to AsyncList presentation props. */
export function useAsyncListController<TData, TItem, TError = Error>({
  getErrorMessage,
  query,
  selectItems,
}: AsyncListControllerOptions<TData, TItem, TError>) {
  const loadMoreLock = useRef(false);
  const refreshLock = useRef(false);
  const items = useMemo(
    () =>
      query.data === undefined ? [] : [...selectItems(query.data)],
    [query.data, selectItems],
  );
  const state = resolveAsyncListState({
    fetchStatus: query.fetchStatus,
    isError: query.isError,
    isPending: query.isPending,
    itemCount: items.length,
  });
  const mappedError =
    query.error && getErrorMessage
      ? getErrorMessage(query.error)
      : undefined;

  const runRefresh = useCallback(() => {
    if (
      refreshLock.current ||
      query.isFetchingNextPage ||
      query.isRefetching
    ) {
      return;
    }

    refreshLock.current = true;
    void query.refetch().finally(() => {
      refreshLock.current = false;
    });
  }, [query]);

  const runLoadMore = useCallback(() => {
    const allowed = canLoadMore({
      fetchStatus: query.fetchStatus,
      hasNextPage: query.hasNextPage === true,
      isFetchingNextPage: query.isFetchingNextPage,
      isRefetching: query.isRefetching,
    });

    if (!allowed || loadMoreLock.current) return;

    loadMoreLock.current = true;
    void query.fetchNextPage().finally(() => {
      loadMoreLock.current = false;
    });
  }, [query]);

  return {
    errorMessage:
      state === 'error' && !query.isFetchNextPageError
        ? mappedError
        : undefined,
    isFetchingNextPage: query.isFetchingNextPage,
    isPaused: query.fetchStatus === 'paused',
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    items,
    nextPageErrorMessage: query.isFetchNextPageError
      ? mappedError ?? ''
      : undefined,
    onLoadMore: query.hasNextPage ? runLoadMore : undefined,
    onRefresh: runRefresh,
    onRetry: runRefresh,
    onRetryNextPage: runLoadMore,
    refreshErrorMessage:
      query.isRefetchError && !query.isFetchNextPageError
        ? mappedError ?? ''
        : undefined,
    state,
  } as const;
}
