/** 값은 원래 단위로 받고 시각적 채움만 0~100%로 제한한다. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/layout';
interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  tone?: 'primary' | 'danger' | 'inverse';
}
export function ProgressBar({ value, max = 100, label, tone = 'primary' }: ProgressBarProps) {
  // 예산 0원/비정상 값에서도 너비가 NaN 또는 Infinity가 되지 않게 한다.
  const ratio =
    !Number.isFinite(value) || !Number.isFinite(max)
      ? 0
      : max > 0
        ? Math.min(100, Math.max(0, (value / max) * 100))
        : value > 0
          ? 100
          : 0;
  return (
    <View
      accessibilityRole="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio)}
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio) }}
      style={[styles.track, tone === 'inverse' && styles.inverseTrack]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${ratio}%`,
            backgroundColor:
              tone === 'danger'
                ? colors.error
                : tone === 'inverse'
                  ? colors.background
                  : colors.primary,
          },
        ]}
      />
    </View>
  );
}
interface StepIndicatorProps {
  current: number;
  total?: number;
}
export function StepIndicator({ current, total = 2 }: StepIndicatorProps) {
  const count = Number.isFinite(total) ? Math.min(10, Math.max(1, Math.floor(total))) : 2;
  const step = Number.isFinite(current) ? Math.min(count, Math.max(0, Math.floor(current))) : 0;
  return (
    <View accessibilityLabel={`${count}단계 중 ${step}단계`} style={styles.steps}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.step, index < step && styles.active]} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.pill },
  inverseTrack: { backgroundColor: 'rgba(255,255,255,0.25)' },
  steps: { flexDirection: 'row', gap: spacing.sm },
  step: { flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: colors.border },
  active: { backgroundColor: colors.primary },
});
