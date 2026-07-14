import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

/** Shared MMKV adapter for Zustand's persist middleware. */
export function createMMKVStorage(id: string): StateStorage {
  const storage = createMMKV({ id });

  return {
    getItem: (name) => storage.getString(name) ?? null,
    setItem: (name, value) => storage.set(name, value),
    removeItem: (name) => storage.remove(name),
  };
}

export const appStorage = createMMKVStorage('app-storage');
