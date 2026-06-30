/**
 * 인증 상태 스토어 (Zustand)
 *
 * Context 대비 Zustand의 장점:
 * - Provider 감싸기 불필요 → App.tsx가 깔끔해짐
 * - 어느 컴포넌트에서든 import 하나로 바로 사용 가능
 * - 필요한 상태만 선택적으로 구독 → 불필요한 리렌더링 방지
 *
 * 관리 상태:
 * - isAuthenticated:        로그인 여부 → RootNavigator 스택 분기
 * - hasCompletedOnboarding: 프로필 입력 완료 여부 → Onboarding/Main 분기
 *
 * TODO: 추후 AsyncStorage + zustand/middleware의 persist 미들웨어로
 *       토큰을 영속화하면 앱 재시작 시 로그인 유지 구현 가능
 */

import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;

  /** 로그인 성공 후 호출 — RootNavigator가 자동으로 적절한 스택으로 전환 */
  signIn: (hasCompletedOnboarding: boolean) => void;

  /** 로그아웃 — Auth 스택으로 자동 전환 */
  signOut: () => void;

  /** 온보딩(프로필 입력) 완료 후 호출 — Main 스택으로 자동 전환 */
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 개발 편의를 위해 로그인 + 온보딩이 완료된 상태로 시작 (항상 메인 탭에서 시작)
  // TODO: 실제 로그인 연동 시 false로 되돌리고 로그인 화면부터 시작하도록 변경
  isAuthenticated: true,
  hasCompletedOnboarding: true,

  signIn: (hasCompletedOnboarding: boolean) =>
    set({ isAuthenticated: true, hasCompletedOnboarding }),

  signOut: () => set({ isAuthenticated: false, hasCompletedOnboarding: false }),
  // TODO: AsyncStorage.removeItem('accessToken') 추가

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
