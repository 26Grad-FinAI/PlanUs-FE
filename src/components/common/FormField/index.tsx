/** 폼 라벨/필수/도움말/오류를 같은 순서로 표시한다. */
import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
export interface FieldProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}
export function FormField({
  label,
  required,
  hint,
  error,
  children,
}: PropsWithChildren<FieldProps>) {
  return (
    <View style={styles.field}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
          {required && <Text style={styles.error}> *</Text>}
        </Text>
      )}
      {hint && !error && (
        <Text variant="caption" style={styles.hint}>
          {hint}
        </Text>
      )}
      {children}
      {!!error && (
        <Text variant="caption" accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  label: { color: colors.textSecondary },
  hint: { color: colors.textTertiary },
  error: { color: colors.error },
});
