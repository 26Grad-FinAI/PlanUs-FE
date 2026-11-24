import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { SavingsPlan } from '@/types/ai';
import { colors } from '@/constants/colors';
import { metrics, radius, spacing } from '@/constants/layout';
import { formatFullAmount } from '@/utils/formatCurrency';

interface SavingsPlanCardProps {
  plan: SavingsPlan;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function SavingsPlanCard({ plan, selected, disabled, onPress }: SavingsPlanCardProps) {
  const { categoryName, currentBehavior, targetBehavior, contextInsight, reductionWon } = plan;
  const amount = formatFullAmount(reductionWon);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={[
        categoryName,
        currentBehavior,
        targetBehavior,
        contextInsight,
        `이번 달 예산 ${amount} 감축`,
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, selected && styles.selected, disabled && styles.disabled]}
    >
      <View style={styles.row}>
        <Text variant="body" weight="bold" style={[styles.heading, styles.label]}>
          {categoryName}
        </Text>
        <Text variant="body" weight="bold" style={styles.heading}>
          {reductionWon > 0 ? '-' : ''}
          {amount}
        </Text>
      </View>
      {(currentBehavior || targetBehavior) && (
        <Text variant="label" weight="semibold" style={styles.behavior}>
          {currentBehavior}
          {currentBehavior && targetBehavior && (
            <Text variant="inherit" style={styles.arrow}>
              {' → '}
            </Text>
          )}
          {targetBehavior && (
            <Text variant="inherit" style={styles.target}>
              {targetBehavior}
            </Text>
          )}
        </Text>
      )}
      {!!contextInsight && (
        <Text variant="label" weight="regular" style={styles.muted}>
          {contextInsight}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl - metrics.hairline,
    gap: spacing.xs,
    borderRadius: radius.card,
    backgroundColor: colors.backgroundAlt,
    borderWidth: metrics.hairline,
    borderColor: colors.transparent,
  },
  selected: { backgroundColor: colors.background, borderColor: colors.primary },
  disabled: { opacity: 0.6 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heading: { lineHeight: 20 },
  label: { flex: 1 },
  behavior: { color: colors.textSecondary },
  arrow: { color: colors.textDisabled },
  target: { color: colors.primaryDark },
  muted: { color: colors.textTertiary },
});
