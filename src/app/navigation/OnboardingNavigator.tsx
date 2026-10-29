/**
 * 온보딩 스택 네비게이터
 *
 * 흐름: ProfileSetup → BudgetRecommendation
 *
 * BudgetRecommendation 화면에서 completeOnboarding()을 호출하면
 * RootNavigator가 자동으로 Main 탭으로 전환된다.
 */

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
