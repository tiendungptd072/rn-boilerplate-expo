import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  configureApiAuth,
  setApiAccessToken,
} from '@/lib/api-client';

import { getStoredSession, storeSession } from './session-storage';

type SessionContextValue = {
  isLoading: boolean;
  session: string | null;
  signIn: (session: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/** Restores and exposes the persisted authentication session. */
export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getStoredSession()
      .then((storedSession) => {
        if (active) {
          setApiAccessToken(storedSession);
          setSession(storedSession);
        }
      })
      .catch(() => {
        if (active) {
          setApiAccessToken(null);
          setSession(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    configureApiAuth({
      onUnauthorized: () => {
        setSession(null);
        return storeSession(null);
      },
    });

    return () => configureApiAuth({ onUnauthorized: undefined });
  }, []);

  const signIn = useCallback(async (nextSession: string) => {
    if (!nextSession) throw new Error('A non-empty session is required');

    await storeSession(nextSession);
    setApiAccessToken(nextSession);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(async () => {
    await storeSession(null);
    setApiAccessToken(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ isLoading, session, signIn, signOut }),
    [isLoading, session, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Returns the current authentication session and session actions. */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}
