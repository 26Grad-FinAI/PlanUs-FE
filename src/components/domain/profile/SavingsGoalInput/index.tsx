/**
 * 월 목표 저축액 입력 섹션
 *
 * 목표 기간(연도·월)은 드롭다운 모달에서 선택하고, 목표 금액은 직접 입력한다.
 * 모달 내부의 임시 선택값(temp)은 컴포넌트 안에 캡슐화되어 있어
 * 확인 버튼을 눌렀을 때만 onConfirmPeriod로 확정된 값을 부모에 전달한다.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

interface SavingsGoalInputProps {
  targetYear: string;
  targetMonth: string;
  amount: string;
  onConfirmPeriod: (year: string, month: string) => void;
  onAmountChange: (amount: string) => void;
  // 화면 하단에 표시할 에러 메시지
  error?: string;
  // 기간/금액 중 실제로 잘못된 필드만 테두리로 강조하기 위한 플래그
  // (error 메시지 하나로는 두 필드 중 어느 쪽이 문제인지 구분할 수 없어 분리)
  periodHasError?: boolean;
  amountHasError?: boolean;
}

// 목표 기간 드롭다운 선택지 — 현재 연도 기준 이후 10년
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const SAVINGS_YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR + i);
const SAVINGS_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

// 숫자 문자열 → 천 단위 콤마 포맷 (예: "3000000" → "3,000,000")
function formatAmount(value: string): string {
  if (!value) return '';
  const num = parseInt(value, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
}

export function SavingsGoalInput({
  targetYear,
  targetMonth,
  amount,
  onConfirmPeriod,
  onAmountChange,
  error,
  periodHasError,
  amountHasError,
}: SavingsGoalInputProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const [showPicker, setShowPicker] = useState(false);
  const [tempYear, setTempYear] = useState('');
  const [tempMonth, setTempMonth] = useState('');

  // 목표 기간 표시 문자열 — 미선택 시 placeholder 역할
  const dateLabel = targetYear && targetMonth ? `${targetYear}년 ${targetMonth}월까지` : null;

  function handleOpenPicker() {
    // 모달 열 때 현재 확정된 값으로 temp 초기화
    setTempYear(targetYear);
    setTempMonth(targetMonth);
    setShowPicker(true);
  }

  function handleConfirm() {
    onConfirmPeriod(tempYear, tempMonth);
    setShowPicker(false);
  }

  function handleCancel() {
    setShowPicker(false);
  }

  // 연도 변경 시, 이미 선택된 월이 새 연도 기준으로 과거 달이 되면 선택 해제
  // (예: 12월 선택 후 연도를 내년→올해로 바꾸면 과거가 아니지만,
  //  올해 선택 중 1월처럼 이미 지난 달을 선택해둔 채 연도만 바뀌는 경우를 방지)
  function handleSelectYear(year: number) {
    const yearStr = year.toString();
    setTempYear(yearStr);
    if (year === CURRENT_YEAR && tempMonth && parseInt(tempMonth, 10) < CURRENT_MONTH) {
      setTempMonth('');
    }
  }

  function handleSelectMonth(month: number) {
    // 선택된 연도가 올해이고, 해당 월이 이미 지난 달이면 선택 자체를 막음
    if (tempYear === CURRENT_YEAR.toString() && month < CURRENT_MONTH) return;
    setTempMonth(month.toString());
  }

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>월 목표 저축액</Text>
        <Text style={styles.required}> *</Text>
      </View>
      <Text style={styles.fieldHint}>언제까지 얼마를 저축할지 입력하세요</Text>

      {/* 목표 기간 — 드롭다운으로 연도·월 선택 */}
      <TouchableOpacity
        style={[styles.dateRow, !!periodHasError && styles.dateRowError]}
        onPress={handleOpenPicker}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="목표 기간 선택"
      >
        <Text style={dateLabel ? styles.dateText : styles.datePlaceholder}>
          {dateLabel ?? '목표 기간 선택'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textTertiary} />
      </TouchableOpacity>

      {/* 목표 금액 */}
      <View style={[styles.amountWrapper, !!amountHasError && styles.amountWrapperError]}>
        <TextInput
          style={styles.amountInput}
          placeholder="500,000"
          placeholderTextColor={colors.textDisabled}
          keyboardType="numeric"
          value={formatAmount(amount)}
          onChangeText={(text) => onAmountChange(text.replace(/[^0-9]/g, ''))}
        />
        <Text style={styles.amountSuffix}>원</Text>
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* ── 목표 기간 피커 모달 ── */}
      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={handleCancel}>
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={handleCancel}
          />
          <View style={[styles.pickerCard, { paddingBottom: bottomInset + 16 }]}>
            <Text style={styles.pickerTitle}>목표 기간 선택</Text>

            {/* 연도·월 두 컬럼 나란히 */}
            <View style={styles.pickerColumns}>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {SAVINGS_YEARS.map((year) => {
                  const isSelected = tempYear === year.toString();
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                      onPress={() => handleSelectYear(year)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}
                      >
                        {year}년
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.pickerColumnDivider} />

              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {SAVINGS_MONTHS.map((month) => {
                  const isSelected = tempMonth === month.toString();
                  // 선택된 연도가 올해이고 이미 지난 달이면 비활성화 — 과거 월은 애초에 선택 불가
                  const isPast = tempYear === CURRENT_YEAR.toString() && month < CURRENT_MONTH;
                  return (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        isSelected && styles.pickerItemSelected,
                        isPast && styles.pickerItemDisabled,
                      ]}
                      onPress={() => handleSelectMonth(month)}
                      activeOpacity={isPast ? 1 : 0.7}
                      disabled={isPast}
                      accessibilityState={{ disabled: isPast, selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          isSelected && styles.pickerItemTextSelected,
                          isPast && styles.pickerItemTextDisabled,
                        ]}
                      >
                        {month}월
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.pickerButtons}>
              <Button
                label="취소"
                variant="secondary"
                size="md"
                style={styles.pickerButtonHalf}
                onPress={handleCancel}
              />
              <Button
                label="확인"
                variant="primary"
                size="md"
                style={styles.pickerButtonHalf}
                onPress={handleConfirm}
              />
            </View>
          </View>
        </View>
      </Modal>
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

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  dateRowError: {
    borderColor: colors.error,
  },
  dateText: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  datePlaceholder: {
    fontSize: fontSize.base,
    color: colors.textDisabled,
  },

  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  amountWrapperError: {
    borderColor: colors.error,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    padding: 0,
  },
  amountSuffix: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    marginLeft: 6,
  },

  // ── 목표 기간 피커 모달 ──
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  pickerCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  pickerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerColumns: {
    flexDirection: 'row',
    height: 240,
    marginBottom: 20,
  },
  pickerColumn: { flex: 1 },
  pickerColumnDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  // 이미 지난 달 — 터치 불가, 흐린 텍스트로 선택 불가능함을 표시
  pickerItemDisabled: {
    opacity: 0.4,
  },
  pickerItemText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.regular,
  },
  pickerItemTextSelected: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  pickerItemTextDisabled: {
    color: colors.textDisabled,
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerButtonHalf: { flex: 1 },
});
