import { authenticatedRequest } from '@/services/api/apiClient';
import { EXPENSE_CATEGORY_IDS, expenseCategoryFromId } from '@/services/api/categoryIds';
import type {
  CreateSpendingRecordParams,
  RecordListItem,
  SpendingNature,
  SpendingRecord,
} from '@/types/record';

const emotionCodes: Record<SpendingNature, string> = {
  needed: 'NECESSARY',
  happy: 'SATISFIED',
  impulse: 'IMPULSE',
  relieved: 'STRESS_RELIEF',
  regret: 'REGRET',
};

interface RecordData {
  title: string;
  amount: number;
  memo: string | null;
}

interface ExpenseDetail extends RecordData {
  expenseDate: string;
  emotion: string | null;
  isRecurring: boolean;
}

interface IncomeDetail extends RecordData {
  categoryId: number;
}

export interface Transaction extends Pick<RecordData, 'title' | 'amount'> {
  id: number;
  type: 'EXPENSE' | 'INCOME';
  time: string;
  categoryId: number;
}

function natureFromCode(code: string | null) {
  return (
    (Object.keys(emotionCodes) as SpendingNature[]).find(
      (nature) => emotionCodes[nature] === code,
    ) ?? null
  );
}

export function toRecordListItem(item: Transaction, date: string): RecordListItem {
  return {
    id: String(item.id),
    type: item.type === 'INCOME' ? 'income' : 'expense',
    date,
    time: item.time,
    amount: Math.abs(item.amount),
    description: item.title,
    categoryId: item.categoryId,
    category: expenseCategoryFromId(item.categoryId),
  };
}

function recordPath(type: SpendingRecord['type'], id?: string) {
  const collection = type === 'income' ? '/incomes' : '/expenses';
  return id ? collection + '/' + encodeURIComponent(id) : collection;
}

export async function fetchRecordDetail(
  record: RecordListItem,
  signal: AbortSignal,
): Promise<SpendingRecord> {
  const path = recordPath(record.type, record.id);
  if (record.type === 'income') {
    const detail = await authenticatedRequest<IncomeDetail>(path, { signal });
    return {
      ...record,
      type: 'income',
      amount: detail.amount,
      description: detail.title,
      memo: detail.memo ?? undefined,
      categoryId: detail.categoryId,
      category: expenseCategoryFromId(detail.categoryId),
    };
  }
  const detail = await authenticatedRequest<ExpenseDetail>(path, { signal });
  const [date, time] = detail.expenseDate.split('T');
  return {
    ...record,
    type: 'expense',
    date,
    time,
    amount: detail.amount,
    description: detail.title,
    memo: detail.memo ?? undefined,
    spendingNature: natureFromCode(detail.emotion),
    isRecurring: detail.isRecurring,
  };
}

export async function saveRecord(
  params: CreateSpendingRecordParams,
  previous?: SpendingRecord,
): Promise<SpendingRecord> {
  const now = new Date();
  const currentTime = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
  const dateTime = params.date + 'T' + (previous?.time ?? currentTime);
  if (params.category === 'allowance') throw new Error('지원하지 않는 수입 카테고리예요.');
  const categoryId =
    previous?.category === params.category
      ? previous.categoryId
      : EXPENSE_CATEGORY_IDS[params.category];
  const fields = {
    amount: params.amount,
    title: params.description,
    memo: params.memo,
    categoryId,
  };
  const body =
    params.type === 'income'
      ? { ...fields, incomeDate: dateTime }
      : {
          ...fields,
          expenseDate: dateTime,
          emotion: params.spendingNature ? emotionCodes[params.spendingNature] : null,
          isRecurring: params.isRecurring,
        };
  const saved = await authenticatedRequest<{ id: number }>(recordPath(params.type, previous?.id), {
    method: previous ? 'PUT' : 'POST',
    body: JSON.stringify(body),
  });
  return {
    ...params,
    id: String(saved.id),
    categoryId,
    time: previous?.time ?? currentTime,
  };
}

export async function deleteRecord(record: SpendingRecord) {
  await authenticatedRequest<void>(recordPath(record.type, record.id), { method: 'DELETE' });
}
