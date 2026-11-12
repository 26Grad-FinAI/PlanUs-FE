/** 금액으로 조각 길이를 계산해 표시 비율의 반올림 오차를 줄인다. */
import React, { useState } from 'react';
import { Pressable, View, StyleSheet, useWindowDimensions } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { REPORT_CATEGORY_COLOR } from '@/constants/report';
import type { CategoryBreakdownItem, CategorySpendingItem } from '@/types/report';
import { formatFullAmount } from '@/utils/formatCurrency';

interface CategoryDonutProps {
  items: CategorySpendingItem[];
  totalExpense: number;
}

const SIZE = 168;
const STROKE_WIDTH = 26;
const SELECTED_STROKE_WIDTH = 30;
const RADIUS = (SIZE - SELECTED_STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;
const VISIBLE_CATEGORY_COUNT = 5;

function buildBreakdown(items: CategorySpendingItem[], totalExpense: number) {
  if (totalExpense <= 0) return [];

  const ranked = items.filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  const breakdown: CategoryBreakdownItem[] = ranked
    .slice(0, VISIBLE_CATEGORY_COUNT)
    .map((item) => ({ ...item, ratio: Math.round(item.ratio) }));
  const remaining = ranked
    .slice(VISIBLE_CATEGORY_COUNT)
    .reduce((sum, item) => sum + item.amount, 0);
  if (remaining > 0) {
    breakdown.push({
      category: 'remaining',
      label: '그 외',
      amount: remaining,
      ratio: Math.round((remaining / totalExpense) * 100),
    });
  }
  return breakdown;
}

export function CategoryDonut({ items, totalExpense }: CategoryDonutProps) {
  const { fontScale } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryBreakdownItem['category'] | null
  >(null);
  const spending = buildBreakdown(items, totalExpense);
  const selectedItem = spending.find((item) => item.category === selectedCategory);
  const total = spending.reduce((sum, item) => sum + item.amount, 0);
  const topItem = spending[0];
  let accumulated = 0;
  const segments: { item: CategoryBreakdownItem; dash: number; start: number }[] = [];
  for (const item of spending) {
    const length = (item.amount / total) * CIRCUMFERENCE;
    const gap = spending.length > 1 ? Math.min(GAP, length / 4) : 0;
    segments.push({ item, dash: length - gap, start: accumulated });
    accumulated += length;
  }

  function toggleCategory(category: CategoryBreakdownItem['category']) {
    if (category === 'remaining') return;
    setSelectedCategory((previous) => (previous === category ? null : category));
  }

  function selectSegment({ nativeEvent }: GestureResponderEvent) {
    const event = nativeEvent as typeof nativeEvent & { offsetX?: number; offsetY?: number };
    const locationX = event.locationX ?? event.offsetX;
    const locationY = event.locationY ?? event.offsetY;
    if (locationX == null || locationY == null) return;

    const x = locationX - SIZE / 2;
    const y = locationY - SIZE / 2;
    const distance = Math.hypot(x, y);
    const fullTurn = 2 * Math.PI;
    const angle = (Math.atan2(x, -y) + fullTurn) % fullTurn;
    const position = angle * RADIUS;
    const segment = segments.find(
      ({ start, dash }) => position >= start && position < start + dash,
    );
    if (!segment) return;

    const strokeWidth = segment.item === selectedItem ? SELECTED_STROKE_WIDTH : STROKE_WIDTH;
    if (Math.abs(distance - RADIUS) <= strokeWidth / 2) toggleCategory(segment.item.category);
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessible={false}
        focusable={false}
        tabIndex={-1}
        onPress={selectSegment}
        disabled={segments.length === 0}
        style={styles.chart}
      >
        <Svg width={SIZE} height={SIZE} pointerEvents="none" accessible={false} aria-hidden>
          <G rotation={-90} origin={`${SIZE / 2}, ${SIZE / 2}`}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={total > 0 ? colors.backgroundAlt : colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {segments.map(({ item, dash, start }) => (
              <Circle
                key={item.category}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={REPORT_CATEGORY_COLOR[item.category]}
                strokeWidth={item === selectedItem ? SELECTED_STROKE_WIDTH : STROKE_WIDTH}
                strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                strokeDashoffset={-start}
                fill="none"
              />
            ))}
          </G>
        </Svg>
        <View style={styles.center} pointerEvents="none">
          {selectedItem ? (
            <View style={styles.tooltip} accessibilityLiveRegion="polite">
              <Text variant="caption" style={styles.muted} maxFontSizeMultiplier={1.5}>
                {selectedItem.label}
              </Text>
              <Text
                variant="label"
                weight="semibold"
                style={styles.tooltipAmount}
                maxFontSizeMultiplier={1.5}
              >
                {formatFullAmount(selectedItem.amount)}
              </Text>
            </View>
          ) : topItem ? (
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
      </Pressable>
      {spending.length > 0 && (
        <View style={styles.legend}>
          {spending.map((item) => (
            <Pressable
              key={item.category}
              disabled={item.category === 'remaining'}
              accessibilityRole={item.category === 'remaining' ? undefined : 'button'}
              accessibilityState={
                item.category === 'remaining' ? undefined : { selected: item === selectedItem }
              }
              accessibilityLabel={`${item.label}, ${formatFullAmount(item.amount)}, ${item.ratio}%`}
              onPress={() => toggleCategory(item.category)}
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
            </Pressable>
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
  tooltip: {
    maxWidth: '100%',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  tooltipAmount: { textAlign: 'center' },
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
