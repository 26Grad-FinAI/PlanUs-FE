/**
 * 소비 통계 화면
 *
 * 구성:
 * - 월 선택 (이전/다음)
 * - 이번 달 총 지출 카드
 * - 카테고리별 비중 (도넛 차트 + 범례)
 * - 최근 6개월 추이 (막대 차트)
 * - 카테고리별 예산 대비 실제 지출 비교
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { useMonthlyReport } from '@/hooks/useMonthlyReport';
import { formatFullAmount } from '@/utils/formatCurrency';
import { CategoryDonut } from '@/components/domain/report/CategoryDonut';
import { MonthlyTrendChart } from '@/components/domain/report/MonthlyTrendChart';
import { BudgetComparison } from '@/components/domain/report/BudgetComparison';

export function MonthlyReportScreen() {
  const { monthCursor, report, handlePrevMonth, handleNextMonth } = useMonthlyReport();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 헤더 ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>소비 통계</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 월 선택 ── */}
        <View style={styles.monthNavRow}>
          <TouchableOpacity
            onPress={handlePrevMonth}
            style={styles.monthNavButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="이전 달"
          >
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.monthNavTitle}>
            {monthCursor.getFullYear()}년 {monthCursor.getMonth() + 1}월
          </Text>
          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.monthNavButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="다음 달"
          >
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {report && (
          <>
            {/* ── 이번 달 총 지출 ── */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>이번 달 총 지출</Text>
              <Text style={styles.totalAmount}>{formatFullAmount(report.totalExpense)}</Text>
            </View>

            {/* ── 카테고리별 비중 ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>카테고리별 비중</Text>
              <View style={styles.card}>
                <CategoryDonut items={report.categoryBreakdown} />
              </View>
            </View>

            {/* ── 최근 6개월 추이 ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>최근 6개월 추이</Text>
              <View style={styles.card}>
                <MonthlyTrendChart items={report.monthlyTrend} />
              </View>
            </View>

            {/* ── 예산 대비 지출 ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>예산 대비 지출</Text>
              <BudgetComparison
                items={report.budgetComparison}
                totalBudget={report.totalBudget}
                totalExpense={report.totalExpense}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, gap: 20 },

  // ── 헤더 ──
  header: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: colors.border },

  // ── 월 선택 ──
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  monthNavButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  // ── 총 지출 카드 ──
  totalCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    gap: 6,
  },
  totalLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },
  totalAmount: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  // ── 섹션 ──
  section: { gap: 12 },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
  },
});
