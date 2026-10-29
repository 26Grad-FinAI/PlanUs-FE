/** 나와 비교 집단의 금액을 모든 항목에 같은 척도로 표시한다. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/common/Card';
import { Text } from '@/components/common/Text';
import { ReportMoreButton } from '@/components/domain/report/ReportMoreButton';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/layout';
import { REPORT_VISIBLE_COUNT } from '@/constants/report';
import { PeerComparisonItem } from '@/types/report';
import { formatComma, formatFullAmount } from '@/utils/formatCurrency';

interface PeerComparisonProps {
  items: PeerComparisonItem[];
  expanded: boolean;
  onToggle: () => void;
}

interface ComparisonBarProps {
  amount: number;
  max: number;
  average?: boolean;
}

function ComparisonBar({ amount, max, average = false }: ComparisonBarProps) {
  return (
    <View style={styles.barRow}>
      <View style={styles.barSpace}>
        <View
          style={[styles.bar, average && styles.averageBar, { width: `${(amount / max) * 100}%` }]}
        />
      </View>
      <Text
        variant="label"
        weight={average ? 'regular' : 'semibold'}
        style={[styles.amount, average && styles.muted]}
      >
        {formatComma(amount)}
      </Text>
    </View>
  );
}

export function PeerComparison({ items, expanded, onToggle }: PeerComparisonProps) {
  if (items.length === 0) {
    return (
      <Card>
        <Text variant="label" style={styles.empty}>
          비교할 데이터가 아직 없어요.
        </Text>
      </Card>
    );
  }
  // 숨겨진 항목도 척도에 포함해 더보기를 눌러도 기존 막대의 길이를 유지한다.
  const maxAmount = Math.max(1, ...items.flatMap((item) => [item.actual, item.average]));
  const visible = expanded ? items : items.slice(0, REPORT_VISIBLE_COUNT);
  return (
    <Card style={styles.card}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.dot} />
          <Text variant="caption" style={styles.muted}>
            나
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.averageBar]} />
          <Text variant="caption" style={styles.muted}>
            비슷한 사람들
          </Text>
        </View>
      </View>
      {visible.map((item) => (
        <View
          key={item.category}
          accessible
          accessibilityLabel={`${item.label}, 나 ${formatFullAmount(item.actual)}, 비슷한 사람들 ${formatFullAmount(item.average)}`}
          style={styles.item}
        >
          <Text variant="label" weight="semibold">
            {item.label}
          </Text>
          <View style={styles.bars}>
            <ComparisonBar amount={item.actual} max={maxAmount} />
            <ComparisonBar amount={item.average} max={maxAmount} average />
          </View>
        </View>
      ))}
      <ReportMoreButton
        count={items.length}
        expanded={expanded}
        section="또래 비교 항목"
        onToggle={onToggle}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xxl },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: spacing.xxs, backgroundColor: colors.primary },
  item: { gap: spacing.sm },
  bars: { gap: spacing.xs },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  barSpace: { flex: 1, minWidth: spacing.xl },
  bar: { height: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.primary },
  averageBar: { backgroundColor: colors.border },
  amount: { minWidth: 76, maxWidth: '55%', flexShrink: 1, textAlign: 'right' },
  muted: { color: colors.textTertiary },
  empty: { color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.md },
});
