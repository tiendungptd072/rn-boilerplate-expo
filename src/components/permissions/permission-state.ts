export type PermissionGuideState =
  | 'blocked'
  | 'checking'
  | 'error'
  | 'granted'
  | 'requestable'
  | 'requesting'
  | 'unsupported';

export type PermissionResponseLike = {
  canAskAgain: boolean;
  granted: boolean;
  status: 'denied' | 'granted' | 'undetermined';
};

type ResolvePermissionStateInput = {
  hasError?: boolean;
  isChecking?: boolean;
  isRequesting?: boolean;
  isUnsupported?: boolean;
  response?: PermissionResponseLike | null;
};

/** Maps Expo-compatible permission data to UI state without importing a native module. */
export function resolvePermissionState({
  hasError = false,
  isChecking = false,
  isRequesting = false,
  isUnsupported = false,
  response,
}: ResolvePermissionStateInput): PermissionGuideState {
  if (isUnsupported) return 'unsupported';
  if (hasError) return 'error';
  if (isRequesting) return 'requesting';
  if (isChecking || !response) return 'checking';
  if (response.granted || response.status === 'granted') return 'granted';
  if (response.status === 'undetermined' || response.canAskAgain) {
    return 'requestable';
  }

  return 'blocked';
}
