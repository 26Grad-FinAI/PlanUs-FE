/**
 * 월 고정 지출 입력 섹션
 *
 * 항목명 + 금액 행을 동적으로 추가/삭제할 수 있다.
 * 마지막 1개 항목만 남으면 삭제 버튼을 숨겨 최소 1행은 항상 유지한다.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { FixedExpenseItem } from '@/types/profile';

interface FixedExpenseInputProps {
  items: FixedExpenseItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: 'label' | 'amount', value: string) => void;
}

// 숫자 문자열 → 천 단위 콤마 포맷 (예: "3000000" → "3,000,000")
function formatAmount(value: string): string {
  if (!value) return '';
  const num = parseInt(value, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
}

export function FixedExpenseInput({ items, onAdd, onRemove, onChange }: FixedExpenseInputProps) {
  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>월 고정 지출</Text>
      </View>
      <Text style={styles.fieldHint}>월세, 보험료, 통신비 등 매월 고정적으로 나가는 비용</Text>

      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.row}>
            {/* 항목명 입력 */}
            <TextInput
              style={styles.labelInput}
              placeholder="항목명"
              placeholderTextColor={colors.textDisabled}
              value={item.label}
              onChangeText={(text) => onChange(item.id, 'label', text)}
              returnKeyType="next"
            />
            {/* 금액 입력 */}
            <View style={styles.amountWrapper}>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={colors.textDisabled}
                keyboardType="numeric"
                value={formatAmount(item.amount)}
                onChangeText={(text) => onChange(item.id, 'amount', text)}
              />
              <Text style={styles.suffix}>원</Text>
            </View>
            {/* 항목이 2개 이상일 때만 삭제 버튼 표시
                1개만 남으면 삭제 버튼 없이 row가 가득 채워지도록 렌더링 생략 */}
            {items.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(item.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${index + 1}번 항목 삭제`}
              >
                <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.7}>
        <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.addLabel}>항목 추가</Text>
      </TouchableOpacity>
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
  fieldHint: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: -4,
    marginBottom: 10,
    lineHeight: 18,
  },
  list: { gap: 8, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelInput: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    paddingHorizontal: 12,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  amountWrapper: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    padding: 0,
  },
  suffix: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginLeft: 6,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  addLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});
