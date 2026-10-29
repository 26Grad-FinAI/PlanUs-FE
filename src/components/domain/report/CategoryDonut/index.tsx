/** 금액으로 조각 길이를 계산해 표시 비율의 반올림 오차를 줄인다. */
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { REPORT_CATEGORY_COLOR } from '@/constants/report';
import { CategoryBreakdownItem } from '@/types/report';

interface CategoryDonutProps {
  items: CategoryBreakdownItem[];
}

const SIZE = 168;
const STROKE_WIDTH = 26;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

export function CategoryDonut({ items }: CategoryDonutProps) {
  const { fontScale } = useWindowDimensions();
  const spending = items.filter((item) => item.amount > 0);
  const total = spending.reduce((sum, item) => sum + item.amount, 0);
  const topItem = spending
    .filter((item) => item.category !== 'remaining')
    .reduce<
      CategoryBreakdownItem | undefined
    >((largest, item) => (!largest || item.amount > largest.amount ? item : largest), undefined);
  let accumulated = 0;
  const segments: { item: CategoryBreakdownItem; dash: number; offset: number }[] = [];
  for (const item of spending) {
    const length = (item.amount / total) * CIRCUMFERENCE;
    const gap = spending.length > 1 ? Math.min(GAP, length / 4) : 0;
    segments.push({ item, dash: length - gap, offset: -accumulated });
    accumulated += length;
  }

  return (
    <View style={styles.container}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={
          topItem ? `가장 큰 소비는 ${topItem.label}, ${topItem.ratio}%` : '소비 내역이 없어요'
        }
        style={styles.chart}
      >
        <Svg width={SIZE} height={SIZE} accessible={false} aria-hidden>
          <G rotation={-90} origin={`${SIZE / 2}, ${SIZE / 2}`}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={total > 0 ? colors.backgroundAlt : colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {segments.map(({ item, dash, offset }) => (
              <Circle
                key={item.category}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={REPORT_CATEGORY_COLOR[item.category]}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                strokeDashoffset={offset}
                fill="none"
              />
            ))}
          </G>
        </Svg>
        <View style={styles.center} pointerEvents="none" aria-hidden accessibilityElementsHidden>
          {topItem ? (
            <>
              <Text variant="title" maxFontSizeMultiplier={1.5}>
                {topItem.ratio}%
              </Text>
              <Text variant="caption" style={styles.muted} maxFontSizeMultiplier={1.5}>
                {topItem.label}
              </Text>
            </>
          ) : (
            <Text variant="caption" style={styles.emptyLabel} maxFontSizeMultiplier={1.5}>
              소비 내역이 없어요
            </Text>
          )}
        </View>
      </View>
      {spending.length > 0 && (
        <View style={styles.legend}>
          {spending.map((item) => (
            <View
              key={item.category}
              style={[styles.legendItem, fontScale > 1.3 && styles.wideLegend]}
            >
              <View
                style={[styles.dot, { backgroundColor: REPORT_CATEGORY_COLOR[item.category] }]}
              />
              <Text variant="caption" style={styles.legendLabel}>
                {item.label}
              </Text>
              <Text variant="caption" weight="semibold">
                {item.ratio}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xl },
  chart: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: STROKE_WIDTH + spacing.sm,
  },
  muted: { color: colors.textTertiary, textAlign: 'center' },
  emptyLabel: { color: colors.textTertiary, textAlign: 'center' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', rowGap: spacing.sm },
  legendItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  wideLegend: { width: '100%' },
  dot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  legendLabel: { flex: 1, color: colors.textTertiary },
});
