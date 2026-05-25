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

// 저장된 소비 기록 한 건
export interface SpendingRecord {
  id: string;
  type: SpendingType;
  amount: number;
  description: string;
  date: string;
  category: SpendingCategory;
  memo?: string;
  createdAt: string; // ISO 8601
}

// 소비 기록 생성 시 전달하는 파라미터
export interface CreateSpendingRecordParams {
  type: SpendingType;
  amount: number;
  description: string;
  date: string;
  category: SpendingCategory;
  memo?: string;
}
