/** 등록과 상세에서 동일한 소비 성격 문구와 선택 순서를 사용한다. */
import { SpendingNature, SpendingType } from '@/types/record';
import { SelectOption } from '@/types/ui';

export const RECORD_TYPES: readonly SelectOption<SpendingType>[] = [
  { value: 'expense', label: '지출' },
  { value: 'income', label: '수입' },
];

export const SPENDING_NATURE_LABELS: Record<SpendingNature, string> = {
  needed: '필요한 소비였어요',
  happy: '만족스러웠어요',
  impulse: '충동적이었어요',
  relieved: '스트레스가 해소됐어요',
  regret: '후회돼요',
};

export const SPENDING_NATURE_OPTIONS = Object.entries(SPENDING_NATURE_LABELS).map(
  ([value, label]) => ({ value: value as SpendingNature, label }),
);
