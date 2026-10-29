/** 붙어 있는 탭 형태의 단일 선택. 업무 값은 호출자가 정의한다. */
import React from 'react';
import { ToggleGroup } from '@/components/common/ToggleGroup';
import { SelectOption } from '@/types/ui';
interface SegmentedControlProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  compact?: boolean;
}
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled,
  compact,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup
      appearance="segment"
      options={options}
      selectedValue={value}
      onSelect={onChange}
      disabled={disabled}
      compact={compact}
    />
  );
}
