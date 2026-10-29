/** 카드 배경과 내부 간격만 담당하는 레이아웃 primitive. */
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/layout';
interface CardProps extends ViewProps {
  tone?: 'white' | 'muted' | 'info';
}
export function Card({ tone = 'muted', style, ...props }: CardProps) {
  return <View {...props} style={[styles.base, styles[tone], style]} />;
}
const styles = StyleSheet.create({
  base: { padding: spacing.xl, borderRadius: radius.card, gap: spacing.md },
  white: { backgroundColor: colors.background },
  muted: { backgroundColor: colors.backgroundAlt },
  info: { backgroundColor: colors.primaryLight },
});
