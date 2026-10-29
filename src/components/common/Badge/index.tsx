/** 클릭 동작 없이 상태/보조 정보를 표시한다. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/layout';
interface BadgeProps {
  label: string;
  tone?: 'primary' | 'danger' | 'neutral';
}
export function Badge({ label, tone = 'primary' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[tone]]}>
      <Text
        variant="caption"
        style={{
          color:
            tone === 'primary'
              ? colors.primaryDark
              : tone === 'danger'
                ? colors.error
                : colors.textTertiary,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    alignSelf: 'flex-start',
    borderRadius: radius.input,
  },
  primary: { backgroundColor: colors.primaryLight },
  danger: { backgroundColor: colors.errorBg },
  neutral: { backgroundColor: colors.surfaceMuted },
});
