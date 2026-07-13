import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/** Uses a stable light server snapshot to prevent color-scheme hydration mismatches on web. */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
