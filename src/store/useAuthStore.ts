import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authSessionStorage } from '@/services/storage/authSessionStorage';
import { useBudgetStore } from '@/store/useBudgetStore';
import type { AuthResponse, SavedAuthSession } from '@/types/auth';

interface AuthState {
  session: (NonNullable<SavedAuthSession['session']> & { id: symbol }) | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      signIn: ({ userId, accessToken, refreshToken, profileCompleted }) =>
        set({
          session: { id: Symbol(), userId, accessToken, refreshToken },
          isAuthenticated: true,
          hasCompletedOnboarding: profileCompleted,
        }),

      signOut: () => {
        useBudgetStore.getState().reset();
        set({ session: null, isAuthenticated: false, hasCompletedOnboarding: false });
      },

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'planus.auth.session',
      storage: authSessionStorage,
      skipHydration: true,
      partialize: ({ session, hasCompletedOnboarding }) => ({
        session: session && {
          userId: session.userId,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        },
        hasCompletedOnboarding,
      }),
      merge: (stored, current) => {
        const saved = stored as SavedAuthSession | undefined;
        const session = saved?.session;
        if (
          current.session ||
          !session ||
          !Number.isSafeInteger(session.userId) ||
          typeof session.accessToken !== 'string' ||
          !session.accessToken ||
          typeof session.refreshToken !== 'string' ||
          !session.refreshToken
        ) {
          return current;
        }
        return {
          ...current,
          session: { ...session, id: Symbol() },
          isAuthenticated: true,
          hasCompletedOnboarding: saved?.hasCompletedOnboarding === true,
        };
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error && __DEV__) console.warn('저장된 로그인 상태를 불러오지 못했어요.');
      },
    },
  ),
);
