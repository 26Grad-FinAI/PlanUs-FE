import { BudgetCategory } from '@/types/budget';

/** 월 절약액은 양수로 보관하고 화면에서만 차감 기호를 붙인다. */
export interface SavingsPlan {
  id: string;
  category: BudgetCategory;
  description: string;
  monthlySavings: number;
}

export interface AIAnalysis {
  id: string;
  periodLabel: string;
  insight: string;
  plans: SavingsPlan[];
}

export interface AppliedSavingsPlan extends SavingsPlan {
  year: number;
  month: number;
  analysisId: string;
}

export type ApplySavingsResult = { success: true } | { success: false; message: string };
