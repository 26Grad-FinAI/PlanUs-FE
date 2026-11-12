import { ApiError, authenticatedRequest } from '@/services/api/apiClient';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import type { AIBudgetRecommendation, BudgetCategory, CategoryBudget } from '@/types/budget';

interface BudgetMonth {
  year: number;
  month: number;
}

type PlanStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

interface PlanState {
  status: PlanStatus;
  createdAt: string;
}

interface BudgetSummary {
  aiAnalysis: string | null;
  categories: { categoryId: number; aiAmount: number; userAmount: number }[];
}

interface PlanResult {
  aiResponse: { persona?: { display?: { summary?: string } } } | string | null;
}

const categoryIds: Record<BudgetCategory, number> = {
  grocery: 1,
  clothing: 2,
  medical: 3,
  transport: 4,
  leisure: 5,
  education: 6,
  dining: 7,
  travel: 8,
  telecom: 9,
  other: 10,
};

export const budgetWaitMs = 5 * 60 * 1000;

export function currentBudgetMonth(): BudgetMonth {
  // 백엔드의 산출 요청은 한국 시간 기준 이번 달에 생성된다.
  const koreaTime = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return { year: koreaTime.getUTCFullYear(), month: koreaTime.getUTCMonth() + 1 };
}

function monthQuery({ year, month }: BudgetMonth) {
  return '?yearMonth=' + year + '-' + String(month).padStart(2, '0');
}

function toRecommendation(summary: BudgetSummary, insight?: string): AIBudgetRecommendation {
  const amounts = new Map(summary.categories.map((item) => [item.categoryId, item]));
  const categories = EXPENSE_CATEGORIES.flatMap(({ id, label }) => {
    const amount = amounts.get(categoryIds[id]);
    return amount
      ? [{ category: id, label, aiAmount: amount.aiAmount, userAmount: amount.userAmount }]
      : [];
  });

  return {
    // 서버의 총액에는 저축액도 들어 있으므로, 조정 화면에는 지출 카테고리 합계를 표시한다.
    aiTotalAmount: categories.reduce((sum, item) => sum + item.aiAmount, 0),
    insight:
      insight?.trim() || summary.aiAnalysis?.trim() || '카테고리별 추천 금액을 확인해보세요.',
    categories,
  };
}

export async function fetchBudgetSummary(month: BudgetMonth, signal: AbortSignal) {
  try {
    const summary = await authenticatedRequest<BudgetSummary>(
      '/budget-plan/summary' + monthQuery(month),
      { signal },
    );
    return toRecommendation(summary);
  } catch (error) {
    if (error instanceof ApiError && error.code === 'INCOME_404_001') return null;
    throw error;
  }
}

async function fetchPlanStatus(query: string, signal: AbortSignal) {
  try {
    return await authenticatedRequest<PlanState>('/budget-plan/status' + query, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.code === 'BUDGET_404_003') return null;
    throw error;
  }
}

function waitForNextStatus(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('예산 상태 조회를 중단했어요.'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('예산 상태 조회를 중단했어요.'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, 3000);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export async function loadBudgetRecommendation(
  month: BudgetMonth,
  retry: boolean,
  signal: AbortSignal,
): Promise<AIBudgetRecommendation> {
  const query = monthQuery(month);
  let plan = await fetchPlanStatus(query, signal);
  // 서버는 15분 넘게 멈춘 요청만 다시 시작할 수 있다. 완료된 예산은 그대로 사용한다.
  const retryStuck =
    retry &&
    plan &&
    (plan.status === 'PENDING' || plan.status === 'IN_PROGRESS') &&
    Date.now() - Date.parse(plan.createdAt + '+09:00') > 15 * 60 * 1000;
  if (!plan || plan.status === 'FAILED' || retryStuck) {
    if (monthQuery(currentBudgetMonth()) !== query) {
      throw new Error('조회 월이 바뀌었어요. 이번 달 예산을 다시 요청해주세요.');
    }
    try {
      await authenticatedRequest<void>('/budget-plan/trigger', { method: 'POST', signal });
    } catch (error) {
      if (!(error instanceof ApiError) || error.code !== 'BUDGET_409_001') throw error;
    }
    plan = await fetchPlanStatus(query, signal);
  }

  while (plan?.status !== 'COMPLETED') {
    if (plan?.status === 'FAILED') throw new Error('예산 산출에 실패했어요. 다시 시도해주세요.');
    await waitForNextStatus(signal);
    plan = await fetchPlanStatus(query, signal);
  }

  const [result, summary] = await Promise.all([
    authenticatedRequest<PlanResult>('/budget-plan/result' + query, { signal }),
    authenticatedRequest<BudgetSummary>('/budget-plan/summary' + query, { signal }),
  ]);
  const insight =
    typeof result.aiResponse === 'object'
      ? result.aiResponse?.persona?.display?.summary
      : undefined;
  const recommendation = toRecommendation(summary, insight);
  if (!recommendation.categories.length)
    throw new Error('추천 예산의 카테고리를 불러오지 못했어요.');
  return recommendation;
}

export async function saveBudgetCategories(
  month: BudgetMonth,
  budgets: CategoryBudget[],
  insight: string,
  signal: AbortSignal,
): Promise<AIBudgetRecommendation> {
  const categories = budgets.map(({ category, userAmount }) => ({
    categoryId: categoryIds[category],
    amount: userAmount,
  }));
  const summary = await authenticatedRequest<BudgetSummary>(
    '/budget-plan/categories' + monthQuery(month),
    { method: 'PUT', body: JSON.stringify({ categories }), signal },
  );
  return toRecommendation(summary, insight);
}
