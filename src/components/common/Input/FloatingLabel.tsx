/** 입력 테두리 위로 이동하는 라벨. */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, metrics } from '@/constants/layout';
import { fontSize, typography } from '@/constants/typography';

const raisedScale = fontSize.xs / fontSize.base;

interface FloatingLabelProps {
  label: string;
  raised: boolean;
  height: number;
  color: string;
  disabled: boolean;
  required?: boolean;
}

export function FloatingLabel({
  label,
  raised,
  height,
  color,
  disabled,
  required,
}: FloatingLabelProps) {
  const progress = useRef(new Animated.Value(raised ? 1 : 0)).current;
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: typography.body.lineHeight,
  });

  useEffect(() => {
    // 위치와 크기만 변환해 애니메이션 중 입력 영역의 레이아웃을 유지한다.
    const animation = Animated.timing(progress, {
      toValue: raised ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [raised, progress]);

  return (
    <Animated.View
      pointerEvents="none"
      aria-hidden
      onLayout={({ nativeEvent }) => {
        const { width, height: labelHeight } = nativeEvent.layout;
        setSize((current) =>
          current.width === width && current.height === labelHeight
            ? current
            : { width, height: labelHeight },
        );
      }}
      style={[
        styles.label,
        { backgroundColor: disabled ? colors.backgroundAlt : colors.background },
        {
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [(height - size.height) / 2, -size.height / 2],
              }),
            },
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (-size.width * (1 - raisedScale)) / 2],
              }),
            },
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, raisedScale] }) },
          ],
        },
      ]}
    >
      <Text style={{ color }}>
        {label}
        {required && (
          <Text variant="inherit" style={styles.required}>
            {' '}
            *
          </Text>
        )}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: -metrics.hairline,
    left: spacing.lg - spacing.xs,
    paddingHorizontal: spacing.xs,
    zIndex: 1,
  },
  required: { color: colors.error },
});
