/**
 * 소비 등록 화면
 *
 * 구성 요소:
 * - 유형 토글: 슬라이딩 pill 스타일
 * - 금액/내역/날짜: 공통 Input 컴포넌트
 * - 카테고리: 컴팩트 pill 칩
 * - 메모: 공통 Input 컴포넌트 (multiline)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { MainTabParamList } from '@/app/navigation/types';
import { SpendingType, SpendingCategory } from '@/types/record';

// 캘린더 한국어 로케일
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

type RecordAddNavigationProp = BottomTabNavigationProp<MainTabParamList, 'RecordAdd'>;

interface RecordAddScreenProps {
  navigation: RecordAddNavigationProp;
}

type CategoryItem = {
  id: SpendingCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const EXPENSE_CATEGORIES: CategoryItem[] = [
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

const INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'salary', label: '월급', icon: 'briefcase-outline' },
  { id: 'allowance', label: '용돈', icon: 'gift-outline' },
  { id: 'other', label: '기타', icon: 'ellipsis-horizontal-circle-outline' },
];

// 숫자 → 천 단위 콤마 포맷 (예: 4500 → "4,500")
function formatAmount(value: string): string {
  if (!value) return '';
  const num = parseInt(value, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
}

function formatDateForDisplay(date: Date): string {
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
}

function formatDateForISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function RecordAddScreen({ navigation }: RecordAddScreenProps) {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const [recordType, setRecordType] = useState<SpendingType>('expense');
  const [amount, setAmount] = useState(''); // 숫자 문자열 (콤마 제외)
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory | null>(null);
  const [memo, setMemo] = useState('');

  const [amountError, setAmountError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      setRecordType('expense');
      setAmount('');
      setDescription('');
      setSelectedDate(today);
      setSelectedCategory(null);
      setMemo('');
      setAmountError('');
      setDescriptionError('');
      setCategoryError('');
    }, []),
  );

  function handleTypeChange(type: SpendingType) {
    setRecordType(type);
    setSelectedCategory(null);
    setCategoryError('');
  }

  function handleAmountChange(text: string) {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setAmount(digitsOnly);
    if (amountError) setAmountError('');
  }

  function handleOpenDatePicker() {
    setTempSelectedDate(selectedDate);
    setShowDatePicker(true);
  }

  function handleConfirmDate() {
    setSelectedDate(tempSelectedDate);
    setShowDatePicker(false);
  }

  function handleClose() {
    navigation.navigate('HomeCalendar');
  }

  function handleSave() {
    let isValid = true;

    const parsedAmount = parseInt(amount || '0', 10);
    if (!amount || parsedAmount <= 0) {
      setAmountError('금액을 입력해주세요');
      isValid = false;
    } else {
      setAmountError('');
    }

    if (!description.trim()) {
      setDescriptionError('내역을 입력해주세요');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!selectedCategory) {
      setCategoryError('카테고리를 선택해주세요');
      isValid = false;
    } else {
      setCategoryError('');
    }

    if (!isValid) return;

    // TODO: API 연결 시 사용
    // await createSpendingRecord({ type: recordType, amount: parsedAmount, description, date: formatDateForISO(selectedDate), category: selectedCategory!, memo });

    console.log('[mock] 소비 기록 저장:', {
      type: recordType,
      amount: parsedAmount,
      description,
      date: formatDateForISO(selectedDate),
      category: selectedCategory,
      memo,
    });
    navigation.navigate('HomeCalendar');
  }

  const currentCategories = recordType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const markedDates = {
    [formatDateForISO(tempSelectedDate)]: {
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: colors.background,
    },
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { paddingTop: topInset }]}>
          {/* ── 헤더 ── */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>소비 등록</Text>
            <View style={styles.closeButton} />
          </View>

          <View style={styles.divider} />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 32 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── 유형 토글: 슬라이딩 pill ── */}
            <View style={styles.typeToggleContainer}>
              <TouchableOpacity
                style={[styles.typeButton, recordType === 'expense' && styles.typeButtonActive]}
                onPress={() => handleTypeChange('expense')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.typeButtonLabel,
                    recordType === 'expense' && styles.typeButtonLabelActive,
                  ]}
                >
                  지출
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, recordType === 'income' && styles.typeButtonActive]}
                onPress={() => handleTypeChange('income')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.typeButtonLabel,
                    recordType === 'income' && styles.typeButtonLabelActive,
                  ]}
                >
                  수입
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── 금액 ── */}
            <Input
              label="금액"
              required
              suffix="원"
              suffixStyle={styles.amountSuffixText}
              keyboardType="numeric"
              placeholder="0"
              value={formatAmount(amount)}
              onChangeText={handleAmountChange}
              error={amountError}
              style={styles.amountInputText}
              containerStyle={styles.amountContainer}
            />

            {/* ── 내역 ── */}
            <Input
              label="내역"
              required
              placeholder="스타벅스, 이마트, 택시 등"
              value={description}
              onChangeText={(text: string) => {
                setDescription(text);
                if (descriptionError) setDescriptionError('');
              }}
              error={descriptionError}
            />

            {/* ── 날짜 ── */}
            {/* Input 컴포넌트 미사용: 읽기 전용 + 달력 아이콘 필요 → 직접 스타일링 */}
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>날짜</Text>
                <Text style={styles.required}> *</Text>
              </View>
              <TouchableOpacity
                style={styles.dateRow}
                onPress={handleOpenDatePicker}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="날짜 선택"
              >
                <Text style={styles.dateText}>{formatDateForDisplay(selectedDate)}</Text>
                <Ionicons name="calendar-outline" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* ── 카테고리 ── */}
            <View>
              <Text style={styles.sectionTitle}>
                카테고리 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.chipGrid}>
                {currentCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => {
                        setSelectedCategory(cat.id);
                        setCategoryError('');
                      }}
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
              {!!categoryError && <Text style={styles.errorText}>{categoryError}</Text>}
            </View>

            {/* ── 메모 ── */}
            {/* TextArea: 회색 배경 + 테두리 없음 스타일의 멀티라인 입력 컴포넌트 */}
            <TextArea
              label="메모"
              placeholder="메모를 입력하세요"
              value={memo}
              onChangeText={setMemo}
              minHeight={120}
            />

            {/* ── 저장하기 ── */}
            <Button
              label="저장하기"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSave}
              style={styles.saveButton}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* ── 날짜 캘린더 모달 ── */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.calendarOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={[styles.calendarCard, { paddingBottom: bottomInset + 20 }]}>
            <Calendar
              current={formatDateForISO(tempSelectedDate)}
              onDayPress={(day: DateData) => setTempSelectedDate(new Date(day.dateString))}
              markedDates={markedDates}
              theme={{
                backgroundColor: colors.background,
                calendarBackground: colors.background,
                textSectionTitleColor: colors.textTertiary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.background,
                todayTextColor: colors.primary,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.textDisabled,
                arrowColor: colors.primary,
                monthTextColor: colors.textPrimary,
                textDayFontSize: fontSize.sm,
                textMonthFontSize: fontSize.base,
                textDayHeaderFontSize: fontSize.xs,
                textMonthFontWeight: fontWeight.semibold,
                textDayFontWeight: fontWeight.regular,
                textDayHeaderFontWeight: fontWeight.medium,
              }}
            />
            <View style={styles.calendarButtons}>
              <Button
                label="취소"
                variant="secondary"
                size="md"
                style={styles.calendarButtonHalf}
                onPress={() => setShowDatePicker(false)}
              />
              <Button
                label="확인"
                variant="primary"
                size="md"
                style={styles.calendarButtonHalf}
                onPress={handleConfirmDate}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },

  // ── 헤더 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 52,
  },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: colors.border },

  // ── 스크롤 ──
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, gap: 24 },

  // ── 유형 토글: 슬라이딩 pill ──
  typeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  typeButtonActive: {
    backgroundColor: colors.background,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textDisabled,
  },
  typeButtonLabelActive: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },

  amountContainer: {
    height: 72,
  },
  amountInputText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  amountSuffixText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
  },

  // ── 날짜 필드 (커스텀) ──
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderInput,
  },
  dateText: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },

  // ── 카테고리 섹션 라벨 ──
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: 12,
  },
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

  // ── 공통 ──
  required: { color: colors.error },
  errorText: { marginTop: 6, fontSize: fontSize.xs, color: colors.error },
  saveButton: { borderRadius: 12, marginTop: 4 },

  // ── 캘린더 모달 ──
  calendarOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  calendarCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  calendarButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  calendarButtonHalf: { flex: 1 },
});
