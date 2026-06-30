/**
 * 홈 화면 — 이번 달 요약 카드
 *
 * 사용 금액 / 예산 진행바 / 소진율 / 남은 예산을 보여준다.
 * 모든 값은 HomeSummary로 그대로 전달받아 표시만 한다 (계산은 useHomeCalendar에서 처리).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { HomeSummary } from '@/types/home';
import { formatComma, formatFullAmount } from '@/utils/formatCurrency';

interface SummaryCardProps {
  summary: HomeSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>이번 달 사용 금액</Text>
      <View style={styles.summaryAmountRow}>
        <View style={styles.summaryAmountLeft}>
          <Text style={styles.summaryAmountMain}>{formatComma(summary.totalExpense)}</Text>
          <Text style={styles.summaryAmountUnit}>원</Text>
        </View>
        <Text style={styles.summaryBudgetText}>/ {formatFullAmount(summary.budgetTotal)}</Text>
      </View>
      <View style={styles.summaryProgressTrack}>
        <View style={[styles.summaryProgressFill, { width: `${summary.usageRate}%` }]} />
      </View>

      {/* 소진율 / 남은 예산 — 톤을 낮춘 내부 패널로 구분 */}
      <View style={styles.summaryInnerPanel}>
        <View style={styles.usageRow}>
          <Text style={styles.usageLabel}>소진율</Text>
          <Text style={styles.usageValue}>{summary.usageRate}%</Text>
        </View>
        <View style={styles.remainingRow}>
          <Text style={styles.remainingLabel}>남은 예산</Text>
          <Text style={styles.remainingValue}>{formatFullAmount(summary.remaining)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  summaryAmountLeft: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  summaryAmountMain: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.background,
    lineHeight: 36,
  },
  summaryAmountUnit: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  summaryBudgetText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  summaryProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  summaryProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.background,
  },

  // ── 소진율/남은예산 내부 패널 ──
  summaryInnerPanel: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginTop: 4,
  },
  usageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  usageLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: 'rgba(255,255,255,0.85)',
  },
  usageValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.background,
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
  },
  remainingLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: 'rgba(255,255,255,0.85)',
  },
  remainingValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
});
