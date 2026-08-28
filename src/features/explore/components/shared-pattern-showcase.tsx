import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AsyncList,
  type AsyncListState,
} from '@/components/async-list';
import {
  PermissionGuide,
  type PermissionGuideState,
  type PermissionKind,
} from '@/components/permissions';
import {
  AppText,
  Button,
  Card,
  IconButton,
  Select,
  spacing,
  Surface,
} from '@/design-system';

const listModeOptions = [
  { label: 'Ready', value: 'ready' },
  { label: 'Loading', value: 'loading' },
  { label: 'Idle query', value: 'idle' },
  { label: 'Empty', value: 'empty' },
  { label: 'Error', value: 'error' },
  { label: 'Offline', value: 'offline' },
  { label: 'Cached offline', value: 'cachedOffline' },
  { label: 'Refreshing', value: 'refreshing' },
  { label: 'Pagination loading', value: 'paginationLoading' },
  { label: 'Pagination error', value: 'paginationError' },
] as const;

const permissionKindOptions = [
  { label: 'Camera', value: 'camera' },
  { label: 'Microphone', value: 'microphone' },
  { label: 'Location', value: 'location' },
] as const;

const permissionStateOptions = [
  { label: 'Requestable', value: 'requestable' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Checking', value: 'checking' },
  { label: 'Requesting', value: 'requesting' },
  { label: 'Unsupported', value: 'unsupported' },
  { label: 'Error', value: 'error' },
  { label: 'Granted', value: 'granted' },
] as const;

type ListMode = (typeof listModeOptions)[number]['value'];

const demoItems = [
  { id: 'one', label: 'First list item' },
  { id: 'two', label: 'Second list item' },
  { id: 'three', label: 'Third list item' },
];

export function SharedPatternShowcase() {
  const insets = useSafeAreaInsets();
  const [listMode, setListMode] = useState<ListMode>('ready');
  const [listOpen, setListOpen] = useState(false);
  const [permissionKind, setPermissionKind] =
    useState<PermissionKind>('camera');
  const [permissionState, setPermissionState] =
    useState<PermissionGuideState>('requestable');
  const listState = getListState(listMode);
  const items = listState === 'ready' ? demoItems : [];

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <Select
          closeLabel="Close"
          label="AsyncList state"
          onValueChange={setListMode}
          options={listModeOptions}
          placeholder="Select list state"
          value={listMode}
        />
        <Button onPress={() => setListOpen(true)}>Open AsyncList demo</Button>
      </View>

      <View style={styles.controls}>
        <Select
          closeLabel="Close"
          label="Permission kind"
          onValueChange={setPermissionKind}
          options={permissionKindOptions}
          placeholder="Select permission"
          value={permissionKind}
        />
        <Select
          closeLabel="Close"
          label="Permission state"
          onValueChange={setPermissionState}
          options={permissionStateOptions}
          placeholder="Select state"
          value={permissionState}
        />
      </View>
      <PermissionGuide
        kind={permissionKind}
        onOpenSettings={() => undefined}
        onRequest={() => undefined}
        onRetry={() => undefined}
        state={permissionState}
      />

      <Modal
        animationType="slide"
        onRequestClose={() => setListOpen(false)}
        visible={listOpen}
      >
        <Surface
          style={[
            styles.modal,
            {
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
              paddingTop: insets.top,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <AppText accessibilityRole="header" variant="title">
              AsyncList demo
            </AppText>
            <IconButton
              accessibilityLabel="Close"
              icon="close"
              onPress={() => setListOpen(false)}
            />
          </View>
          <AsyncList
            errorMessage="The demo request failed safely."
            isFetchingNextPage={listMode === 'paginationLoading'}
            isPaused={listMode === 'cachedOffline'}
            isRefreshing={listMode === 'refreshing'}
            items={items}
            keyExtractor={(item) => item.id}
            nextPageErrorMessage={
              listMode === 'paginationError'
                ? 'The next page could not be loaded.'
                : undefined
            }
            onLoadMore={() => undefined}
            onRefresh={() => undefined}
            onRetry={() => undefined}
            onRetryNextPage={() => undefined}
            renderItem={({ item }) => (
              <Card variant="outlined">
                <AppText>{item.label}</AppText>
              </Card>
            )}
            showWebRefreshAction
            state={listState}
          />
        </Surface>
      </Modal>
    </View>
  );
}

function getListState(mode: ListMode): AsyncListState {
  switch (mode) {
    case 'cachedOffline':
    case 'paginationError':
    case 'paginationLoading':
    case 'refreshing':
      return 'ready';
    default:
      return mode;
  }
}

const styles = StyleSheet.create({
  controls: {
    gap: spacing.sm,
  },
  modal: {
    flex: 1,
    gap: spacing.md,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  root: {
    gap: spacing.lg,
  },
});
