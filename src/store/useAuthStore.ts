import { create } from 'zustand';
import { useBudgetStore } from '@/store/useBudgetStore';
import type { AuthResponse, AuthTokens } from '@/types/auth';

interface AuthState {
  session: (AuthTokens & { id: symbol }) | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,

  signIn: ({ accessToken, refreshToken, profileCompleted }) =>
    set({
      session: { id: Symbol(), accessToken, refreshToken },
      isAuthenticated: true,
      hasCompletedOnboarding: profileCompleted,
    }),

  signOut: () => {
    useBudgetStore.getState().reset();
    set({ session: null, isAuthenticated: false, hasCompletedOnboarding: false });
  },

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
