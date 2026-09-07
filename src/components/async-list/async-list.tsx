import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type FlatListProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ReactElement } from 'react';

import {
  AppText,
  Button,
  Skeleton,
  spacing,
  useTheme,
} from '@/design-system';
import { useLocalization } from '@/i18n/localization-provider';

import type { AsyncListState } from './async-list-state';

type StateRenderer = () => ReactElement | null;
type ErrorRenderer = (message: string) => ReactElement | null;

export type AsyncListProps<TItem> = Omit<
  FlatListProps<TItem>,
  | 'data'
  | 'ListEmptyComponent'
  | 'ListFooterComponent'
  | 'onEndReached'
  | 'onRefresh'
  | 'refreshControl'
  | 'refreshing'
> & {
  containerStyle?: StyleProp<ViewStyle>;
  emptyDescription?: string;
  emptyTitle?: string;
  errorMessage?: string;
  isFetchingNextPage?: boolean;
  isPaused?: boolean;
  isRefreshing?: boolean;
  items: TItem[];
  nextPageErrorMessage?: string;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onRetry?: () => void;
  onRetryNextPage?: () => void;
  refreshErrorMessage?: string;
  renderEmpty?: StateRenderer;
  renderError?: ErrorRenderer;
  renderIdle?: StateRenderer;
  renderSkeleton?: StateRenderer;
  showWebRefreshAction?: boolean;
  skeletonCount?: number;
  state: AsyncListState;
};

/** Generic virtualized list presentation for normalized infinite-query state. */
export function AsyncList<TItem>({
  containerStyle,
  contentContainerStyle,
  emptyDescription,
  emptyTitle,
  errorMessage,
  isFetchingNextPage = false,
  isPaused = false,
  isRefreshing = false,
  items,
  nextPageErrorMessage,
  onEndReachedThreshold = 0.35,
  onLoadMore,
  onRefresh,
  onRetry,
  onRetryNextPage,
  refreshErrorMessage,
  renderEmpty,
  renderError,
  renderIdle,
  renderSkeleton,
  showWebRefreshAction = false,
  skeletonCount = 5,
  state,
  ...listProps
}: AsyncListProps<TItem>) {
  const { t } = useLocalization();
  const theme = useTheme();

  if (state === 'loading') {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderSkeleton?.() ?? (
          <DefaultSkeleton count={skeletonCount} loadingLabel={t('common.loading')} />
        )}
      </View>
    );
  }

  if (state === 'idle') {
    return renderIdle?.() ?? null;
  }

  if (state === 'offline') {
    return (
      <View style={[styles.container, containerStyle]}>
        <StateView
          actionLabel={onRetry ? t('common.retry') : undefined}
          description={t('common.offlineDescription')}
          onAction={onRetry}
          title={t('common.offline')}
          tone="warning"
        />
      </View>
    );
  }

  if (state === 'error') {
    const safeMessage = errorMessage ?? t('common.errorDescription');

    return (
      <View style={[styles.container, containerStyle]}>
        {renderError?.(safeMessage) ?? (
          <StateView
            actionLabel={onRetry ? t('common.retry') : undefined}
            description={safeMessage}
            onAction={onRetry}
            title={t('common.error')}
            tone="danger"
          />
        )}
      </View>
    );
  }

  const emptyState =
    renderEmpty?.() ?? (
      <StateView
        description={emptyDescription ?? t('common.emptyDescription')}
        title={emptyTitle ?? t('common.empty')}
      />
    );
  const footer = isFetchingNextPage ? (
    <View
      accessibilityLabel={t('common.loadingMore')}
      accessibilityRole="progressbar"
      style={styles.footer}
    >
      <ActivityIndicator color={theme.colors.action.primary} />
      <AppText tone="secondary">{t('common.loadingMore')}</AppText>
    </View>
  ) : nextPageErrorMessage !== undefined ? (
    <StateView
      actionLabel={onRetryNextPage ? t('common.retry') : undefined}
      compact
      description={nextPageErrorMessage || t('common.errorDescription')}
      onAction={onRetryNextPage}
      title={t('common.loadMoreError')}
      tone="danger"
    />
  ) : null;
  const refreshControl = onRefresh ? (
    <RefreshControl
      colors={[theme.colors.action.primary]}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      tintColor={theme.colors.action.primary}
    />
  ) : undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      {isPaused && (
        <InlineStatus
          message={t('common.offlineDescription')}
          tone="warning"
        />
      )}
      {refreshErrorMessage !== undefined && (
        <InlineStatus
          actionLabel={onRetry ? t('common.retry') : undefined}
          message={refreshErrorMessage || t('common.errorDescription')}
          onAction={onRetry}
          tone="danger"
        />
      )}
      {Platform.OS === 'web' && showWebRefreshAction && onRefresh && (
        <View style={styles.webRefresh}>
          <Button
            loading={isRefreshing}
            onPress={onRefresh}
            variant="tertiary"
          >
            {t('common.refresh')}
          </Button>
        </View>
      )}
      <FlatList
        {...listProps}
        contentContainerStyle={[
          state === 'empty' && styles.grow,
          contentContainerStyle,
        ]}
        data={items}
        ListEmptyComponent={emptyState}
        ListFooterComponent={footer}
        onEndReached={onLoadMore}
        onEndReachedThreshold={onEndReachedThreshold}
        refreshControl={refreshControl}
      />
    </View>
  );
}

function DefaultSkeleton({
  count,
  loadingLabel,
}: {
  count: number;
  loadingLabel: string;
}) {
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.skeletonContainer}
    >
      <AppText tone="secondary">{loadingLabel}</AppText>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <Skeleton height={18} width="58%" />
          <Skeleton height={14} width="88%" />
        </View>
      ))}
    </View>
  );
}

function InlineStatus({
  actionLabel,
  message,
  onAction,
  tone,
}: {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  tone: 'danger' | 'warning';
}) {
  const theme = useTheme();

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.inlineStatus,
        {
          backgroundColor:
            tone === 'danger'
              ? theme.colors.feedback.dangerSubtle
              : theme.colors.feedback.warningSubtle,
        },
      ]}
    >
      <AppText tone={tone}>{message}</AppText>
      {actionLabel && onAction && (
        <Button onPress={onAction} variant="tertiary">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

function StateView({
  actionLabel,
  compact = false,
  description,
  onAction,
  title,
  tone = 'secondary',
}: {
  actionLabel?: string;
  compact?: boolean;
  description?: string;
  onAction?: () => void;
  title: string;
  tone?: 'danger' | 'secondary' | 'warning';
}) {
  return (
    <View
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={[styles.state, compact && styles.compactState]}
    >
      <AppText
        accessibilityRole={tone === 'danger' ? 'alert' : undefined}
        tone={tone}
        variant="bodyStrong"
      >
        {title}
      </AppText>
      {description && (
        <AppText style={styles.centerText} tone="secondary">
          {description}
        </AppText>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },
  compactState: {
    minHeight: 0,
    paddingVertical: spacing.md,
  },
  container: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  grow: {
    flexGrow: 1,
  },
  inlineStatus: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skeletonContainer: {
    gap: spacing.lg,
    padding: spacing.md,
  },
  skeletonRow: {
    gap: spacing.sm,
  },
  state: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    minHeight: 200,
    padding: spacing.xl,
  },
  webRefresh: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm,
  },
});
