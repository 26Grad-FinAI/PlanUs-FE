/** 소비 통계 화면에 필요한 월별 집계와 비교 데이터. */
import { BudgetCategory } from '@/types/budget';

export interface CategoryBreakdownItem {
  // 집계한 나머지 조각은 실제 ‘기타’ 카테고리와 구분한다.
  category: BudgetCategory | 'remaining';
  label: string;
  amount: number;
  ratio: number;
}

export interface MonthlyTrendItem {
  label: string;
  amount: number;
  isCurrent: boolean;
}

export interface BudgetComparisonItem {
  category: BudgetCategory;
  label: string;
  budget: number;
  actual: number;
}

export interface PeerComparisonItem {
  category: BudgetCategory;
  label: string;
  actual: number;
  average: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalExpense: number;
  totalIncome: number;
  totalBudget: number;
  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
  budgetComparison: BudgetComparisonItem[];
  peerComparison: PeerComparisonItem[];
}
