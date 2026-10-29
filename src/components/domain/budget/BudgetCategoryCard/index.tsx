/** 추천값을 유지하면서 사용자 설정 금액을 편집하는 예산 카드. */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/components/common/Card';
import { Text } from '@/components/common/Text';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { fontFamily } from '@/constants/typography';
import { CategoryBudget } from '@/types/budget';
import { formatFullAmount } from '@/utils/formatCurrency';
interface BudgetCategoryCardProps {
  budget: CategoryBudget;
  total: number;
  editingValue: string | null;
  error?: string;
  onEdit: () => void;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}
export function BudgetCategoryCard({
  budget,
  total,
  editingValue,
  error,
  onEdit,
  onChange,
  onCommit,
  onCancel,
}: BudgetCategoryCardProps) {
  const exceeded = budget.userAmount > budget.aiAmount;
  const percentage = total > 0 ? Math.round((budget.userAmount / total) * 100) : 0;
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.name}>
          <Ionicons
            name={BUDGET_CATEGORY_META[budget.category].icon}
            size={22}
            color={colors.textTertiary}
            accessible={false}
            aria-hidden
          />
          <Text weight="semibold" style={styles.label}>
            {budget.label}
          </Text>
        </View>
        {editingValue !== null ? (
          <View style={styles.edit}>
            <Input
              variant="underline"
              value={editingValue}
              onChangeText={onChange}
              accessibilityLabel={`${budget.label} 예산 금액`}
              keyboardType="number-pad"
              inputMode="numeric"
              autoFocus
              selectTextOnFocus
              returnKeyType="done"
              maxLength={15}
              error={error}
              onBlur={onCommit}
              onSubmitEditing={onCommit}
              onKeyPress={(event) => {
                if (event.nativeEvent.key === 'Escape') onCancel();
              }}
              style={styles.editText}
            />
          </View>
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`${budget.label} 예산 수정`}
            onPress={onEdit}
            style={styles.amountButton}
          >
            <Text weight="semibold" style={[styles.amount, exceeded && styles.exceeded]}>
              {formatFullAmount(budget.userAmount)}
            </Text>
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.textTertiary}
              accessible={false}
              aria-hidden
            />
          </TouchableOpacity>
        )}
      </View>
      <ProgressBar
        label={`${budget.label} 예산 비중`}
        value={budget.userAmount}
        max={total}
        tone={exceeded ? 'danger' : 'primary'}
      />
      <View style={styles.row}>
        <View style={styles.meta}>
          <Badge label="AI 제안" />
          <Text variant="caption" style={styles.muted}>
            {formatFullAmount(budget.aiAmount)}
          </Text>
        </View>
        <Text
          variant="caption"
          weight="semibold"
          style={[styles.muted, exceeded && styles.exceeded]}
        >
          {percentage}%
        </Text>
      </View>
    </Card>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: { flex: 1, minWidth: 0, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  label: { flexShrink: 1 },
  amountButton: {
    maxWidth: '60%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amount: { flexShrink: 1, textAlign: 'right' },
  edit: { width: '55%' },
  editText: { fontFamily: fontFamily.semibold, color: colors.primaryDark, textAlign: 'right' },
  meta: { flex: 1, flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  muted: { color: colors.textTertiary },
  exceeded: { color: colors.error },
});
