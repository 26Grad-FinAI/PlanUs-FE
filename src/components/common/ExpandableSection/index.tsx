/** 열림 상태는 호출자가 소유해 다른 화면 상태와 동기화할 수 있다. */
import React, { PropsWithChildren } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, metrics } from '@/constants/layout';
interface ExpandableSectionProps extends PropsWithChildren {
  label: string;
  expanded: boolean;
  onToggle: () => void;
}
export function ExpandableSection({ label, expanded, onToggle, children }: ExpandableSectionProps) {
  return (
    <View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.row}
      >
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { minHeight: metrics.touch, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1 },
  content: { paddingTop: spacing.sm, gap: spacing.sm },
});
