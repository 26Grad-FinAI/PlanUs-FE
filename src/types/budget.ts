/**
 * AI 예산 추천 관련 타입 정의
 *
 * BudgetCategory          : 예산을 배분할 지출 카테고리 (소비 기록과 동일)
 * CategoryBudget          : 카테고리 1건 — AI 추천값과 사용자 설정값을 함께 보관
 * AIBudgetRecommendation  : AI가 반환하는 전체 추천 결과
 */

// 소비 등록 화면의 EXPENSE_CATEGORIES와 동일한 카테고리 집합
export type BudgetCategory =
  | 'grocery'
  | 'dining'
  | 'alcohol'
  | 'clothing'
  | 'leisure'
  | 'medical'
  | 'education'
  | 'travel'
  | 'telecom'
  | 'other';

export interface CategoryBudget {
  category: BudgetCategory;
  label: string;
  // AI가 산출한 카테고리 예산 — 초기화 기준값으로 사용, 사용자가 변경 불가
  aiAmount: number;
  // 사용자가 직접 조정한 카테고리 예산 — 화면에서 편집 가능
  userAmount: number;
}

export interface AIBudgetRecommendation {
  // AI가 계산한 총 예산 = sum(categories[*].aiAmount), 고정값
  aiTotalAmount: number;
  // 예산 산정 근거 — 화면 상단 인사이트 카드에 표시
  insight: string;
  categories: CategoryBudget[];
}
