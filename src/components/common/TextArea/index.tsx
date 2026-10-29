/** 메모/자기소개 입력. 기본 이벤트와 폼 오류 표시를 지원한다. */
import React, { useState } from 'react';
import { TextInputProps, StyleSheet } from 'react-native';
import { TextInput } from '@/components/common/TextInput';
import { FormField, FieldProps } from '@/components/common/FormField';
import { fontSize } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/layout';
interface TextAreaProps extends TextInputProps, FieldProps {
  minHeight?: number;
}
export function TextArea({
  label,
  required,
  hint,
  error,
  minHeight = 120,
  style,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <TextInput
        {...props}
        accessibilityLabel={props.accessibilityLabel ?? label ?? props.placeholder}
        editable={editable}
        aria-disabled={!editable}
        multiline
        textAlignVertical="top"
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            minHeight,
            borderColor: error ? colors.error : focused ? colors.primary : colors.transparent,
          },
          !editable && styles.disabled,
          style,
        ]}
      />
    </FormField>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.backgroundAlt,
    color: colors.textPrimary,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    fontSize: fontSize.base,
    lineHeight: 24,
  },
  disabled: { color: colors.textDisabled },
});
