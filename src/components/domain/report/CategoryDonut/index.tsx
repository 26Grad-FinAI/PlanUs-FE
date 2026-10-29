/**
 * 소비 통계 — 카테고리별 비중 도넛 차트 + 범례
 *
 * react-native-svg의 Circle stroke-dash 기법으로 도넛을 그린다.
 * 가운데에는 비중이 가장 큰 카테고리를 강조해 표시한다.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import Svg, { Circle, G } from 'react-native-svg';

import { colors } from '@/constants/colors';
import { fontSize, fontFamily } from '@/constants/typography';
import { REPORT_CATEGORY_COLOR } from '@/constants/report';
import { CategoryBreakdownItem } from '@/types/report';

interface CategoryDonutProps {
  items: CategoryBreakdownItem[];
}

const SIZE = 168;
const STROKE_WIDTH = 26;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// 슬라이스 사이 시각적 간격(px) — 너무 작은 조각엔 적용하지 않는다
const GAP = 3;

export function CategoryDonut({ items }: CategoryDonutProps) {
  // 표시할 지출 항목이 없으면 빈 상태 (배경 링 + 안내 문구)
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.chartWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
          </Svg>
          <View style={styles.centerLabel} pointerEvents="none">
            <Text style={styles.centerCategory}>지출 내역이 없어요</Text>
          </View>
        </View>
      </View>
    );
  }

  // 비중이 가장 큰 카테고리 (가운데 강조용)
  const topItem = items.reduce((max, item) => (item.amount > max.amount ? item : max), items[0]);

  // 누적 시작 비율을 추적하며 각 슬라이스의 dash 위치 계산
  const segments: { item: CategoryBreakdownItem; dash: number; offset: number }[] = [];
  let accumulatedRatio = 0;
  for (const item of items) {
    const segmentRatio = item.ratio / 100;
    segments.push({
      item,
      dash: Math.max(segmentRatio * CIRCUMFERENCE - GAP, 0),
      offset: -accumulatedRatio * CIRCUMFERENCE,
    });
    accumulatedRatio += segmentRatio;
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartWrap}>
        <Svg width={SIZE} height={SIZE}>
          {/* 12시 방향에서 시작하도록 -90도 회전 */}
          <G rotation={-90} origin={`${SIZE / 2}, ${SIZE / 2}`}>
            {/* 배경 트랙 */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.border}
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
                strokeLinecap="butt"
                fill="none"
              />
            ))}
          </G>
        </Svg>

        {/* 가운데 강조 라벨 */}
        <View style={styles.centerLabel} pointerEvents="none">
          <Text style={styles.centerRatio}>{topItem.ratio}%</Text>
          <Text style={styles.centerCategory}>{topItem.label}</Text>
        </View>
      </View>

      {/* 범례 — 2열 그리드 */}
      <View style={styles.legend}>
        {items.map((item) => (
          <View key={item.category} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: REPORT_CATEGORY_COLOR[item.category] }]}
            />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={styles.legendRatio}>{item.ratio}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 20 },
  chartWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRatio: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  centerCategory: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: colors.textTertiary,
    marginTop: 2,
  },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    rowGap: 12,
  },
  legendItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  legendRatio: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.textPrimary,
  },
});
