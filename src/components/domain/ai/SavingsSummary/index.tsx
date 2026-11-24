import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { metrics, radius, spacing } from '@/constants/layout';
import { fontSize } from '@/constants/typography';
import { formatFullAmount } from '@/utils/formatCurrency';

interface SavingsSummaryProps {
  monthly: number;
  annual: number;
  hasSelection: boolean;
  applied: boolean;
  applying: boolean;
  onApply: () => void;
}

export function SavingsSummary({
  monthly,
  annual,
  hasSelection,
  applied,
  applying,
  onApply,
}: SavingsSummaryProps) {
  const empty = !hasSelection;
  return (
    <View style={[styles.card, empty && styles.empty]}>
      <View accessibilityLiveRegion="polite" style={styles.copy}>
        <Text variant="label" weight="regular" style={[styles.caption, empty && styles.muted]}>
          월 {formatFullAmount(monthly)} 절약
        </Text>
        {empty ? (
          <Text variant="body" weight="bold" style={[styles.headline, styles.muted]}>
            {applied ? '반영할 수 있는 플랜이 없어요' : '절약할 항목을 선택해보세요'}
          </Text>
        ) : (
          <Text variant="title" style={[styles.headline, styles.annual]}>
            매년{' '}
            <Text variant="inherit" style={styles.emphasis}>
              {formatFullAmount(annual)}
            </Text>{' '}
            저축 가능
          </Text>
        )}
      </View>
      <Button
        label="이번 달 예산에 반영하기"
        disabled={empty || applied}
        loading={applying}
        onPress={onApply}
        fullWidth
        style={styles.applyButton}
        labelStyle={styles.applyLabel}
      />
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
  caption: { color: colors.textSecondary, lineHeight: 18 },
  muted: { color: colors.textTertiary },
  headline: { minHeight: 26, lineHeight: 26 },
  annual: { fontSize: 22, letterSpacing: -0.4 },
  emphasis: { color: colors.primaryDark },
  applyButton: { minHeight: metrics.header },
  applyLabel: { fontSize: fontSize.base, lineHeight: 24, textAlign: 'center' },
});
