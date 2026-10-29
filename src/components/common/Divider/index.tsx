/** 행 구분선과 화면의 두꺼운 구역 구분선. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
interface DividerProps {
  section?: boolean;
}
export function Divider({ section }: DividerProps) {
  return <View style={section ? styles.section : styles.line} />;
}
const styles = StyleSheet.create({
  line: { height: 1, backgroundColor: colors.border },
  section: { height: spacing.sm, backgroundColor: colors.surfaceMuted },
});
