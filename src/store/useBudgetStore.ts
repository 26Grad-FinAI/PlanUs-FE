/** 확정한 프로필과 월 예산만 앱 실행 중 공유한다. */
import { create } from 'zustand';
import { AIBudgetRecommendation } from '@/types/budget';
import { UserProfile } from '@/types/profile';
export interface ConfirmedBudget {
  year: number;
  month: number;
  profile: UserProfile;
  recommendation: AIBudgetRecommendation;
}
interface BudgetState {
  confirmedBudget: ConfirmedBudget | null;
  confirmBudget: (budget: ConfirmedBudget) => void;
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
  reset: () => set({ confirmedBudget: null }),
}));
