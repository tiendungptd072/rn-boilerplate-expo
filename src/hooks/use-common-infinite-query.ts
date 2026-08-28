import {
  useInfiniteQuery,
  type DefaultError,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

type CommonInfiniteQueryOptions<
  Page,
  Item,
  ErrorType,
  QueryKeyType extends QueryKey,
  PageParam,
> = Omit<
  UseInfiniteQueryOptions<
    Page,
    ErrorType,
    InfiniteData<Page, PageParam>,
    QueryKeyType,
    PageParam
  >,
  'select'
> & {
  getItems: (page: Page) => readonly Item[];
};

/**
 * Runs a typed infinite query and adapts its pages and state for CommonList.
 * The feature remains responsible for its query key, API call, and pagination.
 */
export function useCommonInfiniteQuery<
  Page,
  Item,
  ErrorType = DefaultError,
  QueryKeyType extends QueryKey = QueryKey,
  PageParam = unknown,
>({
  getItems,
  ...queryOptions
}: CommonInfiniteQueryOptions<
  Page,
  Item,
  ErrorType,
  QueryKeyType,
  PageParam
>) {
  const query = useInfiniteQuery(queryOptions);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isPending,
    isRefetching,
    refetch,
  } = query;
  const manualFetchInFlightRef = useRef(false);

  const items = useMemo(
    () => data?.pages.flatMap((page) => getItems(page)) ?? [],
    [data, getItems],
  );

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetching || manualFetchInFlightRef.current) {
      return;
    }

    manualFetchInFlightRef.current = true;
    const releaseRequestLock = () => {
      manualFetchInFlightRef.current = false;
    };

    void fetchNextPage().then(releaseRequestLock, releaseRequestLock);
  }, [fetchNextPage, hasNextPage, isFetching]);

  const refresh = useCallback(() => {
    if (isFetching || manualFetchInFlightRef.current) {
      return;
    }

    manualFetchInFlightRef.current = true;
    const releaseRequestLock = () => {
      manualFetchInFlightRef.current = false;
    };

    void refetch().then(releaseRequestLock, releaseRequestLock);
  }, [isFetching, refetch]);

  const listProps = useMemo(
    () => ({
      data: items,
      hasNextPage: hasNextPage === true,
      isError,
      isFetching,
      isFetchingNextPage,
      isPending,
      isRefetching,
      onLoadMore: loadMore,
      onRefresh: refresh,
      onRetry: refresh,
    }),
    [
      hasNextPage,
      isError,
      isFetching,
      isFetchingNextPage,
      isPending,
      isRefetching,
      items,
      loadMore,
      refresh,
    ],
  );

  return {
    query,
    items,
    listProps,
  };
}
