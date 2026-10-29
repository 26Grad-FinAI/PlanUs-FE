/** 기존 프로필 입력 API를 유지하며 공통 ChipGroup을 조합한다. */
import React from 'react';
import { ChipGroup } from '@/components/common/Chip';
import { FieldProps } from '@/components/common/FormField';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { TopSpendingCategory } from '@/types/profile';
interface CategoryChipSelectProps extends FieldProps {
  selected: TopSpendingCategory | null;
  onSelect: (category: TopSpendingCategory) => void;
}
export function CategoryChipSelect({ selected, onSelect, ...field }: CategoryChipSelectProps) {
  return (
    <ChipGroup
      {...field}
      options={EXPENSE_CATEGORIES.map((category) => ({
        value: category.id,
        label: category.label,
        icon: category.icon,
      }))}
      value={selected}
      onChange={(category) => {
        if (category !== 'salary' && category !== 'allowance') onSelect(category);
      }}
    />
  );
}
