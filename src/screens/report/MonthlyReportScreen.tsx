/** 월별 조회 상태를 표시하고 통계 섹션을 시안 순서대로 배치한다. */
import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { MonthNavigator } from '@/components/common/MonthNavigator';
import { Text } from '@/components/common/Text';
import { CategoryDonut } from '@/components/domain/report/CategoryDonut';
import { MonthlyTrendChart } from '@/components/domain/report/MonthlyTrendChart';
import { BudgetComparison } from '@/components/domain/report/BudgetComparison';
import { PeerComparison } from '@/components/domain/report/PeerComparison';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { fontSize } from '@/constants/typography';
import { useMonthlyReport } from '@/hooks/useMonthlyReport';
import { formatFullAmount } from '@/utils/formatCurrency';

export function MonthlyReportScreen() {
  const { width, fontScale } = useWindowDimensions();
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
    peersExpanded,
    togglePeers,
  } = useMonthlyReport();
  // 큰 글자나 긴 금액은 축약하지 않고 요약을 세로로 배치한다.
  const stackSummary =
    fontScale > 1.3 ||
    [report?.totalExpense, report?.totalIncome].some(
      (amount) => formatFullAmount(amount ?? 0).length > 12,
    );
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
            <View style={[styles.summary, stackSummary && styles.stackedSummary]}>
              <View style={[styles.summaryColumn, stackSummary && styles.stackedColumn]}>
                <Text variant="caption" style={styles.muted}>
                  지출
                </Text>
                <Text variant="title" style={width < 360 && styles.compactAmount}>
                  {formatFullAmount(report.totalExpense)}
                </Text>
              </View>
              <View
                style={[
                  styles.summaryColumn,
                  stackSummary ? styles.stackedIncome : styles.incomeColumn,
                ]}
              >
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
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <Text variant="section" accessibilityRole="header">
                  내 또래와 소비 비교
                </Text>
                <Text variant="caption" style={styles.muted}>
                  나이·소득·환경이 비슷한 사람들의 소비 평균이에요
                </Text>
              </View>
              <PeerComparison
                items={report.peerComparison}
                expanded={peersExpanded}
                onToggle={togglePeers}
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
  stackedSummary: { flexDirection: 'column' },
  stackedColumn: { flex: 0 },
  compactAmount: { fontSize: fontSize.xl, lineHeight: 28 },
  stackedIncome: {
    flex: 0,
    borderTopWidth: metrics.hairline,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
  },
  incomeColumn: {
    borderLeftWidth: metrics.hairline,
    borderLeftColor: colors.border,
    paddingLeft: spacing.xl,
  },
  section: { gap: spacing.md },
  sectionHeading: { gap: spacing.xs },
  notice: { minHeight: 168, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  muted: { color: colors.textTertiary },
});
