/** 등록·수정의 초기값과 검증. 금액은 입력 중 문자열, 날짜는 로컬 날짜로 유지한다. */
import { CATEGORY_META, EXPENSE_CATEGORIES } from '@/constants/categories';
import { SpendingCategory, SpendingNature, SpendingRecord, SpendingType } from '@/types/record';

export interface RecordFormValues {
  type: SpendingType;
  amount: string;
  description: string;
  date: Date;
  category: SpendingCategory | null;
  spendingNature: SpendingNature | null;
  isRecurring: boolean;
  memo: string;
}

export type RecordFormErrors = Partial<
  Record<'amount' | 'description' | 'date' | 'category' | 'spendingNature', string>
>;

export function createRecordFormValues(record?: SpendingRecord): RecordFormValues {
  return {
    type: record?.type ?? 'expense',
    amount: record ? String(record.amount) : '',
    description: record?.description ?? '',
    date: record ? new Date(`${record.date}T00:00:00`) : new Date(),
    category: record?.category ?? null,
    spendingNature: record?.type === 'expense' ? record.spendingNature : null,
    isRecurring: record?.type === 'expense' ? record.isRecurring : false,
    memo: record?.memo ?? '',
  };
}

export function recordFormCategories(type: SpendingType, previous?: SpendingRecord) {
  if (type === 'expense') return EXPENSE_CATEGORIES;
  const other = { id: 'other' as const, ...CATEGORY_META.other };
  if (previous?.type === 'income' && previous.category !== 'other') {
    return [{ id: previous.category, ...CATEGORY_META[previous.category] }, other];
  }
  return [other];
}

export function validateRecordForm(
  values: RecordFormValues,
  previous?: SpendingRecord,
): RecordFormErrors {
  const errors: RecordFormErrors = {};
  const amount = Number(values.amount);
  if (!/^\d+$/.test(values.amount) || !Number.isSafeInteger(amount) || amount <= 0)
    errors.amount = '0원보다 큰 금액을 입력해주세요';
  if (!values.description.trim()) errors.description = '내역을 입력해주세요';
  else if (values.description.trim().length > 255)
    errors.description = '내역은 255자 이하로 입력해주세요';
  if (!Number.isFinite(values.date.getTime())) errors.date = '날짜를 선택해주세요';
  const categories = recordFormCategories(values.type, previous);
  if (!categories.some((category) => category.id === values.category))
    errors.category = '카테고리를 선택해주세요';
  const canKeepUnclassified = previous?.type === 'expense' && previous.spendingNature === null;
  if (values.type === 'expense' && !values.spendingNature && !canKeepUnclassified)
    errors.spendingNature = '소비 성격을 선택해주세요';
  return errors;
}
