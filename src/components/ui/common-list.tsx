import { memo, type ReactNode, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type FlatListProps,
  type ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import { AppText, Button, spacing, useTheme } from '@/design-system';
import { useLocalization } from '@/i18n';

export type CommonListProps<ItemT> = Omit<
  FlatListProps<ItemT>,
  | 'data'
  | 'keyExtractor'
  | 'ListEmptyComponent'
  | 'ListFooterComponent'
  | 'onEndReached'
  | 'onRefresh'
  | 'refreshing'
  | 'renderItem'
> & {
  data: ArrayLike<ItemT>;
  renderItem: ListRenderItem<ItemT>;
  keyExtractor: (item: ItemT, index: number) => string;
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onRefresh?: () => void;
  onRetry?: () => void;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  footerComponent?: ReactNode;
};

function CommonListInner<ItemT>({
  contentContainerStyle,
  data,
  emptyComponent,
  errorComponent,
  footerComponent,
  hasNextPage,
  isError,
  isFetching,
  isFetchingNextPage,
  isPending,
  isRefetching,
  keyExtractor,
  loadingComponent,
  onLoadMore,
  onRefresh,
  onRetry,
  onEndReachedThreshold = 0.4,
  renderItem,
  style,
  ...flatListProps
}: CommonListProps<ItemT>) {
  const theme = useTheme();
  const { t } = useLocalization();
  const hasItems = data.length > 0;
  const loadingLabel = t('common.loading');
  const listStyle = useMemo(() => [styles.container, style], [style]);
  const stateStyle = useMemo(
    () => [styles.container, styles.stateContainer, style],
    [style],
  );
  const resolvedContentContainerStyle = useMemo(
    () => [
      !hasItems && styles.emptyContentContainer,
      contentContainerStyle,
    ],
    [contentContainerStyle, hasItems],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) {
      onLoadMore();
    }
  }, [hasNextPage, isFetching, onLoadMore]);

  const listEmptyComponent = useMemo(
    () => (
      <View style={styles.stateContainer}>
        {emptyComponent ?? (
          <AppText tone="secondary">{t('common.empty')}</AppText>
        )}
      </View>
    ),
    [emptyComponent, t],
  );

  const listFooterComponent = useMemo(() => {
    if (footerComponent == null && !isFetchingNextPage) {
      return null;
    }

    return (
      <View style={styles.footer}>
        {footerComponent}
        {isFetchingNextPage && (
          <ActivityIndicator
            accessibilityLabel={loadingLabel}
            color={theme.colors.content.brand}
          />
        )}
      </View>
    );
  }, [
    footerComponent,
    isFetchingNextPage,
    loadingLabel,
    theme.colors.content.brand,
  ]);

  if (isPending && !hasItems) {
    return (
      <View style={stateStyle}>
        {loadingComponent ?? (
          <>
            <ActivityIndicator
              accessibilityLabel={loadingLabel}
              color={theme.colors.content.brand}
            />
            <AppText tone="secondary">{loadingLabel}</AppText>
          </>
        )}
      </View>
    );
  }

  if (isError && !hasItems) {
    return (
      <View style={stateStyle}>
        {errorComponent ?? (
          <>
            <AppText accessibilityRole="alert" tone="danger">
              {t('common.error')}
            </AppText>
            {onRetry && (
              <Button variant="secondary" onPress={onRetry}>
                {t('common.retry')}
              </Button>
            )}
          </>
        )}
      </View>
    );
  }

  return (
    <FlatList
      {...flatListProps}
      contentContainerStyle={resolvedContentContainerStyle}
      data={data}
      keyExtractor={keyExtractor}
      ListEmptyComponent={listEmptyComponent}
      ListFooterComponent={listFooterComponent}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      onRefresh={onRefresh}
      refreshing={Boolean(
        onRefresh && isRefetching && !isFetchingNextPage,
      )}
      renderItem={renderItem}
      style={listStyle}
    />
  );
}

/**
 * Renders a reusable virtualized list with consistent infinite-query states.
 * Keep renderItem, keyExtractor, and custom state components referentially
 * stable to benefit from the component's shallow memoization.
 */
export const CommonList = memo(CommonListInner) as typeof CommonListInner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
});
