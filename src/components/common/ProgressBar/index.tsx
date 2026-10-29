/** 값은 원래 단위로 받고 시각적 채움만 0~100%로 제한한다. */
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Platform, View, StyleSheet } from 'react-native';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';
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
  const [width, setWidth] = useState(0);
  const [position] = useState(() => new Animated.Value(Math.max(0, step - 1)));
  const motionEnabled = useMotionEnabled();
  const segmentWidth = Math.max(0, (width - spacing.sm * (count - 1)) / count);
  useEffect(() => {
    if (!motionEnabled) {
      position.setValue(Math.max(0, step - 1));
      return;
    }
    const animation = Animated.timing(position, {
      toValue: Math.max(0, step - 1),
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [step, motionEnabled, position]);
  return (
    <View
      accessibilityLabel={`${count}단계 중 ${step}단계`}
      style={styles.steps}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.step} />
      ))}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            width: segmentWidth,
            opacity: step > 0 && width > 0 ? 1 : 0,
            transform: [
              {
                translateX: position.interpolate({
                  inputRange: [0, Math.max(1, count - 1)],
                  outputRange: [0, (segmentWidth + spacing.sm) * (count - 1)],
                }),
              },
            ],
          },
        ]}
      />
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
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
