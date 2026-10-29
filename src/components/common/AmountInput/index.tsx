/** 금액은 숫자 문자열로 주고받고 화면에만 콤마를 붙인다. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps } from '@/components/common/Input';
import { formatComma } from '@/utils/formatCurrency';
import { fontSize } from '@/constants/typography';
interface AmountInputProps extends Omit<InputProps, 'value' | 'onChangeText' | 'keyboardType'> {
  value: string;
  onChangeText: (digits: string) => void;
}
export function AmountInput({ value, onChangeText, style, ...props }: AmountInputProps) {
  return (
    <Input
      suffix="원"
      placeholder="0"
      {...props}
      value={value ? formatComma(Number(value)) : ''}
      keyboardType="number-pad"
      inputMode="numeric"
      onChangeText={(text) => {
        // 15자리 제한으로 Number의 정수 정밀도 손실을 방지한다.
        const digits = text
          .replace(/[^0-9]/g, '')
          .replace(/^0+(?=\d)/, '')
          .slice(0, 15);
        onChangeText(digits);
      }}
      style={[styles.amount, style]}
    />
  );
}
const styles = StyleSheet.create({
  amount: { textAlign: 'right', fontSize: fontSize['2xl'], fontWeight: '700' },
});
