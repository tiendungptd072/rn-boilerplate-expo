import * as Linking from 'expo-linking';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  AppText,
  Button,
  Card,
  Icon,
  spacing,
  useTheme,
} from '@/design-system';
import { useLocalization } from '@/i18n/localization-provider';

import type { PermissionGuideState } from './permission-state';

export type PermissionKind = 'camera' | 'location' | 'microphone';

type AsyncAction = () => Promise<void> | void;

export type PermissionGuideProps = {
  kind: PermissionKind;
  onActionError?: () => void;
  onDismiss?: () => void;
  onOpenSettings?: AsyncAction;
  onRequest?: AsyncAction;
  onRetry?: AsyncAction;
  reason?: string;
  state: PermissionGuideState;
  style?: StyleProp<ViewStyle>;
};

const titleKeys = {
  camera: 'permissions.camera.title',
  location: 'permissions.location.title',
  microphone: 'permissions.microphone.title',
} as const;

const reasonKeys = {
  camera: 'permissions.camera.reason',
  location: 'permissions.location.reason',
  microphone: 'permissions.microphone.reason',
} as const;

const stateKeys = {
  blocked: 'permissions.blocked',
  checking: 'permissions.checking',
  error: 'permissions.error',
  granted: 'permissions.granted',
  requestable: 'permissions.requestable',
  requesting: 'permissions.requesting',
  unsupported: 'permissions.unsupported',
} as const;

/** Permission rationale and recovery UI; native permission requests remain feature-owned. */
export function PermissionGuide({
  kind,
  onActionError,
  onDismiss,
  onOpenSettings,
  onRequest,
  onRetry,
  reason,
  state,
  style,
}: PermissionGuideProps) {
  const { t } = useLocalization();
  const theme = useTheme();
  const [failedActionKey, setFailedActionKey] = useState<string | null>(null);
  const [actionRunning, setActionRunning] = useState(false);
  const actionKey = `${kind}:${state}`;
  const actionFailed = failedActionKey === actionKey;

  const runAction = async (action: AsyncAction) => {
    if (actionRunning) return;

    setFailedActionKey(null);
    setActionRunning(true);

    try {
      await action();
    } catch {
      setFailedActionKey(actionKey);
      onActionError?.();
    } finally {
      setActionRunning(false);
    }
  };

  const action = getPrimaryAction({
    onOpenSettings,
    onRequest,
    onRetry,
    state,
    t,
  });
  const description = actionFailed
    ? t('permissions.actionError')
    : state === 'requestable'
      ? reason ?? t(reasonKeys[kind])
      : t(stateKeys[state]);
  const tone = getStateTone(state, actionFailed);

  return (
    <Card style={[styles.card, style]} variant="outlined">
      <View accessible={false}>
        <Icon name={kind} size="xl" tone={getIconTone(state, actionFailed)} />
      </View>
      <AppText accessibilityRole="header" variant="title">
        {t(titleKeys[kind])}
      </AppText>
      <AppText
        accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
        style={styles.centerText}
        tone={tone}
      >
        {description}
      </AppText>
      {state === 'checking' && (
        <ActivityIndicator
          accessibilityLabel={t('permissions.checking')}
          accessibilityRole="progressbar"
          color={theme.colors.action.primary}
        />
      )}
      {(action || onDismiss) && (
        <View style={styles.actions}>
          {action && (
            <Button
              loading={actionRunning || state === 'requesting'}
              onPress={() => {
                void runAction(action.callback);
              }}
            >
              {action.label}
            </Button>
          )}
          {onDismiss && (
            <Button onPress={onDismiss} variant="tertiary">
              {t('common.cancel')}
            </Button>
          )}
        </View>
      )}
    </Card>
  );
}

function getPrimaryAction({
  onOpenSettings,
  onRequest,
  onRetry,
  state,
  t,
}: Pick<
  PermissionGuideProps,
  'onOpenSettings' | 'onRequest' | 'onRetry' | 'state'
> & {
  t: ReturnType<typeof useLocalization>['t'];
}) {
  if ((state === 'requestable' || state === 'requesting') && onRequest) {
    return {
      callback: onRequest,
      label: t('permissions.allow'),
    };
  }

  if (state === 'blocked') {
    return {
      callback: onOpenSettings ?? Linking.openSettings,
      label: t('permissions.openSettings'),
    };
  }

  if (state === 'error' && onRetry) {
    return {
      callback: onRetry,
      label: t('common.retry'),
    };
  }

  return null;
}

function getStateTone(
  state: PermissionGuideState,
  actionFailed: boolean,
): 'danger' | 'secondary' | 'success' | 'warning' {
  if (actionFailed || state === 'error') return 'danger';
  if (state === 'blocked') return 'warning';
  if (state === 'granted') return 'success';

  return 'secondary';
}

function getIconTone(
  state: PermissionGuideState,
  actionFailed: boolean,
): 'brand' | 'danger' | 'success' | 'warning' {
  if (actionFailed || state === 'error') return 'danger';
  if (state === 'blocked') return 'warning';
  if (state === 'granted') return 'success';

  return 'brand';
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    gap: spacing.md,
  },
  centerText: {
    textAlign: 'center',
  },
});
