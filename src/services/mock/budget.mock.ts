/** 입력한 여유 자금을 시안의 샘플 비율로 배분하는 Mock. */
import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { AIBudgetRecommendation, BudgetCategory } from '@/types/budget';
import { UserProfile } from '@/types/profile';
const SAMPLE_WEIGHTS: Record<BudgetCategory, number> = {
  grocery: 200,
  dining: 150,
  clothing: 80,
  leisure: 100,
  medical: 50,
  education: 120,
  travel: 80,
  transport: 80,
  telecom: 80,
  other: 0,
};
function distributeBudget(total: number): AIBudgetRecommendation {
  const weightTotal = Object.values(SAMPLE_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  const categories = (Object.keys(SAMPLE_WEIGHTS) as BudgetCategory[]).map((category) => {
    const amount = Math.floor((total / 1000) * (SAMPLE_WEIGHTS[category] / weightTotal)) * 1000;
    return {
      category,
      label: BUDGET_CATEGORY_META[category].label,
      aiAmount: amount,
      userAmount: amount,
    };
  });
  // 반올림 오차를 가장 큰 비중에 합쳐 총액과 카테고리 합계를 일치시킨다.
  const remainder = total - categories.reduce((sum, category) => sum + category.aiAmount, 0);
  categories[0].aiAmount += remainder;
  categories[0].userAmount += remainder;
  return {
    aiTotalAmount: total,
    insight:
      '입력하신 소득에서 고정 지출과 목표 저축액을 제외하고, 샘플 소비 비율로 이번 달 예산을 나눴어요.',
    categories,
  };
}
export function createBudgetRecommendation(profile: UserProfile): AIBudgetRecommendation {
  const available =
    profile.monthlyIncome -
    profile.fixedExpenses.reduce((sum, item) => sum + item.amount, 0) -
    profile.monthlySavings;
  if (!Number.isSafeInteger(available) || available < 0)
    throw new Error('예산을 산출할 금액을 확인해주세요.');
  return distributeBudget(available);
}
export const mockAIBudget = distributeBudget(950000);
export function fetchAIBudgetRecommendation(
  profile: UserProfile,
  signal?: AbortSignal,
): Promise<AIBudgetRecommendation> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('예산 산출이 취소되었어요.'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('예산 산출이 취소되었어요.'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      try {
        resolve(createBudgetRecommendation(profile));
      } catch (error) {
        reject(error);
      }
    }, 2000);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
