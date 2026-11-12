/** 신규 등록과 기존 기록 수정을 같은 입력 UI로 구성한다. */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/navigation/types';
import { DateField } from '@/components/common/DateField';
import { AmountInput } from '@/components/common/AmountInput';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { ChipGroup } from '@/components/common/Chip';
import { Checkbox } from '@/components/common/Checkbox';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { fontSize, fontFamily } from '@/constants/typography';
import { metrics, spacing, radius } from '@/constants/layout';
import { RECORD_TYPES, SPENDING_NATURE_OPTIONS } from '@/constants/record';
import { saveRecord } from '@/services/api/recordApi';
import { useRecordRevision } from '@/store/useRecordRevision';
import { CreateSpendingRecordParams, SpendingType } from '@/types/record';
import {
  createRecordFormValues,
  recordFormCategories,
  validateRecordForm,
  RecordFormValues,
} from '@/features/record/recordForm';
import { toISODate } from '@/utils/formatDate';

type Props = NativeStackScreenProps<RootStackParamList, 'RecordAdd' | 'RecordEdit'>;

export function RecordFormScreen({ navigation, route }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const editing = route.name === 'RecordEdit';
  const record = route.params?.record;
  // 날짜 선택 후 복귀해도 입력을 잃지 않도록 화면 생성 시 한 번만 초기화한다.
  const [values, setValues] = useState(() => createRecordFormValues(record));
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const saving = useRef(false);
  const mounted = useRef(false);
  const scroll = useRef<ScrollViewInstance>(null);
  const errors = submitted ? validateRecordForm(values, record) : {};
  const categories = recordFormCategories(values.type, record);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function change<K extends keyof RecordFormValues>(key: K, value: RecordFormValues[K]) {
    if (saving.current) return;
    setSaveError('');
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function changeType(type: SpendingType) {
    if (saving.current || editing || type === values.type) return;
    setValues({ ...createRecordFormValues(), type });
    setSubmitted(false);
    setSaveError('');
  }

  function close() {
    if (saving.current) return;
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Main', { screen: 'HomeCalendar' });
  }

  async function save() {
    if (saving.current) return;
    setSubmitted(true);
    if (Object.keys(validateRecordForm(values, record)).length || !values.category) {
      // 긴 지출 폼 아래에서 저장해도 위쪽의 필수 입력 오류를 확인할 수 있게 한다.
      scroll.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const fields = {
      amount: Number(values.amount),
      description: values.description.trim(),
      date: toISODate(values.date),
      category: values.category,
      memo: values.memo.trim(),
    };
    let params: CreateSpendingRecordParams;
    if (values.type === 'income') params = { ...fields, type: 'income' };
    else {
      params = {
        ...fields,
        type: 'expense',
        spendingNature: values.spendingNature,
        isRecurring: values.isRecurring,
      };
    }
    saving.current = true;
    setIsSaving(true);
    setSaveError('');
    try {
      const saved = await saveRecord(params, record);
      useRecordRevision.getState().invalidate();
      if (!mounted.current || !navigation.isFocused()) return;
      if (editing) {
        navigation.popTo('RecordDetail', { record: saved });
      } else {
        navigation.popTo('Main', { screen: 'HomeCalendar' });
      }
    } catch (error) {
      if (mounted.current) {
        setSaveError(error instanceof Error ? error.message : '내역을 저장하지 못했어요.');
      }
    } finally {
      saving.current = false;
      if (mounted.current) setIsSaving(false);
    }
  }

  if (editing && !record) {
    return (
      <View style={[styles.screen, { paddingTop: top }]}>
        <Header title="소비 수정" onClose={close} />
        <View style={styles.empty}>
          <Text>내역을 찾을 수 없어요</Text>
          <Button label="돌아가기" onPress={close} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined
      }
    >
      <View style={[styles.screen, { paddingTop: top }]}>
        <Header title={editing ? '소비 수정' : '소비 등록'} onClose={close} />
        <ScrollView
          ref={scroll}
          contentContainerStyle={[styles.content, { paddingBottom: bottom + spacing.section }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.typeControl}>
            <SegmentedControl
              compact
              options={RECORD_TYPES.map((option) => ({
                ...option,
                disabled: editing && option.value !== values.type,
              }))}
              value={values.type}
              onChange={changeType}
            />
          </View>
          <AmountInput
            label="금액"
            required
            value={values.amount}
            onChangeText={(value) => change('amount', value)}
            error={errors.amount}
            style={styles.amountText}
            suffixStyle={styles.amountSuffix}
            containerStyle={styles.amountContainer}
          />
          <Input
            label="내역"
            required
            placeholder={values.type === 'expense' ? '스타벅스, 이마트, 택시 등' : '부모님 용돈 등'}
            value={values.description}
            onChangeText={(value) => change('description', value)}
            error={errors.description}
            maxLength={255}
            returnKeyType="done"
          />
          <DateField
            required
            value={values.date}
            onChange={(value) => change('date', value)}
            error={errors.date}
          />
          <View style={styles.categorySection}>
            <ChipGroup
              label="카테고리"
              required
              compact
              options={categories.map(({ id, label, icon }) => ({ value: id, label, icon }))}
              value={values.category}
              onChange={(value) => change('category', value)}
              error={errors.category}
            />
          </View>
          {values.type === 'expense' && (
            <>
              <View style={styles.natureSection}>
                <ChipGroup
                  label="소비 성격"
                  required={record?.type !== 'expense' || record.spendingNature !== null}
                  compact
                  options={SPENDING_NATURE_OPTIONS}
                  value={values.spendingNature}
                  onChange={(value) => change('spendingNature', value)}
                  error={errors.spendingNature}
                />
              </View>
              <View style={styles.recurringSection}>
                <Checkbox
                  label="반복되는 지출이에요"
                  description="체크하면 매달 같은 날짜에 자동으로 등록돼요."
                  checked={values.isRecurring}
                  onChange={(value) => change('isRecurring', value)}
                />
              </View>
            </>
          )}
          <TextArea
            label="메모"
            placeholder="메모를 입력하세요"
            value={values.memo}
            onChangeText={(value) => change('memo', value)}
            minHeight={120}
          />
          {!!saveError && <Text accessibilityRole="alert">{saveError}</Text>}
          <Button
            label={editing ? '수정하기' : '저장하기'}
            fullWidth
            size="lg"
            onPress={save}
            loading={isSaving}
            style={styles.saveButton}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: metrics.contentMax,
    alignSelf: 'center',
    paddingHorizontal: spacing.page,
    paddingTop: spacing.xxl,
    // 780px 시안은 390px 논리 너비로 비교한다. 기본 필드 간격은 28px이다.
    gap: spacing.xxl + spacing.xs,
  },
  typeControl: { marginBottom: spacing.xxs },
  categorySection: { marginBottom: spacing.xs },
  natureSection: { marginBottom: spacing.sm + spacing.xxs },
  recurringSection: { marginBottom: spacing.xxs },
  amountContainer: { height: metrics.input * 1.5 },
  amountText: { fontSize: fontSize['3xl'], fontFamily: fontFamily.bold },
  amountSuffix: { fontSize: fontSize.xl, fontFamily: fontFamily.medium },
  saveButton: { borderRadius: radius.button, marginTop: spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
});
