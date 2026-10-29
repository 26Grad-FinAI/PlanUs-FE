/** 아이콘 조작의 접근성 이름과 최소 터치 영역. */
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@/constants/colors';
import { metrics, radius } from '@/constants/layout';
interface IconButtonProps extends TouchableOpacityProps {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  size?: number;
  surface?: boolean;
}
export function IconButton({
  name,
  label,
  color = colors.textSecondary,
  size = metrics.icon,
  surface,
  disabled,
  style,
  ...props
}: IconButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, surface && styles.surface, style]}
    >
      <Ionicons
        accessible={false}
        aria-hidden={true}
        name={name}
        size={size}
        color={disabled ? colors.textDisabled : color}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    minWidth: metrics.touch,
    minHeight: metrics.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: { borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
});
