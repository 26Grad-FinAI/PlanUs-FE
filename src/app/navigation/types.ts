/**
 * React Navigation 스택 파라미터 타입 정의
 *
 * 각 스택/탭에 속한 화면과 그 화면으로 이동할 때 전달하는 파라미터를 명시한다.
 * undefined: 파라미터 없음
 */

import { UserProfile } from '@/types/profile';
import { AIBudgetRecommendation } from '@/types/budget';
import { NavigatorScreenParams } from '@react-navigation/native';

// 인증 스택 (로그인, 회원가입)
export type AuthStackParamList = {
  Login: { email?: string } | undefined;
  Signup: undefined;
};

// 온보딩 스택 (프로필 입력 → AI 예산 추천)
export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  BudgetLoading: { profile: UserProfile; year: number; month: number };
  BudgetRecommendation: {
    profile: UserProfile;
    year: number;
    month: number;
    recommendation: AIBudgetRecommendation;
  };
};

// 메인 탭. 기록 폼은 루트 스택에 두어 탭 이동과 입력 수명을 분리한다.
export type MainTabParamList = {
  HomeCalendar: undefined;
  MonthlyReport: undefined;
  AIAnalysis: undefined;
  Settings: undefined;
};

// 루트 네비게이터 파라미터
export type RootStackParamList = {
  Auth: undefined; // AuthStack
  Onboarding: undefined; // OnboardingStack
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  RecordDetail: { recordId: string };
  RecordAdd: undefined;
  RecordEdit: { recordId: string };
};
