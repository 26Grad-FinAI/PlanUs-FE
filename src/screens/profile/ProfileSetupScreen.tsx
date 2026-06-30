/**
 * 프로필 입력 화면 (온보딩 1단계)
 *
 * 사용자의 기본 재무 정보를 수집한다.
 * 입력된 정보는 다음 단계인 BudgetRecommendationScreen에서
 * AI 맞춤 예산 산출에 활용된다.
 *
 * 수집 항목:
 * - 나이, 성별
 * - 월 소득(세후), 월 고정 지출 (항목별 추가 가능)
 * - 목표 저축액 (언제까지 얼마)
 * - 취업 여부, 주택 소유 유무
 * - 최다 소비 카테고리 (단일 선택)
 *
 * 토글 버튼(성별/취업 여부/주택 소유), 고정 지출 입력, 목표 저축액 드롭다운 피커,
 * 카테고리 칩 선택은 각각 별도 컴포넌트로 분리되어 있다 (ToggleGroup, FixedExpenseInput,
 * SavingsGoalInput, CategoryChipSelect). 이 화면은 전체 폼 상태 관리와 유효성 검사,
 * 레이아웃 조립만 담당한다.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ToggleGroup } from '@/components/common/ToggleGroup';
import { FixedExpenseInput } from '@/components/domain/profile/FixedExpenseInput';
import { SavingsGoalInput } from '@/components/domain/profile/SavingsGoalInput';
import { CategoryChipSelect } from '@/components/domain/profile/CategoryChipSelect';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { OnboardingStackParamList } from '@/app/navigation/types';
import { Gender, HomeOwnership, TopSpendingCategory, FixedExpenseItem } from '@/types/profile';

type ProfileSetupNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'ProfileSetup'
>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupNavigationProp;
}

const CURRENT_YEAR = new Date().getFullYear();

// 숫자 문자열 → 천 단위 콤마 포맷 (예: "3000000" → "3,000,000")
// 금액 입력 필드에서 사용자에게 가독성 있는 숫자를 보여주기 위해 사용
function formatAmount(value: string): string {
  if (!value) return '';
  const num = parseInt(value, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
}

export function ProfileSetupScreen({ navigation }: ProfileSetupScreenProps) {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  // ── 폼 상태 ──
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState('');

  // 월 고정 지출은 동적으로 추가/삭제할 수 있으므로 배열로 관리
  // 빈 항목 1개를 초기값으로 제공해 사용자가 즉시 입력 시작 가능하도록 함
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseItem[]>([
    { id: '1', label: '', amount: '' },
  ]);

  // 목표 저축액: 연도·월·금액을 별도로 관리해 각 필드를 독립적으로 검증
  const [savingsTargetYear, setSavingsTargetYear] = useState('');
  const [savingsTargetMonth, setSavingsTargetMonth] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');

  const [isEmployed, setIsEmployed] = useState<boolean | null>(null);
  const [ownsHome, setOwnsHome] = useState<HomeOwnership | null>(null);

  // 카테고리는 단일 선택 — 가장 많이 지출하는 1개만 선택
  const [selectedCategory, setSelectedCategory] = useState<TopSpendingCategory | null>(null);

  // ── 에러 상태 ──
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [incomeError, setIncomeError] = useState('');
  // 연도·월·금액을 묶어 하나의 에러로 관리 (세 필드가 하나의 목표를 구성하므로)
  const [savingsGoalError, setSavingsGoalError] = useState('');
  const [employmentError, setEmploymentError] = useState('');
  const [homeError, setHomeError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // ── 고정 지출 항목 추가 ──
  function handleAddFixedExpense() {
    setFixedExpenses((prev) => [
      ...prev,
      // id에 timestamp를 사용해 동일 렌더 사이클에서도 고유값 보장
      { id: Date.now().toString(), label: '', amount: '' },
    ]);
  }

  // ── 고정 지출 항목 삭제 ──
  function handleRemoveFixedExpense(id: string) {
    setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  // ── 고정 지출 항목 필드 수정 ──
  function handleFixedExpenseChange(id: string, field: 'label' | 'amount', value: string) {
    setFixedExpenses((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'amount') {
          // 금액 필드는 숫자만 허용 (콤마 표시는 formatAmount 함수로 처리)
          return { ...item, amount: value.replace(/[^0-9]/g, '') };
        }
        return { ...item, label: value };
      }),
    );
  }

  // ── 목표 기간 확정 (SavingsGoalInput 내부 모달에서 확인을 눌렀을 때 호출) ──
  function handleConfirmSavingsPeriod(year: string, month: string) {
    setSavingsTargetYear(year);
    setSavingsTargetMonth(month);
    if (savingsGoalError) setSavingsGoalError('');
  }

  function handleSavingsAmountChange(value: string) {
    setSavingsAmount(value);
    if (savingsGoalError) setSavingsGoalError('');
  }

  // ── 카테고리 단일 선택 ──
  function handleSelectCategory(category: TopSpendingCategory) {
    setSelectedCategory(category);
    if (categoryError) setCategoryError('');
  }

  // ── 유효성 검사 ──
  function validate(): boolean {
    let isValid = true;

    const parsedAge = parseInt(age, 10);
    if (!age || isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      setAgeError('올바른 나이를 입력해주세요');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!gender) {
      setGenderError('성별을 선택해주세요');
      isValid = false;
    } else {
      setGenderError('');
    }

    const parsedIncome = parseInt(monthlyIncome || '0', 10);
    if (!monthlyIncome || parsedIncome <= 0) {
      setIncomeError('월 소득을 입력해주세요');
      isValid = false;
    } else {
      setIncomeError('');
    }

    // 목표 저축액은 필수 항목 — 기간(연도·월)과 금액 모두 입력해야 함
    const parsedSavingsYear = parseInt(savingsTargetYear, 10);
    const parsedSavingsMonth = parseInt(savingsTargetMonth, 10);
    const parsedSavings = parseInt(savingsAmount || '0', 10);

    if (!savingsTargetYear || isNaN(parsedSavingsYear) || parsedSavingsYear < CURRENT_YEAR) {
      setSavingsGoalError('목표 기간을 선택해주세요');
      isValid = false;
    } else if (
      !savingsTargetMonth ||
      isNaN(parsedSavingsMonth) ||
      parsedSavingsMonth < 1 ||
      parsedSavingsMonth > 12
    ) {
      setSavingsGoalError('목표 기간을 선택해주세요');
      isValid = false;
    } else if (!savingsAmount || parsedSavings <= 0) {
      setSavingsGoalError('목표 금액을 입력해주세요');
      isValid = false;
    } else {
      setSavingsGoalError('');
    }

    if (isEmployed === null) {
      setEmploymentError('취업 여부를 선택해주세요');
      isValid = false;
    } else {
      setEmploymentError('');
    }

    if (ownsHome === null) {
      setHomeError('주택 소유 여부를 선택해주세요');
      isValid = false;
    } else {
      setHomeError('');
    }

    if (!selectedCategory) {
      setCategoryError('카테고리를 선택해주세요');
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  }

  function handleNext() {
    if (!validate()) return;

    // TODO: API 연결 시 사용
    // await saveUserProfile({
    //   age: parseInt(age, 10),
    //   gender: gender!,
    //   monthlyIncome: parseInt(monthlyIncome, 10),
    //   fixedExpenses: fixedExpenses.filter(i => i.label && i.amount).map(i => ({ label: i.label, amount: parseInt(i.amount, 10) })),
    //   savingsGoal: { targetYear: parseInt(savingsTargetYear, 10), targetMonth: parseInt(savingsTargetMonth, 10), targetAmount: parseInt(savingsAmount, 10) },
    //   isEmployed: isEmployed!,
    //   ownsHome: ownsHome!,
    //   topSpendingCategory: selectedCategory!,
    // });

    console.log('[mock] 프로필 저장:', {
      age,
      gender,
      monthlyIncome,
      fixedExpenses: fixedExpenses.filter((i) => i.label || i.amount),
      savingsGoal: { year: savingsTargetYear, month: savingsTargetMonth, amount: savingsAmount },
      isEmployed,
      ownsHome,
      topSpendingCategory: selectedCategory,
    });

    navigation.navigate('BudgetRecommendation');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: topInset }]}>
        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={styles.backText}>뒤로</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 페이지 제목 ── */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>{'맞춤 예산을 위해\n정보를 입력해주세요'}</Text>
            <Text style={styles.pageSubtitle}>입력하신 정보로 AI가 최적의 예산을 제안합니다</Text>
          </View>

          {/* ── 나이 ── */}
          <Input
            label="나이"
            required
            keyboardType="numeric"
            placeholder="만 나이를 입력하세요"
            suffix="세"
            value={age}
            onChangeText={(text) => {
              setAge(text.replace(/[^0-9]/g, ''));
              if (ageError) setAgeError('');
            }}
            error={ageError}
          />

          {/* ── 성별 ── */}
          <ToggleGroup
            label="성별"
            required
            options={[
              { label: '남', value: 'male' },
              { label: '여', value: 'female' },
            ]}
            selectedValue={gender}
            onSelect={(value) => {
              setGender(value as Gender);
              if (genderError) setGenderError('');
            }}
            error={genderError}
          />

          {/* ── 월 소득(세후) ── */}
          <Input
            label="월 소득 (세후)"
            required
            keyboardType="numeric"
            placeholder="3000000"
            suffix="원"
            value={formatAmount(monthlyIncome)}
            onChangeText={(text) => {
              setMonthlyIncome(text.replace(/[^0-9]/g, ''));
              if (incomeError) setIncomeError('');
            }}
            error={incomeError}
          />

          {/* ── 월 고정 지출 ── */}
          <FixedExpenseInput
            items={fixedExpenses}
            onAdd={handleAddFixedExpense}
            onRemove={handleRemoveFixedExpense}
            onChange={handleFixedExpenseChange}
          />

          {/* ── 목표 저축액 ── */}
          <SavingsGoalInput
            targetYear={savingsTargetYear}
            targetMonth={savingsTargetMonth}
            amount={savingsAmount}
            onConfirmPeriod={handleConfirmSavingsPeriod}
            onAmountChange={handleSavingsAmountChange}
            error={savingsGoalError}
          />

          {/* ── 취업 여부 ── */}
          <ToggleGroup
            label="취업 여부"
            required
            options={[
              { label: '예', value: 'true' },
              { label: '아니오', value: 'false' },
            ]}
            selectedValue={isEmployed === null ? null : String(isEmployed)}
            onSelect={(value) => {
              setIsEmployed(value === 'true');
              if (employmentError) setEmploymentError('');
            }}
            error={employmentError}
          />

          {/* ── 주택 소유 유무 ── */}
          <ToggleGroup
            label="주택 소유 유무"
            required
            options={[
              { label: '유', value: 'owned' },
              { label: '무', value: 'rented' },
            ]}
            selectedValue={ownsHome}
            onSelect={(value) => {
              setOwnsHome(value as HomeOwnership);
              if (homeError) setHomeError('');
            }}
            error={homeError}
          />

          {/* ── 최다 소비 카테고리 ── */}
          <CategoryChipSelect
            label="최다 소비 카테고리"
            required
            hint="가장 많이 지출하는 카테고리 1개를 선택하세요"
            selected={selectedCategory}
            onSelect={handleSelectCategory}
            error={categoryError}
          />

          {/* ── 다음 버튼 ── */}
          <Button
            label="AI 예산 산출 시작"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleNext}
            style={styles.nextButton}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },

  // ── 헤더 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 52,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },

  // ── 스크롤 ──
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 28 },

  // ── 페이지 제목 ──
  titleSection: { gap: 8, marginBottom: 4 },
  pageTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  pageSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    lineHeight: 20,
  },

  // ── 하단 버튼 ──
  nextButton: { borderRadius: 12 },
});
