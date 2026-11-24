/** 선택 월까지의 여섯 달을 공통 금액 척도로 표시한다. */
import React from 'react';
import { Animated, ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/layout';
import { fontSize } from '@/constants/typography';
import { MonthlyTrendItem } from '@/types/report';
import { formatFullAmount } from '@/utils/formatCurrency';

interface MonthlyTrendChartProps {
  items: MonthlyTrendItem[];
  fillProgress?: Animated.Value;
}

const MAX_BAR_HEIGHT = 120;

function formatTrendAmount(amount: number) {
  if (amount === 0) return '0원';
  if (amount < 10000) return '1만 미만';
  return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만`;
}

export function MonthlyTrendChart({ items, fillProgress }: MonthlyTrendChartProps) {
  const { fontScale } = useWindowDimensions();
  const maxAmount = Math.max(...items.map((item) => item.amount), 1);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chart}
    >
      {items.map((item) => (
        <View
          key={item.label}
          accessible
          accessibilityLabel={`${item.label} 소비 ${formatFullAmount(item.amount)}${item.isCurrent ? ', 선택한 달' : ''}`}
          style={[styles.column, { minWidth: 44 * fontScale }]}
        >
          <View
            style={[styles.barArea, { minHeight: MAX_BAR_HEIGHT + 28 * fontScale + spacing.sm }]}
          >
            <Text
              variant="caption"
              weight={item.isCurrent ? 'bold' : 'medium'}
              style={[styles.amount, item.isCurrent && styles.highlight]}
            >
              {formatTrendAmount(item.amount)}
            </Text>
            <Animated.View
              style={[
                styles.bar,
                { height: (Math.max(0, item.amount) / maxAmount) * MAX_BAR_HEIGHT },
                item.isCurrent && styles.currentBar,
                fillProgress && { transform: [{ scaleY: fillProgress }] },
              ]}
            />
          </View>
          <Text
            variant="caption"
            weight={item.isCurrent ? 'semibold' : 'regular'}
            style={!item.isCurrent && styles.muted}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chart: { flexGrow: 1, alignItems: 'flex-end' },
  column: { flex: 1, alignItems: 'center', gap: spacing.sm },
  barArea: { justifyContent: 'flex-end', alignItems: 'center', gap: spacing.sm, width: '100%' },
  amount: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  highlight: { color: colors.primaryDark },
  bar: {
    width: 26,
    borderRadius: radius.input,
    backgroundColor: colors.primaryLight,
    transformOrigin: 'center bottom',
  },
  currentBar: { backgroundColor: colors.primary },
  muted: { color: colors.textTertiary },
});
