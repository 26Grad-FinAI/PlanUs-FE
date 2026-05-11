/**
 * 인증 스택 네비게이터
 *
 * 포함 화면:
 * - Login  (로그인)
 * - Signup (회원가입)
 *
 * 인증되지 않은 사용자에게 보여지는 네비게이션 영역
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { AuthStackParamList } from './types';
const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
