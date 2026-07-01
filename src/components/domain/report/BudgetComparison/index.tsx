/**
 * 소비 통계 — 카테고리별 예산 대비 실제 지출 비교
 *
 * (기존 디자인의 "또래 비교"를 대체)
 * 카테고리 예산을 100% 기준으로 두고, 실제 지출이 차지한 만큼을 막대 하나로 표시한다.
 * 예산을 초과하면 막대가 가득 차고 색이 빨강으로 바뀐다.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { CATEGORY_META } from '@/constants/categories';
import { BudgetComparisonItem } from '@/types/report';
import { formatFullAmount } from '@/utils/formatCurrency';

interface BudgetComparisonProps {
  items: BudgetComparisonItem[];
  totalBudget: number;
  totalExpense: number;
}

// 예산 대비 실제 지출이 차지한 비율(0~100%) — 초과 시 100%로 막힘
function fillWidth(budget: number, actual: number): string {
  if (budget <= 0) return '0%';
  return `${Math.min((actual / budget) * 100, 100)}%`;
}

// 예산(트랙) 대비 지출(채움) 막대 하나 + 금액 표기
function BudgetBar({ budget, actual }: { budget: number; actual: number }) {
  const isOver = actual > budget;

  return (
    <>
      <View style={styles.amountRow}>
        <Text style={[styles.actualAmount, isOver && styles.actualAmountOver]}>
          {formatFullAmount(actual)}
        </Text>
        <Text style={styles.budgetAmount}>예산 {formatFullAmount(budget)}</Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: fillWidth(budget, actual) },
            isOver ? styles.barFillOver : styles.barFillUnder,
          ]}
        />
      </View>
    </>
  );
}

export function BudgetComparison({ items, totalBudget, totalExpense }: BudgetComparisonProps) {
  return (
    <View style={styles.container}>
      {/* 총 예산 vs 총 지출 요약 카드 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>이번 달 예산</Text>
        <BudgetBar budget={totalBudget} actual={totalExpense} />
      </View>

      {/* 카테고리별 예산 대비 지출 */}
      {items.map((item) => (
        <View key={item.category} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <Ionicons
              name={CATEGORY_META[item.category].icon}
              size={18}
              color={colors.textSecondary}
            />
            <Text style={styles.categoryLabel}>{item.label}</Text>
          </View>
          <BudgetBar budget={item.budget} actual={item.actual} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },

  // ── 총 예산 요약 카드 ──
  summaryCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  summaryTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },

  // ── 카테고리 카드 ──
  categoryCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // ── 금액 표기 ──
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  actualAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  actualAmountOver: {
    color: colors.expense,
  },
  budgetAmount: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },

  // ── 예산/지출 막대 ──
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barFillUnder: { backgroundColor: colors.primary },
  barFillOver: { backgroundColor: colors.expense },
});
