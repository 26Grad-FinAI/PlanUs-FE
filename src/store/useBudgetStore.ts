/** 확정한 프로필과 월 예산만 앱 실행 중 공유한다. */
import { create } from 'zustand';
import { EXPENSE_CATEGORY_IDS } from '@/services/api/categoryIds';
import type { SavingsApplication } from '@/types/ai';
import type { AIBudgetRecommendation } from '@/types/budget';
import type { UserProfile } from '@/types/profile';

export interface ConfirmedBudget {
  year: number;
  month: number;
  profile: UserProfile;
  recommendation: AIBudgetRecommendation;
}

interface BudgetState {
  confirmedBudget: ConfirmedBudget | null;
  confirmBudget: (budget: ConfirmedBudget) => void;
  updateAppliedSavings: (
    yearMonth: string,
    updates: SavingsApplication['updatedCategories'],
  ) => void;
  reset: () => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  confirmedBudget: null,
  confirmBudget: (budget) =>
    set({
      confirmedBudget: {
        ...budget,
        profile: {
          ...budget.profile,
          fixedExpenses: budget.profile.fixedExpenses.map((item) => ({ ...item })),
        },
        recommendation: {
          ...budget.recommendation,
          categories: budget.recommendation.categories.map((item) => ({ ...item })),
        },
      },
    }),
  updateAppliedSavings: (yearMonth, updates) =>
    set((state) => {
      const [year, month] = yearMonth.split('-').map(Number);
      const budget = state.confirmedBudget;
      if (!budget || budget.year !== year || budget.month !== month) return state;

      const amounts = new Map(updates.map(({ categoryId, after }) => [categoryId, after]));
      return {
        confirmedBudget: {
          ...budget,
          recommendation: {
            ...budget.recommendation,
            categories: budget.recommendation.categories.map((item) => {
              const userAmount = amounts.get(EXPENSE_CATEGORY_IDS[item.category]);
              return userAmount === undefined ? item : { ...item, userAmount };
            }),
          },
        },
      };
    }),
  reset: () => set({ confirmedBudget: null }),
}));
