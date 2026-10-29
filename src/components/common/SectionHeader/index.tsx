/** 섹션 제목과 설명, 선택적인 우측 액션. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
export function SectionHeader({ title, description, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text variant="section" accessibilityRole="header">
          {title}
        </Text>
        {description && (
          <Text variant="label" style={styles.description}>
            {description}
          </Text>
        )}
      </View>
      {actionLabel && onAction && (
        <Button label={actionLabel} variant="ghost" size="sm" onPress={onAction} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  copy: { flex: 1, gap: spacing.xs },
  description: { color: colors.textTertiary },
});
