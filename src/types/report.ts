/** 소비 통계 화면에 필요한 월별 집계와 비교 데이터. */
import { BudgetCategory } from '@/types/budget';

export interface CategorySpendingItem {
  category: BudgetCategory;
  label: string;
  amount: number;
  ratio: number;
}

export type CategoryBreakdownItem = Omit<CategorySpendingItem, 'category'> & {
  category: BudgetCategory | 'remaining';
};

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
  categorySpending: CategorySpendingItem[];
  monthlyTrend: MonthlyTrendItem[];
  budgetComparison: BudgetComparisonItem[];
}
