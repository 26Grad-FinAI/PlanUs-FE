/**
 * 공통 2지선다 토글 컴포넌트
 *
 * 성별, 취업 여부, 주택 소유 유무처럼 두 개의 보기 중 하나를 선택하는
 * 폼 필드에서 공통으로 사용한다. 값은 항상 문자열로 다루며,
 * boolean처럼 문자열이 아닌 값은 호출하는 쪽에서 변환해서 넘긴다.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  label: string;
  required?: boolean;
  options: [ToggleOption, ToggleOption];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  error?: string;
}

export function ToggleGroup({
  label,
  required,
  options,
  selectedValue,
  onSelect,
  error,
}: ToggleGroupProps) {
  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
      </View>
      <View style={styles.toggleGroup}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.toggleButton, isSelected && styles.toggleButtonActive]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.toggleLabel, isSelected && styles.toggleLabelActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  required: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.error,
  },
  // 두 버튼이 나란히 배치되며, 선택 시 primaryLight 배경 + primary 테두리로 변경
  toggleGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  toggleButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  toggleLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },
  toggleLabelActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  errorText: {
    marginTop: 6,
    fontSize: fontSize.xs,
    color: colors.error,
  },
});
