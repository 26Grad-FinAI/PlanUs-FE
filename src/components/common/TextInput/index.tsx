/** Pretendard 기본 스타일과 명시적 굵기를 제공하는 입력 primitive. */
import React, { Ref } from 'react';
import { TextInput as NativeInput, TextInputProps, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
interface TextInputPrimitiveProps extends TextInputProps {
  ref?: Ref<NativeInput>;
  weight?: keyof typeof fontFamily;
}
export function TextInput({ ref, weight, style, ...props }: TextInputPrimitiveProps) {
  return (
    <NativeInput
      {...props}
      ref={ref}
      placeholderTextColor={props.placeholderTextColor ?? colors.textDisabled}
      style={[styles.base, weight && { fontFamily: fontFamily[weight] }, style]}
    />
  );
}
const styles = StyleSheet.create({
  base: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    // 폼의 포커스/오류 테두리와 브라우저 기본 테두리가 겹치지 않게 한다.
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
});
