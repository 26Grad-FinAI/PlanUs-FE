import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { SavedAuthSession } from '@/types/auth';

const supportsSecureStore = Platform.OS === 'ios' || Platform.OS === 'android';
let pendingWrite = Promise.resolve();

function queueWrite(write: () => Promise<void>) {
  if (!supportsSecureStore) return;
  pendingWrite = pendingWrite.then(write).catch(() => {
    if (__DEV__) console.warn('로그인 상태를 기기에 저장하지 못했어요.');
  });
}

export const authSessionStorage: PersistStorage<SavedAuthSession> = {
  async getItem(key) {
    if (!supportsSecureStore) return null;
    await pendingWrite;
    const saved = await SecureStore.getItemAsync(key);
    return saved ? (JSON.parse(saved) as StorageValue<SavedAuthSession>) : null;
  },
  setItem(key, value) {
    return value.state.session
      ? queueWrite(() => SecureStore.setItemAsync(key, JSON.stringify(value)))
      : queueWrite(() => SecureStore.deleteItemAsync(key));
  },
  removeItem(key) {
    return queueWrite(() => SecureStore.deleteItemAsync(key));
  },
};
