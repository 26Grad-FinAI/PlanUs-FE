/** 월별 조회 상태를 표시하고 통계 섹션을 시안 순서대로 배치한다. */
import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { MonthNavigator } from '@/components/common/MonthNavigator';
import { Text } from '@/components/common/Text';
import { CategoryDonut } from '@/components/domain/report/CategoryDonut';
import { MonthlyTrendChart } from '@/components/domain/report/MonthlyTrendChart';
import { BudgetComparison } from '@/components/domain/report/BudgetComparison';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { useMonthlyReport } from '@/hooks/useMonthlyReport';
import { formatFullAmount } from '@/utils/formatCurrency';

export function MonthlyReportScreen() {
  const {
    monthCursor,
    report,
    error,
    isLoading,
    retry,
    handlePrevMonth,
    handleNextMonth,
    budgetExpanded,
    toggleBudget,
  } = useMonthlyReport();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="소비 통계" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.month}>
          <MonthNavigator
            year={monthCursor.getFullYear()}
            month={monthCursor.getMonth() + 1}
            onPrevious={handlePrevMonth}
            onNext={handleNextMonth}
          />
        </View>
        {isLoading && (
          <View style={styles.notice} accessibilityLiveRegion="polite" aria-busy>
            <ActivityIndicator color={colors.primary} accessibilityLabel="소비 통계 조회 중" />
            <Text variant="label" style={styles.muted}>
              통계를 불러오고 있어요.
            </Text>
          </View>
        )}
        {error && (
          <View style={styles.notice} accessibilityLiveRegion="polite">
            <Text style={styles.muted}>{error}</Text>
            <Button label="다시 시도" onPress={retry} variant="ghost" size="sm" />
          </View>
        )}
        {report && (
          <>
            <View style={styles.summary}>
              <View style={styles.summaryColumn}>
                <Text variant="caption" style={styles.muted}>
                  지출
                </Text>
                <Text variant="title">{formatFullAmount(report.totalExpense)}</Text>
              </View>
              <View style={[styles.summaryColumn, styles.incomeColumn]}>
                <Text variant="caption" style={styles.muted}>
                  수입
                </Text>
                <Text variant="button" weight="semibold" style={styles.muted}>
                  {formatFullAmount(report.totalIncome)}
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text variant="section" accessibilityRole="header">
                카테고리별 비중
              </Text>
              <Card>
                <CategoryDonut items={report.categoryBreakdown} />
              </Card>
            </View>
            <View style={styles.section}>
              <Text variant="section" accessibilityRole="header">
                예산 대비 소비
              </Text>
              <BudgetComparison
                items={report.budgetComparison}
                totalBudget={report.totalBudget}
                totalExpense={report.totalExpense}
                expanded={budgetExpanded}
                onToggle={toggleBudget}
              />
            </View>
            <View style={styles.section}>
              <Text variant="section" accessibilityRole="header">
                최근 6개월 소비 추이
              </Text>
              <Card>
                <MonthlyTrendChart items={report.monthlyTrend} />
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: metrics.contentMax,
    alignSelf: 'center',
    paddingHorizontal: spacing.page,
    paddingTop: spacing.sm,
    paddingBottom: spacing.huge,
    gap: spacing.section,
  },
  month: { width: '100%', maxWidth: 240, alignSelf: 'center' },
  summary: {
    flexDirection: 'row',
    paddingBottom: spacing.xxl,
    borderBottomWidth: metrics.hairline,
    borderBottomColor: colors.border,
    gap: spacing.xl,
  },
  summaryColumn: { flex: 1, justifyContent: 'center', gap: spacing.xs },
  incomeColumn: {
    borderLeftWidth: metrics.hairline,
    borderLeftColor: colors.border,
    paddingLeft: spacing.xl,
  },
  section: { gap: spacing.md },
  notice: { minHeight: 168, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  muted: { color: colors.textTertiary },
});
