/** 기존 화면의 굵기 스타일도 Pretendard 파일로 변환하는 공통 텍스트. */
import React, { createContext, useContext } from 'react';
import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, typography } from '@/constants/typography';

interface TextProps extends NativeTextProps {
  variant?: keyof typeof typography;
}
const TextInheritance = createContext<TextStyle | null>(null);

export function Text({ variant, style, children, ...props }: TextProps) {
  const inherited = useContext(TextInheritance);
  const resolved = StyleSheet.flatten<TextStyle>([
    inherited,
    !inherited && styles.base,
    variant && typography[variant],
    style,
  ]);
  const weight = String(resolved.fontWeight ?? '400');
  const family =
    Number(weight) >= 700 || weight === 'bold'
      ? fontFamily.bold
      : Number(weight) >= 600
        ? fontFamily.semibold
        : Number(weight) >= 500
          ? fontFamily.medium
          : fontFamily.regular;
  // 중첩 강조 텍스트는 부모 크기/색을 상속하고 굵기만 해당 정적 폰트로 바꾼다.
  const effectiveStyle: TextStyle = { ...resolved, fontFamily: family, fontWeight: 'normal' };
  return (
    <TextInheritance.Provider value={resolved}>
      <NativeText {...props} style={effectiveStyle}>
        {children}
      </NativeText>
    </TextInheritance.Provider>
  );
}
const styles = StyleSheet.create({ base: { fontSize: 16, color: colors.textPrimary } });
