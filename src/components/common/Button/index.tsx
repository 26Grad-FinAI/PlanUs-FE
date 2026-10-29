/** 주요 CTA와 보조/삭제 액션. 비활성과 요청 진행을 구분한다. */
import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics } from '@/constants/layout';
interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}
export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  accessibilityState,
  ...props
}: ButtonProps) {
  const textColor = disabled
    ? colors.textDisabled
    : variant === 'primary'
      ? colors.background
      : variant === 'destructive'
        ? colors.error
        : variant === 'ghost'
          ? colors.primaryDark
          : colors.textSecondary;
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.75}
      disabled={disabled || loading}
      accessibilityRole="button"
      aria-busy={loading}
      aria-disabled={!!disabled || loading}
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityState={{ ...accessibilityState, disabled: !!disabled || loading, busy: loading }}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.full,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator accessibilityLabel="처리 중" color={textColor} />
      ) : (
        <Text variant={size === 'sm' ? 'label' : 'button'} style={{ color: textColor }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: metrics.hairline,
    borderColor: colors.border,
  },
  ghost: { backgroundColor: colors.transparent },
  destructive: {
    backgroundColor: colors.errorBg,
    borderWidth: metrics.hairline,
    borderColor: colors.error,
  },
  sm: { minHeight: metrics.touch },
  md: { minHeight: metrics.input },
  lg: { minHeight: metrics.button },
  full: { alignSelf: 'stretch' },
  disabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
});
