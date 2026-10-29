/** 카테고리/소비 성격 선택에 공통으로 쓰는 칩. */
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { FormField, FieldProps } from '@/components/common/FormField';
import { SelectOption, IconName } from '@/types/ui';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics } from '@/constants/layout';
interface ChipProps {
  label: string;
  icon?: IconName;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  compact?: boolean;
}
export function Chip({ label, icon, selected, disabled, onPress, compact }: ChipProps) {
  const color = disabled
    ? colors.textDisabled
    : selected
      ? colors.primaryDark
      : colors.textSecondary;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      aria-selected={!!selected}
      aria-disabled={!!disabled}
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        compact && styles.compact,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
    >
      {icon && (
        <Ionicons
          accessible={false}
          aria-hidden={true}
          name={icon}
          size={compact ? 14 : 18}
          color={color}
        />
      )}
      <Text variant="label" style={{ color }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
interface ChipGroupProps<T extends string> extends FieldProps {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  compact?: boolean;
}
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  disabled,
  compact,
  ...field
}: ChipGroupProps<T>) {
  return (
    <FormField {...field}>
      <View style={styles.group}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={option.value === value}
            disabled={disabled || option.disabled}
            compact={compact}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </FormField>
  );
}
const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: metrics.touch,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: metrics.hairline,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  // 등록 시안의 칩은 34px. 다른 화면의 기존 44px 칩은 유지한다.
  compact: { minHeight: 34, paddingVertical: 6, paddingHorizontal: 14 },
  disabled: { opacity: 0.5 },
});
