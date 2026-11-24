import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { SavedAuthSession } from '@/types/auth';

// 새로고침 시 로그인 상태를 복원하고, 탭을 닫으면 세션을 종료한다.
function withSessionStorage<T>(operation: (storage: Storage) => T, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    return operation(window.sessionStorage);
  } catch {
    if (__DEV__) console.warn('로그인 상태를 브라우저에 저장하지 못했어요.');
    return fallback;
  }
}

export const authSessionStorage: PersistStorage<SavedAuthSession> = {
  getItem(key) {
    return withSessionStorage((storage) => {
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
    withSessionStorage((storage) => {
      if (value.state.session) storage.setItem(key, JSON.stringify(value));
      else storage.removeItem(key);
    }, undefined);
  },
  removeItem(key) {
    withSessionStorage((storage) => storage.removeItem(key), undefined);
  },
};
