/**
 * React Navigation 스택 파라미터 타입 정의
 *
 * 각 스택/탭에 속한 화면과 그 화면으로 이동할 때 전달하는 파라미터를 명시한다.
 * undefined: 파라미터 없음
 */

// 인증 스택 (로그인, 회원가입)
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// 온보딩 스택 (프로필 입력 → AI 예산 추천)
export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  BudgetRecommendation: undefined;
};

// 메인 탭 (홈, 리포트, 소비기록 입력, AI분석, 설정)
export type MainTabParamList = {
  HomeCalendar: undefined;
  MonthlyReport: undefined;
  RecordAdd: undefined;
  AIAnalysis: undefined;
  Settings: undefined;
};

// 루트 네비게이터 파라미터
export type RootStackParamList = {
  Auth: undefined; // AuthStack
  Onboarding: undefined; // OnboardingStack
  Main: undefined; // MainTab
};
