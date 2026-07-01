/**
 * 소비 통계 — 최근 6개월 지출 추이 막대 차트
 *
 * SVG 없이 View 높이만으로 막대를 그린다. 조회 월 막대는 진하게 강조한다.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { MonthlyTrendItem } from '@/types/report';
import { formatManwon } from '@/utils/formatCurrency';

interface MonthlyTrendChartProps {
  items: MonthlyTrendItem[];
}

// 막대 영역 최대 높이(px)
const MAX_BAR_HEIGHT = 120;

export function MonthlyTrendChart({ items }: MonthlyTrendChartProps) {
  // 가장 큰 지출액을 기준으로 막대 높이를 정규화
  const maxAmount = Math.max(...items.map((item) => item.amount), 1);

  return (
    <View style={styles.chart}>
      {items.map((item) => {
        const barHeight = Math.max((item.amount / maxAmount) * MAX_BAR_HEIGHT, 4);
        return (
          <View key={item.label} style={styles.column}>
            <Text style={[styles.amountLabel, item.isCurrent && styles.amountLabelCurrent]}>
              {formatManwon(item.amount)}
            </Text>
            <View
              style={[
                styles.bar,
                { height: barHeight },
                item.isCurrent ? styles.barCurrent : styles.barPast,
              ]}
            />
            <Text style={[styles.monthLabel, item.isCurrent && styles.monthLabelCurrent]}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_HEIGHT + 44,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  amountLabel: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },
  amountLabelCurrent: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  bar: {
    width: 26,
    borderRadius: 8,
  },
  barPast: {
    backgroundColor: colors.primaryLight,
  },
  barCurrent: {
    backgroundColor: colors.primary,
  },
  monthLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  monthLabelCurrent: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
});
