export type AsyncListFetchStatus = 'fetching' | 'idle' | 'paused';

export type AsyncListState =
  | 'empty'
  | 'error'
  | 'idle'
  | 'loading'
  | 'offline'
  | 'ready';

type ResolveAsyncListStateInput = {
  fetchStatus: AsyncListFetchStatus;
  isError: boolean;
  isPending: boolean;
  itemCount: number;
};

type CanLoadMoreInput = {
  fetchStatus: AsyncListFetchStatus;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
};

/** Resolves mutually exclusive primary UI states without hiding cached data. */
export function resolveAsyncListState({
  fetchStatus,
  isError,
  isPending,
  itemCount,
}: ResolveAsyncListStateInput): AsyncListState {
  if (itemCount > 0) return 'ready';
  if (fetchStatus === 'paused') return 'offline';
  if (isError) return 'error';
  if (isPending) return fetchStatus === 'idle' ? 'idle' : 'loading';

  return 'empty';
}

/** Prevents duplicate, paused, and refresh-overlapping pagination requests. */
export function canLoadMore({
  fetchStatus,
  hasNextPage,
  isFetchingNextPage,
  isRefetching,
}: CanLoadMoreInput) {
  return (
    hasNextPage &&
    fetchStatus !== 'paused' &&
    !isFetchingNextPage &&
    !isRefetching
  );
}
