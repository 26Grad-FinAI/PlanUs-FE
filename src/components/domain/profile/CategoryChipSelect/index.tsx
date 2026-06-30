/**
 * 소비 카테고리 단일 선택 칩 그리드
 *
 * 카테고리 1개만 선택할 수 있는 칩 UI. ProfileSetupScreen의 최다 소비 카테고리에서 사용한다.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { TopSpendingCategory } from '@/types/profile';

interface CategoryChip {
  id: TopSpendingCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// RecordAddScreen의 EXPENSE_CATEGORIES와 동일한 목록을 사용해 일관성 유지
const SPENDING_CATEGORIES: CategoryChip[] = [
  { id: 'grocery', label: '식료품', icon: 'cart-outline' },
  { id: 'dining', label: '외식', icon: 'restaurant-outline' },
  { id: 'alcohol', label: '주류', icon: 'beer-outline' },
  { id: 'clothing', label: '의류', icon: 'shirt-outline' },
  { id: 'leisure', label: '여가/문화', icon: 'film-outline' },
  { id: 'medical', label: '의료/건강', icon: 'medkit-outline' },
  { id: 'education', label: '교육', icon: 'book-outline' },
  { id: 'travel', label: '숙박/여행', icon: 'airplane-outline' },
  { id: 'telecom', label: '정보통신', icon: 'phone-portrait-outline' },
  { id: 'other', label: '기타', icon: 'ellipsis-horizontal-circle-outline' },
];

interface CategoryChipSelectProps {
  label: string;
  required?: boolean;
  hint?: string;
  selected: TopSpendingCategory | null;
  onSelect: (category: TopSpendingCategory) => void;
  error?: string;
}

export function CategoryChipSelect({
  label,
  required,
  hint,
  selected,
  onSelect,
  error,
}: CategoryChipSelectProps) {
  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
      </View>
      {!!hint && <Text style={styles.fieldHint}>{hint}</Text>}
      <View style={styles.chipGrid}>
        {SPENDING_CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Ionicons
                name={cat.icon}
                size={13}
                color={isSelected ? colors.background : colors.textSecondary}
              />
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                {cat.label}
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
  fieldHint: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: -4,
    marginBottom: 10,
    lineHeight: 18,
  },
  errorText: {
    marginTop: 6,
    fontSize: fontSize.xs,
    color: colors.error,
  },
  // RecordAddScreen의 카테고리 칩과 동일한 스타일 유지
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    color: colors.background,
    fontWeight: fontWeight.semibold,
  },
});
