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

export type SpendingNature = 'needed' | 'happy' | 'impulse';

// 지출 카테고리 (10종)
// 수입 카테고리: salary(월급), allowance(용돈), other(기타)
export type SpendingCategory =
  | 'grocery'
  | 'dining'
  | 'alcohol'
  | 'clothing'
  | 'leisure'
  | 'medical'
  | 'education'
  | 'travel'
  | 'telecom'
  | 'salary'
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

/** 지출 전용 필드는 저장 단계에서 반드시 제공하고, 수입에는 포함하지 않는다. */
export type CreateSpendingRecordParams = RecordFields &
  (
    | { type: 'expense'; spendingNature: SpendingNature; isRecurring: boolean }
    | { type: 'income'; spendingNature?: never; isRecurring?: never }
  );

export type SpendingRecord = CreateSpendingRecordParams & {
  id: string;
  createdAt: string;
};
