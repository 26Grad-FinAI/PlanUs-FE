/** 확정한 프로필과 월 예산만 앱 실행 중 공유한다. */
import { create } from 'zustand';
import { AIBudgetRecommendation, BudgetCategory } from '@/types/budget';
import { UserProfile } from '@/types/profile';
import { AIAnalysis, AppliedSavingsPlan, ApplySavingsResult } from '@/types/ai';
import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { calculateSavings, getAppliedPlanIds } from '@/utils/savings';
export interface ConfirmedBudget {
  year: number;
  month: number;
  profile: UserProfile;
  recommendation: AIBudgetRecommendation;
}
interface BudgetState {
  confirmedBudget: ConfirmedBudget | null;
  appliedSavings: AppliedSavingsPlan[];
  confirmBudget: (budget: ConfirmedBudget) => void;
  applySavingsPlans: (analysis: AIAnalysis, planIds: string[]) => ApplySavingsResult;
  reset: () => void;
}
export const useBudgetStore = create<BudgetState>((set) => ({
  confirmedBudget: null,
  appliedSavings: [],
  confirmBudget: (budget) =>
    set({
      appliedSavings: [],
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
  applySavingsPlans: (analysis, planIds) => {
    let result: ApplySavingsResult = { success: false, message: '반영할 항목이 없어요.' };
    // 동기 업데이트 안에서 재검증하여 연속 클릭에도 같은 플랜이 중복 차감되지 않는다.
    set((state) => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const budget = state.confirmedBudget;
      if (!budget || budget.year !== year || budget.month !== month) {
        result = { success: false, message: '이번 달 예산을 먼저 설정해주세요.' };
        return state;
      }
      const appliedIds = getAppliedPlanIds(state.appliedSavings, analysis.id, year, month);
      const requestedIds = [...new Set(planIds)];
      const plans = analysis.plans.filter(
        (plan) => requestedIds.includes(plan.id) && !appliedIds.has(plan.id),
      );
      if (requestedIds.some((id) => !analysis.plans.some((plan) => plan.id === id))) {
        result = { success: false, message: '절약 플랜을 다시 확인해주세요.' };
        return state;
      }
      if (plans.length === 0) {
        result = { success: false, message: '아직 적용하지 않은 절약 플랜을 선택해주세요.' };
        return state;
      }
      const { annual } = calculateSavings(plans);
      if (
        plans.some(
          (plan) => !Number.isSafeInteger(plan.monthlySavings) || plan.monthlySavings <= 0,
        ) ||
        !Number.isSafeInteger(annual)
      ) {
        result = { success: false, message: '절약 금액을 다시 확인해주세요.' };
        return state;
      }
      const deductions = new Map<BudgetCategory, number>();
      plans.forEach((plan) =>
        deductions.set(plan.category, (deductions.get(plan.category) ?? 0) + plan.monthlySavings),
      );
      const exceeded = [...deductions].filter(([category, amount]) => {
        const item = budget.recommendation.categories.find((entry) => entry.category === category);
        return !item || item.userAmount < amount;
      });
      if (exceeded.length > 0) {
        const labels = exceeded.map(([category]) => BUDGET_CATEGORY_META[category].label);
        result = {
          success: false,
          message: `${labels.join(', ')}의 월 예산보다 절약 금액이 커요. 선택한 항목을 조정해주세요.`,
        };
        return state;
      }
      // 전체 검증 후 예산과 이력을 함께 저장하여 일부 플랜만 반영되는 것을 막는다.
      result = { success: true };
      return {
        confirmedBudget: {
          ...budget,
          recommendation: {
            ...budget.recommendation,
            categories: budget.recommendation.categories.map((item) => ({
              ...item,
              userAmount: item.userAmount - (deductions.get(item.category) ?? 0),
            })),
          },
        },
        appliedSavings: [
          ...state.appliedSavings,
          ...plans.map((plan) => ({ ...plan, year, month, analysisId: analysis.id })),
        ],
      };
    });
    return result;
  },
  reset: () => set({ confirmedBudget: null, appliedSavings: [] }),
}));
