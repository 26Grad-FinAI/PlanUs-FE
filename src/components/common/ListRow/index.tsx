/** 상세 정보의 라벨/값과 설정 메뉴의 화살표 행을 공유한다. */
import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { IconName } from '@/types/ui';
import { colors } from '@/constants/colors';
import { spacing, metrics } from '@/constants/layout';
interface ListRowProps {
  label: string;
  value?: ReactNode;
  icon?: IconName;
  onPress?: () => void;
  destructive?: boolean;
}
export function ListRow({ label, value, icon, onPress, destructive }: ListRowProps) {
  const content = (
    <>
      {icon && (
        <Ionicons
          accessible={false}
          aria-hidden={true}
          name={icon}
          size={metrics.icon}
          color={colors.textTertiary}
        />
      )}
      <Text style={[styles.label, destructive && styles.danger]}>{label}</Text>
      {value !== undefined && (
        <View style={styles.value}>
          {typeof value === 'string' || typeof value === 'number' ? (
            <Text style={styles.valueText}>{value}</Text>
          ) : (
            value
          )}
        </View>
      )}
      {onPress && (
        <Ionicons
          accessible={false}
          aria-hidden={true}
          name="chevron-forward"
          size={18}
          color={colors.textDisabled}
        />
      )}
    </>
  );
  return onPress ? (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.row}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={styles.row}>{content}</View>
  );
}
const styles = StyleSheet.create({
  row: {
    minHeight: metrics.button,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: { flex: 1, color: colors.textSecondary },
  value: { flexShrink: 1, maxWidth: '68%' },
  valueText: { textAlign: 'right' },
  danger: { color: colors.error },
});
