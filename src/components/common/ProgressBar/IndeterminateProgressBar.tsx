/** 일정 길이의 표시가 트랙 밖으로 나간 뒤 왼쪽에서 다시 등장한다. */
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/layout';
export function IndeterminateProgressBar({ label }: { label: string }) {
  const [width, setWidth] = useState(0);
  const [position] = useState(() => new Animated.Value(0));
  const motionEnabled = useMotionEnabled();
  useEffect(() => {
    position.setValue(0);
    if (!motionEnabled || !width) return;
    const animation = Animated.loop(
      Animated.timing(position, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
        isInteraction: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [motionEnabled, position, width]);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={styles.track}
    >
      <Animated.View
        style={[
          styles.bar,
          {
            width: width * 0.4,
            transform: [
              {
                translateX: motionEnabled
                  ? position.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.4, width] })
                  : width * 0.3,
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
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  bar: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },
});
