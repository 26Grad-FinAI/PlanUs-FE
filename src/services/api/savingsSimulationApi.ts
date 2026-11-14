import { ApiError, authenticatedRequest } from '@/services/api/apiClient';
import type { SavingsApplication, SavingsPlan } from '@/types/ai';

type SavingsPlanResponse = Omit<SavingsPlan, 'monthlySavingWon'> & {
  monthlySavingWon?: number | null;
};

export async function fetchSavingsPlans(yearMonth: string, signal: AbortSignal) {
  const query = new URLSearchParams({ yearMonth });
  try {
    const { actions } = await authenticatedRequest<{ actions: SavingsPlanResponse[] }>(
      '/savings-simulation/suggest?' + query,
      { signal },
    );
    return actions.map((plan): SavingsPlan => {
      const monthly = plan.monthlySavingWon;
      return {
        categoryId: plan.categoryId,
        categoryName: plan.categoryName,
        reductionWon: plan.reductionWon,
        currentBehavior: plan.currentBehavior,
        targetBehavior: plan.targetBehavior,
        contextInsight: plan.contextInsight,
        monthlySavingWon:
          typeof monthly === 'number' && Number.isFinite(monthly) ? monthly : plan.reductionWon,
      };
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === 'SIMULATION_404_001' || error.code === 'SIMULATION_404_002')
    ) {
      return [];
    }
    throw error;
  }
}

export function applySavingsPlans(yearMonth: string, selectedCategoryIds: number[]) {
  return authenticatedRequest<SavingsApplication>('/savings-simulation/apply', {
    method: 'POST',
    body: JSON.stringify({ yearMonth, selectedCategoryIds }),
  });
}
