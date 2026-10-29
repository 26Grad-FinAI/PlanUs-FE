/** 프로필 입력 → 예산 산출 → 추천 확인. 확정 후 루트가 메인 탭으로 전환한다. */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingStackParamList } from './types';
import { ProfileSetupScreen } from '@/screens/profile/ProfileSetupScreen';
import { BudgetRecommendationScreen } from '@/screens/budget/BudgetRecommendationScreen';
import { BudgetLoadingScreen } from '@/screens/budget/BudgetLoadingScreen';

const Onboarding = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Onboarding.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Onboarding.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Onboarding.Screen name="BudgetLoading" component={BudgetLoadingScreen} />
      <Onboarding.Screen name="BudgetRecommendation" component={BudgetRecommendationScreen} />
    </Onboarding.Navigator>
  );
}
