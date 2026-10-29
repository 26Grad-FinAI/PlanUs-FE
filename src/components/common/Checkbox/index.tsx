/** 반복 지출 등 boolean 선택. 설명도 같은 터치 영역에 포함한다. */
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics } from '@/constants/layout';
interface CheckboxProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
export function Checkbox({ label, description, checked, onChange, disabled }: CheckboxProps) {
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      aria-checked={checked}
      aria-disabled={!!disabled}
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.row, disabled && styles.disabled]}
    >
      <View style={[styles.box, checked && styles.checked]}>
        {checked && (
          <Ionicons
            accessible={false}
            aria-hidden={true}
            name="checkmark"
            size={18}
            color={colors.background}
          />
        )}
      </View>
      <View style={styles.copy}>
        <Text variant="label">{label}</Text>
        {description && (
          <Text variant="caption" style={styles.description}>
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: metrics.touch },
  box: {
    width: 20,
    height: 20,
    borderRadius: radius.input / 2,
    borderWidth: 1,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  copy: { flex: 1, gap: spacing.xs },
  description: { color: colors.textTertiary },
  disabled: { opacity: 0.5 },
});
