/** 의미별 타이포와 명시적인 Pretendard 굵기를 제공한다. */
import React from 'react';
import { Text as NativeText, TextProps as NativeTextProps, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, typography } from '@/constants/typography';
interface TextProps extends NativeTextProps {
  variant?: keyof typeof typography | 'inherit';
  weight?: keyof typeof fontFamily;
}
export function Text({ variant = 'body', weight, style, ...props }: TextProps) {
  return (
    <NativeText
      {...props}
      style={[
        variant !== 'inherit' && styles.base,
        variant !== 'inherit' && typography[variant],
        weight && { fontFamily: fontFamily[weight] },
        style,
      ]}
    />
  );
}
const styles = StyleSheet.create({ base: { color: colors.textPrimary } });
