/**
 * 마이페이지 화면 (Placeholder)
 *
 * 추후 프로필 정보, 예산 설정, 알림 설정, 로그아웃 등을 구현할 화면
 * 현재는 네비게이션 확인용 임시 화면으로만 동작한다.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

export function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 화면 제목 */}
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>마이페이지 화면 (추후 구현 예정)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
});
