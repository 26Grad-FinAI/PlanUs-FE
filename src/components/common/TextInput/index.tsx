/** 직접 입력 필드도 정적 Pretendard 굵기로 표시하는 저수준 입력. */
import React, { Ref } from 'react';
import { TextInput as NativeInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
interface TextInputPrimitiveProps extends TextInputProps {
  ref?: Ref<NativeInput>;
}
export function TextInput({ ref, style, ...props }: TextInputPrimitiveProps) {
  const resolved = StyleSheet.flatten(style);
  const weight = String(resolved?.fontWeight ?? '400');
  const family =
    weight === 'bold' || Number(weight) >= 700
      ? fontFamily.bold
      : Number(weight) >= 600
        ? fontFamily.semibold
        : Number(weight) >= 500
          ? fontFamily.medium
          : fontFamily.regular;
  return (
    <NativeInput
      {...props}
      ref={ref}
      placeholderTextColor={props.placeholderTextColor ?? colors.textDisabled}
      style={[style, { fontFamily: family, fontWeight: 'normal' }]}
    />
  );
}
