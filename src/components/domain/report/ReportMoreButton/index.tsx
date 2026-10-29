/** 통계의 두 비교 목록이 동일한 접기·더보기 UI를 사용한다. */
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { REPORT_VISIBLE_COUNT } from '@/constants/report';

interface ReportMoreButtonProps {
  count: number;
  expanded: boolean;
  section: string;
  onToggle: () => void;
}

export function ReportMoreButton({ count, expanded, section, onToggle }: ReportMoreButtonProps) {
  const remaining = count - REPORT_VISIBLE_COUNT;
  if (remaining <= 0) return null;
  const label = expanded ? '접기' : `${remaining}개 더보기`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${section} ${label}`}
      accessibilityState={{ expanded }}
      aria-expanded={expanded}
      onPress={onToggle}
      style={styles.button}
    >
      <Text variant="caption" style={styles.label}>
        {label}
      </Text>
      <Ionicons
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={12}
        color={colors.textTertiary}
        accessible={false}
        aria-hidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: metrics.touch,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: { color: colors.textTertiary },
});
