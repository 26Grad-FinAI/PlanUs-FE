/** 같은 화면에서 입력값을 유지하는 두 단계 프로필 설정. */
import React, { useRef, useState } from 'react';
import { BackHandler, Keyboard, ScrollViewInstance, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/app/navigation/types';
import { ScreenLayout } from '@/components/common/Layout';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { Input } from '@/components/common/Input';
import { AmountInput } from '@/components/common/AmountInput';
import { TextArea } from '@/components/common/TextArea';
import { ToggleGroup } from '@/components/common/ToggleGroup';
import { StepIndicator } from '@/components/common/ProgressBar';
import { Button } from '@/components/common/Button';
import { FixedExpenseInput } from '@/components/domain/profile/FixedExpenseInput';
import { ProfileDraft, ProfileErrors } from '@/types/profile';
import { validateProfileStep, normalizeProfile } from '@/utils/profile';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProfileSetup'>;
const INITIAL_DRAFT: ProfileDraft = {
  age: '',
  gender: null,
  isEmployed: null,
  ownsHome: null,
  monthlyIncome: '',
  monthlySavings: '',
  introduction: '',
  fixedExpenses: [{ id: '1', label: '', amount: '' }],
};
export function ProfileSetupScreen({ navigation }: Props) {
  const [draft, setDraft] = useState<ProfileDraft>(INITIAL_DRAFT);
  const [step, setStep] = useState<1 | 2>(1);
  const [stepErrors, setStepErrors] = useState<Record<1 | 2, ProfileErrors>>({ 1: {}, 2: {} });
  const scrollRef = useRef<ScrollViewInstance>(null);
  const expenseSequence = useRef(1);
  const submitting = useRef(false);
  const signOut = useAuthStore((state) => state.signOut);
  const errors = stepErrors[step];
  function update<K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setStepErrors((current) => ({
      ...current,
      [step]: {
        ...current[step],
        [field]: undefined,
        ...(['monthlyIncome', 'fixedExpenses', 'monthlySavings'].includes(field)
          ? { monthlySavings: undefined }
          : {}),
      },
    }));
  }
  function changeStep(next: 1 | 2) {
    Keyboard.dismiss();
    setStep(next);
    setStepErrors((current) => ({ ...current, [next]: {} }));
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }
  function goBack() {
    if (step === 2) changeStep(1);
    else signOut();
  }
  useFocusEffect(
    React.useCallback(() => {
      submitting.current = false;
      const listener = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step === 2) {
          Keyboard.dismiss();
          setStep(1);
          setStepErrors((current) => ({ ...current, 1: {} }));
          scrollRef.current?.scrollTo({ y: 0, animated: false });
        } else signOut();
        return true;
      });
      return () => listener.remove();
    }, [step, signOut]),
  );
  function submit() {
    const nextErrors = validateProfileStep(draft, step);
    setStepErrors((current) => ({ ...current, [step]: nextErrors }));
    if (Object.keys(nextErrors).length) return;
    if (step === 1) {
      changeStep(2);
    } else if (!submitting.current) {
      submitting.current = true;
      Keyboard.dismiss();
      const now = new Date();
      navigation.navigate('BudgetLoading', {
        profile: normalizeProfile(draft),
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });
    }
  }
  return (
    <ScreenLayout
      scrollRef={scrollRef}
      header={
        <View style={styles.header}>
          <Header onBack={goBack} backLabel="뒤로" divider={false} />
          <View style={styles.progress}>
            <StepIndicator current={step} />
          </View>
        </View>
      }
      contentStyle={styles.content}
    >
      {step === 1 ? (
        <>
          <View style={styles.copy}>
            <Text variant="title" accessibilityRole="header">
              맞춤 예산을 위해{'\n'}기본 정보를 입력해주세요
            </Text>
            <Text style={styles.description}>
              나이·성별·취업·주거 조건이 비슷한 집단의 공공데이터를 기반으로 예산을 산출해요
            </Text>
          </View>
          <Input
            variant="underline"
            label="나이"
            placeholder="만 나이를 입력하세요"
            suffix="세"
            style={styles.age}
            value={draft.age}
            onChangeText={(value) => update('age', value.replace(/[^0-9]/g, '').slice(0, 3))}
            keyboardType="number-pad"
            inputMode="numeric"
          />
          <ToggleGroup
            label="성별"
            required
            options={[
              { value: 'male', label: '남' },
              { value: 'female', label: '여' },
            ]}
            selectedValue={draft.gender}
            onSelect={(value) => update('gender', value)}
            error={errors.gender}
          />
          <ToggleGroup
            label="취업 여부"
            required
            options={[
              { value: 'yes', label: '예' },
              { value: 'no', label: '아니요' },
            ]}
            selectedValue={draft.isEmployed === null ? null : draft.isEmployed ? 'yes' : 'no'}
            onSelect={(value) => update('isEmployed', value === 'yes')}
            error={errors.isEmployed}
          />
          <ToggleGroup
            label="주택 소유 유무"
            required
            options={[
              { value: 'owned', label: '유' },
              { value: 'rented', label: '무' },
            ]}
            selectedValue={draft.ownsHome}
            onSelect={(value) => update('ownsHome', value)}
            error={errors.ownsHome}
          />
        </>
      ) : (
        <>
          <View style={styles.copy}>
            <Text variant="title" accessibilityRole="header">
              수입, 지출, 저축 목표와{'\n'}금전 상황을 알려주세요
            </Text>
            <Text style={styles.description}>
              적어주신 내용을 이번 달 예산과 소비 분석에 반영해요
            </Text>
          </View>
          <AmountInput
            variant="underline"
            label="월 소득"
            required
            value={draft.monthlyIncome}
            onChangeText={(value) => update('monthlyIncome', value)}
            error={errors.monthlyIncome}
          />
          <FixedExpenseInput
            items={draft.fixedExpenses}
            error={errors.fixedExpenses}
            onAdd={() =>
              update('fixedExpenses', [
                ...draft.fixedExpenses,
                { id: String(++expenseSequence.current), label: '', amount: '' },
              ])
            }
            onRemove={(id) =>
              update(
                'fixedExpenses',
                draft.fixedExpenses.filter((item) => item.id !== id),
              )
            }
            onChange={(id, field, value) =>
              update(
                'fixedExpenses',
                draft.fixedExpenses.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              )
            }
          />
          <AmountInput
            variant="underline"
            label="목표 저축액"
            required
            prefix="매달"
            hint="목표 저축액을 제외하고 남은 돈으로 예산을 산정해요"
            placeholder="0"
            value={draft.monthlySavings}
            onChangeText={(value) => update('monthlySavings', value)}
            error={errors.monthlySavings}
            accessibilityLabel="매달 목표 저축액"
          />
          <TextArea
            label="자기소개"
            required
            hint="최근 생활 변화, 금전 상황 등을 자유롭게 적어주세요. (10자 이상)"
            placeholder="ex. 2월에 자취를 시작했어요. 여행 자금 300만원을 모으는 중이에요."
            value={draft.introduction}
            onChangeText={(value) => update('introduction', value)}
            error={errors.introduction}
            minHeight={120}
            style={styles.introduction}
          />
        </>
      )}
      <Button label={step === 1 ? '다음' : 'AI 예산 산출 시작'} onPress={submit} />
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  introduction: { paddingTop: spacing.md },
  age: { textAlign: 'right', fontSize: 20 },
  header: { width: '100%', maxWidth: metrics.contentMax, alignSelf: 'center' },
  progress: { paddingHorizontal: spacing.page, paddingBottom: spacing.lg },
  content: { gap: spacing.section, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  copy: { gap: spacing.md },
  description: { color: colors.textTertiary, fontSize: 14, lineHeight: 22 },
});
