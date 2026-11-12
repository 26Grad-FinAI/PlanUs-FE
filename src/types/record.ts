/**
 * 소비 기록 관련 타입 정의
 *
 * SpendingType   : 지출(expense) / 수입(income)
 * SpendingCategory : 카테고리 10종
 * SpendingRecord : 저장된 기록 한 건
 * CreateSpendingRecordParams : 기록 생성 시 필요한 파라미터
 */

// 지출 / 수입 구분
export type SpendingType = 'expense' | 'income';

export type SpendingNature = 'needed' | 'happy' | 'impulse' | 'relieved' | 'regret';

// 지출 카테고리 (10종)
// 수입 카테고리: allowance(용돈), other(기타)
export type SpendingCategory =
  | 'grocery'
  | 'dining'
  | 'transport'
  | 'clothing'
  | 'leisure'
  | 'medical'
  | 'education'
  | 'travel'
  | 'telecom'
  | 'allowance'
  | 'other';

/** 수입과 지출의 공통 입력값. */
interface RecordFields {
  amount: number;
  description: string;
  date: string;
  category: SpendingCategory;
  memo?: string;
}

export type CreateSpendingRecordParams = RecordFields &
  (
    | { type: 'expense'; spendingNature: SpendingNature | null; isRecurring: boolean }
    | { type: 'income'; spendingNature?: never; isRecurring?: never }
  );

export type SpendingRecord = CreateSpendingRecordParams & {
  id: string;
  time: string;
  categoryId: number;
};

export type RecordListItem = Pick<
  SpendingRecord,
  'id' | 'type' | 'description' | 'amount' | 'category' | 'categoryId' | 'date' | 'time'
>;
