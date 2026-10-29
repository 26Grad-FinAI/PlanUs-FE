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
import { View, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DateField } from '@/components/common/DateField';
import { AmountInput } from '@/components/common/AmountInput';
import { toISODate } from '@/utils/formatDate';

import { SegmentedControl } from '@/components/common/SegmentedControl';
import { ChipGroup } from '@/components/common/Chip';
import { Checkbox } from '@/components/common/Checkbox';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { colors } from '@/constants/colors';
import { fontSize, fontFamily } from '@/constants/typography';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/categories';
import { MainTabParamList } from '@/app/navigation/types';
import { useRecordStore } from '@/store/useRecordStore';
import { SpendingType, SpendingCategory, SpendingNature } from '@/types/record';

type RecordAddNavigationProp = BottomTabNavigationProp<MainTabParamList, 'RecordAdd'>;

interface RecordAddScreenProps {
  navigation: RecordAddNavigationProp;
}

export function RecordAddScreen({ navigation }: RecordAddScreenProps) {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const addRecord = useRecordStore((s) => s.addRecord);
  const [recordType, setRecordType] = useState<SpendingType>('expense');
  const [amount, setAmount] = useState(''); // 숫자 문자열 (콤마 제외)
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory | null>(null);
  const [memo, setMemo] = useState('');
  const [spendingNature, setSpendingNature] = useState<SpendingNature | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [natureError, setNatureError] = useState('');

  const [amountError, setAmountError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      setRecordType('expense');
      setAmount('');
      setDescription('');
      setSelectedDate(today);
      setSelectedCategory(null);
      setMemo('');
      setSpendingNature(null);
      setIsRecurring(false);
      setNatureError('');
      setAmountError('');
      setDescriptionError('');
      setCategoryError('');
    }, []),
  );

  function handleTypeChange(type: SpendingType) {
    setRecordType(type);
    setSelectedCategory(null);
    setCategoryError('');
    setSpendingNature(null);
    setIsRecurring(false);
    setNatureError('');
  }

  function handleAmountChange(text: string) {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setAmount(digitsOnly);
    if (amountError) setAmountError('');
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

    if (recordType === 'expense' && !spendingNature) {
      setNatureError('소비 성격을 선택해주세요');
      isValid = false;
    } else {
      setNatureError('');
    }
    if (!isValid) return;

    // record store에 추가 → 홈 화면 등 store를 구독하는 화면이 자동으로 갱신된다
    // TODO: API 연결 시 store 대신 createSpendingRecord(params) 호출 후 서버 응답으로 갱신
    const values = {
      amount: parsedAmount,
      description,
      date: toISODate(selectedDate),
      category: selectedCategory!,
      memo,
    };
    if (recordType === 'income') {
      addRecord({ ...values, type: 'income' });
    } else if (spendingNature) {
      addRecord({ ...values, type: 'expense', spendingNature, isRecurring });
    }
    navigation.navigate('HomeCalendar');
  }

  const currentCategories = recordType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { paddingTop: topInset }]}>
          {/* ── 헤더 ── */}
          <Header title="소비 등록" onClose={handleClose} />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 32 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── 유형 토글: 슬라이딩 pill ── */}
            <SegmentedControl
              options={[
                { value: 'expense', label: '지출' },
                { value: 'income', label: '수입' },
              ]}
              value={recordType}
              onChange={handleTypeChange}
            />

            {/* ── 금액 ── */}
            <AmountInput
              label="금액"
              required
              suffix="원"
              suffixStyle={styles.amountSuffixText}
              placeholder="0"
              value={amount}
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

            <DateField required value={selectedDate} onChange={setSelectedDate} />

            <ChipGroup
              label="카테고리"
              required
              options={currentCategories.map((category) => ({
                value: category.id,
                label: category.label,
                icon: category.icon,
              }))}
              value={selectedCategory}
              onChange={(category) => {
                setSelectedCategory(category);
                setCategoryError('');
              }}
              error={categoryError}
            />

            {recordType === 'expense' && (
              <>
                <ChipGroup
                  label="소비 성격"
                  required
                  options={[
                    { value: 'needed', label: '필요한 소비였어요' },
                    { value: 'happy', label: '만족스러웠어요' },
                    { value: 'impulse', label: '충동적이었어요' },
                  ]}
                  value={spendingNature}
                  onChange={(value) => {
                    setSpendingNature(value);
                    setNatureError('');
                  }}
                  error={natureError}
                />
                <Checkbox
                  label="반복되는 지출이에요"
                  checked={isRecurring}
                  onChange={setIsRecurring}
                />
              </>
            )}

            {/* ── 메모 ── */}
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
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },

  // ── 스크롤 ──
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, gap: 24 },

  amountContainer: {
    height: 72,
  },
  amountInputText: {
    fontSize: fontSize['3xl'],
    fontFamily: fontFamily.bold,
  },
  amountSuffixText: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.medium,
  },
  saveButton: { borderRadius: 12, marginTop: 4 },
});
