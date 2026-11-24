import { ApiError, authenticatedRequest } from '@/services/api/apiClient';
import type { SavingsApplication, SavingsPlan, SavingsSuggestion } from '@/types/ai';

type SavingsPlanResponse = Omit<SavingsPlan, 'monthlySavingWon'> & {
  monthlySavingWon?: number | null;
};

interface SavingsSuggestionResponse {
  feedbackId: number;
  applied: boolean;
  actions: SavingsPlanResponse[];
}

export async function fetchSavingsSuggestion(
  yearMonth: string,
  signal: AbortSignal,
): Promise<SavingsSuggestion | null> {
  const query = new URLSearchParams({ yearMonth });
  try {
    const { feedbackId, applied, actions } = await authenticatedRequest<SavingsSuggestionResponse>(
      '/savings-simulation/suggest?' + query,
      { signal },
    );
    const plans = actions.map((plan): SavingsPlan => {
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
    return { feedbackId, applied, plans };
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === 'SIMULATION_404_001' || error.code === 'SIMULATION_404_002')
    ) {
      return null;
    }
    throw error;
  }
}

export function applySavingsPlans(
  yearMonth: string,
  feedbackId: number,
  selectedCategoryIds: number[],
) {
  return authenticatedRequest<SavingsApplication>('/savings-simulation/apply', {
    method: 'POST',
    body: JSON.stringify({ yearMonth, feedbackId, selectedCategoryIds }),
  });
}
