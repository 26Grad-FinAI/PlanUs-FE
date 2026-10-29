/** 고정 라벨 박스/밑줄 입력. 오류는 포커스 색보다 우선한다. */
import React, { useState } from 'react';
import { View, TextInputProps, TextStyle, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput } from '@/components/common/TextInput';
import { Text } from '@/components/common/Text';
import { FormField, FieldProps } from '@/components/common/FormField';
import { IconButton } from '@/components/common/IconButton';
import { fontSize } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics } from '@/constants/layout';
export interface InputProps extends TextInputProps, FieldProps {
  variant?: 'box' | 'underline';
  suffix?: string;
  suffixStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightLabel?: string;
}
export function Input({
  label,
  required,
  hint,
  error,
  variant = 'box',
  suffix,
  suffixStyle,
  containerStyle,
  rightIcon,
  onRightPress,
  rightLabel,
  style,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : variant === 'underline'
        ? colors.border
        : colors.borderInput;
  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <View
        style={[
          styles.container,
          styles[variant],
          { borderColor },
          !editable && styles.disabled,
          containerStyle,
        ]}
      >
        <TextInput
          {...props}
          editable={editable}
          aria-disabled={!editable}
          accessibilityLabel={props.accessibilityLabel ?? label ?? props.placeholder}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, !!suffix && styles.withSuffix, style]}
        />
        {suffix && <Text style={[styles.suffix, suffixStyle]}>{suffix}</Text>}
        {rightIcon &&
          (onRightPress ? (
            <IconButton
              name={rightIcon}
              label={rightLabel ?? label ?? '입력 작업'}
              onPress={onRightPress}
              disabled={!editable}
            />
          ) : (
            <Ionicons
              accessible={false}
              aria-hidden={true}
              name={rightIcon}
              size={metrics.icon}
              color={colors.textTertiary}
            />
          ))}
      </View>
    </FormField>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: metrics.input,
    backgroundColor: colors.background,
  },
  box: { borderWidth: metrics.hairline, borderRadius: radius.input, paddingHorizontal: spacing.lg },
  underline: { borderBottomWidth: 2, paddingHorizontal: spacing.xxs },
  disabled: { backgroundColor: colors.backgroundAlt },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  withSuffix: { textAlign: 'right' },
  suffix: { color: colors.textTertiary },
});
