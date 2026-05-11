/**
 * 회원가입 화면 — placeholder
 * TODO: 다음 단계에서 구현 예정
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fontSize } from '@/constants/typography';

export function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>회원가입 화면 (구현 예정)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
  },
});
