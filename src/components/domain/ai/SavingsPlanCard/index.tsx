import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { SavingsPlan } from '@/types/ai';
import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/layout';
import { formatFullAmount } from '@/utils/formatCurrency';

interface SavingsPlanCardProps {
  plan: SavingsPlan;
  selected: boolean;
  applied: boolean;
  onPress: () => void;
}

export function SavingsPlanCard({ plan, selected, applied, onPress }: SavingsPlanCardProps) {
  const label = BUDGET_CATEGORY_META[plan.category].label;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={`${label}, ${plan.description}, 월 ${formatFullAmount(plan.monthlySavings)} 절약${applied ? ', 적용 완료' : ''}`}
      accessibilityState={{ checked: selected, disabled: applied }}
      disabled={applied}
      onPress={onPress}
      style={[styles.card, selected && styles.selected, applied && styles.applied]}
    >
      <View style={styles.row}>
        <Text variant="section" style={styles.label}>
          {label}
        </Text>
        <Text variant="section" style={[styles.amount, applied && styles.muted]}>
          -{formatFullAmount(plan.monthlySavings)}
        </Text>
      </View>
      <Text variant="label" style={styles.muted}>
        {plan.description}
      </Text>
      {applied && (
        <View style={styles.badge}>
          <Text variant="caption" weight="semibold" style={styles.badgeText}>
            적용 완료
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg + 2,
    gap: spacing.xs,
    borderRadius: radius.card,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.transparent,
  },
  selected: { backgroundColor: colors.background, borderColor: colors.primary },
  applied: { borderColor: colors.border },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: { flex: 1, fontSize: 16, lineHeight: 24 },
  amount: { color: colors.primaryDark, fontSize: 18, lineHeight: 24 },
  muted: { color: colors.textTertiary },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.disabledBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginTop: spacing.xs,
  },
  badgeText: { color: colors.textTertiary },
});
