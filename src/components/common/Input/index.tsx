/** 박스·밑줄·플로팅 라벨 입력. */
import React, { Ref, useState } from 'react';
import {
  View,
  TextInputInstance,
  TextInputProps,
  TextStyle,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput } from '@/components/common/TextInput';
import { Text } from '@/components/common/Text';
import { FormField, FieldProps } from '@/components/common/FormField';
import { IconButton } from '@/components/common/IconButton';
import { FloatingLabel } from '@/components/common/Input/FloatingLabel';
import { fontSize } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics } from '@/constants/layout';
export interface InputProps extends TextInputProps, FieldProps {
  ref?: Ref<TextInputInstance>;
  variant?: 'box' | 'underline' | 'floating';
  suffix?: string;
  prefix?: string;
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
  prefix,
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
  const [hasText, setHasText] = useState(Boolean(props.defaultValue));
  const [height, setHeight] = useState<number>(metrics.button);
  const floating = variant === 'floating' && !!label;
  const raised = focused || (props.value !== undefined ? props.value.length > 0 : hasText);
  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : variant === 'underline'
        ? colors.border
        : colors.borderInput;
  return (
    <FormField label={floating ? undefined : label} required={required} hint={hint} error={error}>
      <View
        onLayout={floating ? (event) => setHeight(event.nativeEvent.layout.height) : undefined}
        style={[
          styles.container,
          styles[variant === 'underline' ? 'underline' : 'box'],
          floating && styles.floating,
          { borderColor },
          !editable && styles.disabled,
          containerStyle,
        ]}
      >
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          {...props}
          placeholder={floating && !raised ? undefined : props.placeholder}
          editable={editable}
          aria-invalid={!!error}
          aria-disabled={!editable}
          accessibilityLabel={props.accessibilityLabel ?? label ?? props.placeholder}
          onChangeText={(text) => {
            if (props.value === undefined) setHasText(text.length > 0);
            props.onChangeText?.(text);
          }}
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
        {floating && (
          <FloatingLabel
            label={label}
            raised={raised}
            height={height}
            required={required}
            disabled={!editable}
            color={error ? colors.error : focused ? colors.primary : colors.textDisabled}
          />
        )}
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
  prefix: { color: colors.textSecondary, marginRight: spacing.sm },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: metrics.input,
    backgroundColor: colors.background,
  },
  box: { borderWidth: metrics.hairline, borderRadius: radius.input, paddingHorizontal: spacing.lg },
  floating: { minHeight: metrics.button },
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
