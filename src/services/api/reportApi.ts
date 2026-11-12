import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { ApiError, authenticatedRequest } from '@/services/api/apiClient';
import { expenseCategoryFromId } from '@/services/api/categoryIds';
import { fetchHomeSummary } from '@/services/api/homeApi';
import type { MonthlyReport, PeerComparisonItem } from '@/types/report';

interface MonthlyReportResponse {
  yearMonth: string;
  totalExpense: number;
  totalBudget: number;
  categoryRatios: { categoryId: number; amount: number; ratio: number }[];
  monthlyTrends: { yearMonth: string; totalExpense: number }[];
  categoryBudgets: { categoryId: number; budget: number; expense: number }[];
}

interface PeerComparisonResponse {
  categories: { categoryId: number; myAmount: number; peerAmount: number }[];
}

function reportCategory(categoryId: number) {
  const category = expenseCategoryFromId(categoryId);
  return { category, label: BUDGET_CATEGORY_META[category].label };
}

export async function fetchPeerComparison(
  yearMonth: string,
  signal: AbortSignal,
): Promise<PeerComparisonItem[]> {
  try {
    const { categories } = await authenticatedRequest<PeerComparisonResponse>(
      '/spending-stats/peer-comparison?yearMonth=' + yearMonth,
      { signal },
    );
    return categories
      .map(({ categoryId, myAmount, peerAmount }) => ({
        ...reportCategory(categoryId),
        actual: myAmount,
        average: peerAmount,
      }))
      .sort((a, b) => b.actual - a.actual);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404 &&
      (error.code === 'INCOME_404_001' || error.code === 'BUDGET_404_003')
    ) {
      return [];
    }
    throw error;
  }
}

export async function fetchMonthlyReport(
  yearMonth: string,
  signal: AbortSignal,
): Promise<MonthlyReport> {
  const query = 'yearMonth=' + yearMonth;
  const [report, { totalIncome }] = await Promise.all([
    authenticatedRequest<MonthlyReportResponse>('/report/monthly?' + query, { signal }),
    fetchHomeSummary(yearMonth, signal),
  ]);
  const [year, month] = report.yearMonth.split('-').map(Number);

  return {
    year,
    month,
    totalExpense: report.totalExpense,
    totalIncome,
    totalBudget: report.totalBudget,
    categorySpending: report.categoryRatios.map(({ categoryId, amount, ratio }) => ({
      ...reportCategory(categoryId),
      amount,
      ratio,
    })),
    monthlyTrend: report.monthlyTrends.map((item) => ({
      label: `${Number(item.yearMonth.slice(5))}월`,
      amount: item.totalExpense,
      isCurrent: item.yearMonth === report.yearMonth,
    })),
    budgetComparison: report.categoryBudgets
      .map(({ categoryId, budget, expense }) => ({
        ...reportCategory(categoryId),
        budget,
        actual: expense,
      }))
      .sort((a, b) => b.actual - a.actual),
  };
}
