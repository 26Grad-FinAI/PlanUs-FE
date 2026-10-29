import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/layout';
import { formatFullAmount } from '@/utils/formatCurrency';

interface SavingsSummaryProps {
  monthly: number;
  annual: number;
  allApplied: boolean;
  hasPlans: boolean;
  onApply: () => void;
}

export function SavingsSummary({
  monthly,
  annual,
  allApplied,
  hasPlans,
  onApply,
}: SavingsSummaryProps) {
  const empty = monthly === 0;
  return (
    <View style={[styles.card, empty && styles.empty]}>
      <View accessibilityLiveRegion="polite" style={styles.copy}>
        <Text variant="label" style={styles.muted}>
          월 {formatFullAmount(monthly)} 절약
        </Text>
        {empty ? (
          <Text variant="section" style={styles.muted}>
            {allApplied
              ? '모든 절약 플랜을 적용했어요'
              : hasPlans
                ? '절약할 항목을 선택해보세요'
                : '추천 절약 플랜이 아직 없어요'}
          </Text>
        ) : (
          <Text variant="title" style={styles.annual}>
            매년{' '}
            <Text variant="inherit" style={styles.emphasis}>
              {formatFullAmount(annual)}
            </Text>{' '}
            저축 가능
          </Text>
        )}
      </View>
      <Button label="이번 달 예산에 반영하기" disabled={empty} onPress={onApply} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.lg,
  },
  empty: { backgroundColor: colors.backgroundAlt },
  copy: { gap: spacing.xs },
  muted: { color: colors.textTertiary },
  annual: { fontSize: 22, lineHeight: 32 },
  emphasis: { color: colors.primaryDark },
});
