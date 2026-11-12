/** 열림 상태는 호출자가 소유해 다른 화면 상태와 동기화할 수 있다. */
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Animated, Easing, Platform, View, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, metrics } from '@/constants/layout';
interface ExpandableSectionProps extends PropsWithChildren {
  label: string;
  expanded: boolean;
  animated?: boolean;
  onToggle: () => void;
}
export function ExpandableSection({
  label,
  expanded,
  animated = false,
  onToggle,
  children,
}: ExpandableSectionProps) {
  const [reveal] = useState(() => new Animated.Value(0));
  useEffect(() => {
    reveal.setValue(0);
    if (!animated || !expanded) return;

    const animation = Animated.timing(reveal, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [animated, expanded, reveal]);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        aria-expanded={expanded}
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.row}
      >
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
      {expanded && (
        <Animated.View
          style={[
            styles.content,
            animated && {
              opacity: reveal,
              transform: [
                {
                  translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }),
                },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { minHeight: metrics.touch, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1 },
  content: { paddingTop: spacing.sm, gap: spacing.sm },
});
