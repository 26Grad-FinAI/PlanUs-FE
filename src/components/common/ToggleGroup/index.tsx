/** 성별/취업/주거 여부 선택. 분리 버튼과 지출/수입 전환의 상태 처리를 공유한다. */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { fontFamily } from '@/constants/typography';
import { Text } from '@/components/common/Text';
import { FormField, FieldProps } from '@/components/common/FormField';
import { SelectOption } from '@/types/ui';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics, shadows } from '@/constants/layout';
interface ToggleGroupProps<T extends string> extends FieldProps {
  options: readonly SelectOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  disabled?: boolean;
  appearance?: 'buttons' | 'segment';
  compact?: boolean;
}
export function ToggleGroup<T extends string>({
  options,
  selectedValue,
  onSelect,
  disabled,
  appearance = 'buttons',
  compact,
  ...field
}: ToggleGroupProps<T>) {
  const segment = appearance === 'segment';
  return (
    <FormField {...field}>
      <View style={[styles.group, segment && styles.segment]}>
        {options.map((option) => {
          const selected = selectedValue === option.value;
          const unavailable = disabled || option.disabled;
          return (
            <TouchableOpacity
              key={option.value}
              accessibilityRole={segment ? 'tab' : 'radio'}
              accessibilityLabel={option.label}
              aria-selected={segment ? selected : undefined}
              aria-checked={!segment ? selected : undefined}
              aria-disabled={!!unavailable}
              accessibilityState={{
                selected,
                checked: !segment ? selected : undefined,
                disabled: !!unavailable,
              }}
              disabled={unavailable}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
              style={[
                styles.button,
                segment && compact && styles.compact,
                !segment && styles.outlined,
                selected && (segment ? styles.segmentSelected : styles.selected),
                unavailable && styles.disabled,
              ]}
            >
              <Text
                style={[
                  styles.label,
                  selected && (segment ? styles.segmentLabel : styles.activeLabel),
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </FormField>
  );
}
const styles = StyleSheet.create({
  group: { flexDirection: 'row', gap: spacing.sm },
  segment: {
    padding: spacing.xs,
    borderRadius: radius.button,
    backgroundColor: colors.backgroundAlt,
    gap: spacing.xs,
  },
  button: {
    flex: 1,
    minWidth: 0,
    minHeight: metrics.input,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  outlined: {
    borderWidth: metrics.hairline,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },
  selected: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  segmentSelected: { backgroundColor: colors.background, ...shadows.raised },
  label: { color: colors.textTertiary, textAlign: 'center', fontFamily: fontFamily.medium },
  activeLabel: { color: colors.primaryDark, fontFamily: fontFamily.semibold },
  segmentLabel: { color: colors.textPrimary, fontFamily: fontFamily.bold },
  disabled: { opacity: 0.5 },
  compact: { minHeight: metrics.input - spacing.sm },
});
