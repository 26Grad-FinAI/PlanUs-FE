/** 선택적으로 추가하는 월 고정 지출. 빈 행은 프로필 제출 시 제외한다. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField } from '@/components/common/FormField';
import { Input } from '@/components/common/Input';
import { AmountInput } from '@/components/common/AmountInput';
import { IconButton } from '@/components/common/IconButton';
import { Button } from '@/components/common/Button';
import { spacing } from '@/constants/layout';
import { FixedExpenseItem } from '@/types/profile';
interface FixedExpenseInputProps {
  items: FixedExpenseItem[];
  error?: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: 'label' | 'amount', value: string) => void;
}
export function FixedExpenseInput({
  items,
  error,
  onAdd,
  onRemove,
  onChange,
}: FixedExpenseInputProps) {
  return (
    <FormField
      label="월 고정 지출"
      hint="월세, 관리비, 보험료 등 매월 고정적으로 나가는 비용을 입력하세요"
      error={error}
    >
      {items.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.name}>
            <Input
              variant="underline"
              placeholder="항목명"
              accessibilityLabel={`${index + 1}번째 고정 지출 항목명`}
              value={item.label}
              onChangeText={(value) => onChange(item.id, 'label', value)}
            />
          </View>
          <View style={styles.amount}>
            <AmountInput
              variant="underline"
              accessibilityLabel={`${index + 1}번째 고정 지출 금액`}
              value={item.amount}
              onChangeText={(value) => onChange(item.id, 'amount', value)}
              style={styles.amountText}
            />
          </View>
          <IconButton
            name="close"
            label={`${index + 1}번째 고정 지출 삭제`}
            onPress={() => onRemove(item.id)}
          />
        </View>
      ))}
      <Button label="⊕ 항목 추가" variant="ghost" size="sm" onPress={onAdd} style={styles.add} />
    </FormField>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { flex: 1, minWidth: 0 },
  amount: { flex: 1.3, minWidth: 0 },
  amountText: { fontSize: 18 },
  add: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
