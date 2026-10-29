/** 실제 선택값과 비활성·경계값을 확인하는 독립 예시. */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { ToggleGroup } from '@/components/common/ToggleGroup';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { Chip, ChipGroup } from '@/components/common/Chip';
import { Checkbox } from '@/components/common/Checkbox';
import { Badge } from '@/components/common/Badge';
import { ProgressBar, StepIndicator } from '@/components/common/ProgressBar';
import { spacing } from '@/constants/layout';
export function SelectionExamples() {
  const [gender, setGender] = useState<string | null>(null);
  const [type, setType] = useState('expense');
  const [feeling, setFeeling] = useState<string | null>('happy');
  const [repeat, setRepeat] = useState(false);
  return (
    <View style={styles.section}>
      <Text variant="section">선택 · 상태</Text>
      <StepIndicator current={1} />
      <StepIndicator current={2} />
      <ToggleGroup
        label="성별"
        required
        options={[
          { value: 'male', label: '남' },
          { value: 'female', label: '여' },
        ]}
        selectedValue={gender}
        onSelect={setGender}
      />
      <ToggleGroup
        label="비활성 선택"
        disabled
        options={[
          { value: 'yes', label: '예' },
          { value: 'no', label: '아니요' },
        ]}
        selectedValue="yes"
        onSelect={() => {}}
      />
      <SegmentedControl
        options={[
          { value: 'expense', label: '지출' },
          { value: 'income', label: '수입' },
        ]}
        value={type}
        onChange={setType}
      />
      <ChipGroup
        label="소비 성격"
        options={[
          { value: 'needed', label: '필요한 소비였어요' },
          { value: 'happy', label: '만족스러웠어요' },
          { value: 'impulse', label: '충동적이었어요' },
        ]}
        value={feeling}
        onChange={setFeeling}
      />
      <Chip label="선택 불가" disabled icon="cart-outline" />
      <Checkbox
        label="반복되는 지출이에요"
        description="체크하면 매달 같은 날짜에 자동으로 등록돼요."
        checked={repeat}
        onChange={setRepeat}
      />
      <Checkbox label="비활성 체크" checked disabled onChange={() => {}} />
      <Badge label="AI 제안" />
      <Badge label="예산 초과" tone="danger" />
      <Badge label="중립 상태" tone="neutral" />
      <Text variant="caption">기본 24% / 초과 107% / 예산 0원 / 빈 값</Text>
      <ProgressBar label="기본 예산" value={24} />
      <ProgressBar label="초과 예산" value={107} tone="danger" />
      <ProgressBar label="예산 없이 지출" value={10} max={0} tone="danger" />
      <ProgressBar label="빈 예산" value={0} max={0} />
    </View>
  );
}
const styles = StyleSheet.create({ section: { gap: spacing.lg } });
