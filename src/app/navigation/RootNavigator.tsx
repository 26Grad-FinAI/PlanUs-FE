/**
 * 루트 네비게이터
 *
 * 인증 상태(isAuthenticated, hasCompletedOnboarding)에 따라
 * 렌더링할 스택을 결정한다.
 *
 * 흐름:
 *   [미인증]         → Auth 스택 (로그인/회원가입)
 *   [인증 + 온보딩X] → Onboarding 스택 (프로필 입력 → AI 예산)
 *   [인증 + 온보딩O] → Main 스택 (홈 캘린더, 통계 등)
 *
 * React Navigation은 스택이 바뀌면 자동으로 화면을 전환한다.
 * 즉, signIn() 또는 signOut()이 호출되면 별도의 navigate 없이
 * 이 파일의 조건문 분기가 자동으로 올바른 스택을 렌더링한다.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/store/useAuthStore';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';

const Root = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isAuthenticated ? (
        // 미인증 상태 → 로그인/회원가입 화면
        <Root.Screen name="Auth" component={AuthNavigator} />
      ) : !hasCompletedOnboarding ? (
        // 인증 완료, 온보딩 미완료 → 프로필 입력 → AI 예산 추천 화면
        <Root.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        // 인증 + 온보딩 완료 → 메인 탭 화면
        <Root.Screen name="Main" component={MainTabNavigator} />
      )}
    </Root.Navigator>
  );
}
