import { createContext, useContext, useState, type PropsWithChildren } from 'react';

const AppReadyContext = createContext<boolean | null>(null);
const MarkAppReadyContext = createContext<(() => void) | null>(null);

/**
 * Tracks whether the custom splash overlay has finished, so screens mounted
 * underneath it (e.g. the initial tab) can defer entrance animations that
 * would otherwise play out invisibly while the splash still covers them.
 */
export function AppReadyProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  return (
    <AppReadyContext.Provider value={ready}>
      <MarkAppReadyContext.Provider value={() => setReady(true)}>
        {children}
      </MarkAppReadyContext.Provider>
    </AppReadyContext.Provider>
  );
}

/** True once the splash overlay has fully disappeared. */
export function useAppReady(): boolean {
  const ready = useContext(AppReadyContext);
  if (ready === null) throw new Error('useAppReady must be used within AppReadyProvider');
  return ready;
}

/** @throws Error when called outside AppReadyProvider. */
export function useMarkAppReady(): () => void {
  const markReady = useContext(MarkAppReadyContext);
  if (!markReady) throw new Error('useMarkAppReady must be used within AppReadyProvider');
  return markReady;
}
