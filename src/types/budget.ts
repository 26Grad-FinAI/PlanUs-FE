/** 예산 시안의 분류와 추천·사용자 설정 금액. */
export type BudgetCategory =
  | 'grocery'
  | 'dining'
  | 'transport'
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
  // 추천값은 초기화 기준으로 보존한다.
  aiAmount: number;
  userAmount: number;
}

export interface AIBudgetRecommendation {
  // 추천 총액은 aiAmount의 합계이며 편집한 총액과 구분한다.
  aiTotalAmount: number;
  insight: string;
  categories: CategoryBudget[];
}
