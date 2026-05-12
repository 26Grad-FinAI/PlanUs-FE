/**
 * 월간 리포트 화면 (Placeholder)
 *
 * 추후 카테고리별 지출 비율 차트, 월별 비교 그래프, 지출 요약 등을 구현할 화면
 * 현재는 네비게이션 확인용 임시 화면으로만 동작한다.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

export function MonthlyReportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 화면 제목 */}
        <Text style={styles.emoji}>📊</Text>
        <Text style={styles.title}>통계 화면</Text>
        <Text style={styles.subtitle}>월간 리포트 화면 (추후 구현 예정)</Text>
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
