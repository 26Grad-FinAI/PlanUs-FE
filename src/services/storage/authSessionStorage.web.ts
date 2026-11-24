import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { SavedAuthSession } from '@/types/auth';

// 탭이나 브라우저를 다시 열어도 저장된 로그인 상태를 복원한다.
function withLocalStorage<T>(operation: (storage: Storage) => T, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    return operation(window.localStorage);
  } catch {
    if (__DEV__) console.warn('로그인 상태를 브라우저에 저장하지 못했어요.');
    return fallback;
  }
}

export const authSessionStorage: PersistStorage<SavedAuthSession> = {
  getItem(key) {
    return withLocalStorage((storage) => {
      const saved = storage.getItem(key);
      if (!saved) return null;
      try {
        return JSON.parse(saved) as StorageValue<SavedAuthSession>;
      } catch {
        storage.removeItem(key);
        return null;
      }
    }, null);
  },
  setItem(key, value) {
    withLocalStorage((storage) => {
      if (value.state.session) storage.setItem(key, JSON.stringify(value));
      else storage.removeItem(key);
    }, undefined);
  },
  removeItem(key) {
    withLocalStorage((storage) => storage.removeItem(key), undefined);
  },
};
