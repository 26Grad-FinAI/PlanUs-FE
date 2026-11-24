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
  const savings = [
    { label: '매달 절약', amount: monthly, highlighted: false },
    { label: '연 절약', amount: annual, highlighted: true },
  ];
  return (
    <View style={[styles.card, empty && styles.empty]}>
      <View accessibilityLiveRegion="polite" style={styles.copy}>
        {empty ? (
          <Text variant="body" weight="bold" style={[styles.headline, styles.muted]}>
            {applied ? '반영할 수 있는 플랜이 없어요' : '절약할 항목을 선택해보세요'}
          </Text>
        ) : (
          <>
            <Text variant="label" weight="regular" style={styles.context}>
              이 절약 플랜을 이어갈 경우
            </Text>
            <View style={styles.amounts}>
              {savings.map(({ label, amount, highlighted }) => (
                <View key={label} style={[styles.metric, highlighted && styles.annualMetric]}>
                  <Text variant="label" weight="regular" style={styles.caption}>
                    {label}
                  </Text>
                  <Text
                    variant="title"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    style={[styles.amount, highlighted && styles.emphasis]}
                  >
                    {formatFullAmount(amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
      <Button
        label={applied ? '이번 주 절약 플랜을 이미 반영했어요' : '이번 달 예산에 반영하기'}
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
  copy: { gap: spacing.md },
  context: { color: colors.textTertiary, lineHeight: 18 },
  amounts: { flexDirection: 'row', gap: spacing.lg },
  metric: { flex: 1, minWidth: 0, gap: spacing.xs },
  annualMetric: {
    borderLeftWidth: metrics.hairline,
    borderLeftColor: colors.border,
    paddingLeft: spacing.lg,
  },
  caption: { color: colors.textSecondary, lineHeight: 18 },
  muted: { color: colors.textTertiary },
  headline: { minHeight: 26, lineHeight: 26 },
  amount: { fontSize: 22, letterSpacing: -0.4 },
  emphasis: { color: colors.primaryDark },
  applyButton: { minHeight: metrics.header },
  applyLabel: { fontSize: fontSize.base, lineHeight: 24, textAlign: 'center' },
});
