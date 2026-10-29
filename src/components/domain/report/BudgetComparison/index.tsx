/** 월 전체와 카테고리의 소비·예산을 같은 카드 구성으로 비교한다. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Text } from '@/components/common/Text';
import { ReportMoreButton } from '@/components/domain/report/ReportMoreButton';
import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { REPORT_VISIBLE_COUNT } from '@/constants/report';
import { BudgetComparisonItem } from '@/types/report';
import { IconName } from '@/types/ui';
import { formatFullAmount } from '@/utils/formatCurrency';

interface BudgetComparisonProps {
  items: BudgetComparisonItem[];
  totalBudget: number;
  totalExpense: number;
  expanded: boolean;
  onToggle: () => void;
}

interface BudgetUsageCardProps {
  label: string;
  icon?: IconName;
  budget: number;
  actual: number;
  summary?: boolean;
}

function BudgetUsageCard({ label, icon, budget, actual, summary = false }: BudgetUsageCardProps) {
  const isOver = actual > budget;
  // 예산이 없는 소비는 비율을 꾸며내지 않고 금액과 초과 상태로 표시한다.
  const ratio = budget > 0 ? `${Math.round((actual / budget) * 100)}%` : '-';
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={colors.textTertiary}
            accessible={false}
            aria-hidden
          />
        )}
        <Text
          variant={summary ? 'label' : 'body'}
          weight={summary ? 'medium' : 'semibold'}
          style={[styles.label, summary && styles.muted]}
        >
          {label}
        </Text>
        <Text
          variant="label"
          weight="bold"
          style={[styles.ratio, budget === 0 && styles.muted, isOver && styles.over]}
        >
          {ratio}
        </Text>
      </View>
      <View style={styles.row}>
        <Text weight="bold" style={[styles.actual, isOver && styles.over]}>
          {formatFullAmount(actual)}
        </Text>
        <Text variant="label" weight="semibold" style={styles.budget}>
          / {formatFullAmount(budget)}
        </Text>
      </View>
      <ProgressBar
        label={`${summary ? '월' : label} 예산 대비 소비`}
        value={actual}
        max={budget}
        tone={isOver ? 'danger' : 'primary'}
      />
    </Card>
  );
}

export function BudgetComparison({
  items,
  totalBudget,
  totalExpense,
  expanded,
  onToggle,
}: BudgetComparisonProps) {
  const visible = expanded ? items : items.slice(0, REPORT_VISIBLE_COUNT);
  return (
    <View style={styles.container}>
      <BudgetUsageCard label="월 예산" budget={totalBudget} actual={totalExpense} summary />
      {visible.map((item) => (
        <BudgetUsageCard
          key={item.category}
          label={item.label}
          icon={BUDGET_CATEGORY_META[item.category].icon}
          budget={item.budget}
          actual={item.actual}
        />
      ))}
      <ReportMoreButton
        count={items.length}
        expanded={expanded}
        section="예산 항목"
        onToggle={onToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  card: { gap: spacing.sm, padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1, flexShrink: 1 },
  ratio: { color: colors.primaryDark, textAlign: 'right', flexShrink: 1 },
  actual: { flex: 1 },
  budget: { flex: 1, color: colors.textTertiary, textAlign: 'right' },
  muted: { color: colors.textTertiary },
  over: { color: colors.expense },
});
