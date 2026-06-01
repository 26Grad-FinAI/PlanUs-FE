/**
 * 프로필 입력 화면 (온보딩 1단계) — Placeholder
 * TODO: 프로필 입력 폼 구현
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { OnboardingStackParamList } from '@/app/navigation/types';

type ProfileSetupNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'ProfileSetup'
>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupNavigationProp;
}

export function ProfileSetupScreen({ navigation }: ProfileSetupScreenProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
      <Text style={styles.title}>프로필 설정</Text>
      <Text style={styles.subtitle}>구현 예정 화면입니다</Text>
      <Button
        label="다음 (AI 예산 추천)"
        variant="primary"
        size="lg"
        fullWidth
        style={styles.button}
        onPress={() => navigation.navigate('BudgetRecommendation')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    gap: 12,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: 24,
  },
  button: { borderRadius: 12 },
});
