import { authenticatedRequest } from '@/services/api/apiClient';
import { toRecordListItem, type Transaction } from '@/services/api/recordApi';
import type { DailyTotals, HomeSummary } from '@/types/home';

interface SummaryResponse {
  totalExpense: number;
  budget: number;
  remainingBudget: number;
  burnRate: number;
  income: Pick<HomeSummary, 'monthlyIncome' | 'additionalIncome' | 'totalIncome'>;
  expense: { fixedExpense: number; totalExpense: number };
}

export async function fetchHomeSummary(
  yearMonth: string,
  signal: AbortSignal,
): Promise<HomeSummary> {
  const result = await authenticatedRequest<SummaryResponse>(
    '/home/summary?yearMonth=' + yearMonth,
    {
      signal,
    },
  );
  return {
    ...result.income,
    totalExpense: result.totalExpense,
    budgetTotal: result.budget,
    remaining: result.remainingBudget,
    usageRate: result.burnRate,
    fixedExpense: result.expense.fixedExpense,
    totalOutflow: result.expense.totalExpense,
  };
}

export async function fetchHomeCalendar(yearMonth: string, signal: AbortSignal) {
  const result = await authenticatedRequest<{ dailySummaries: DailyTotals[] }>(
    '/home/calendar?yearMonth=' + yearMonth,
    { signal },
  );
  return result.dailySummaries;
}

export async function fetchDailyRecords(date: string, signal: AbortSignal) {
  const result = await authenticatedRequest<{ transactions: Transaction[] }>(
    '/home/daily?date=' + date,
    { signal },
  );
  const items = result.transactions
    .sort((a, b) => b.time.localeCompare(a.time) || b.id - a.id)
    .map((item) => toRecordListItem(item, date));
  return { items, nextCursor: null };
}

export async function fetchRecentRecords(yearMonth: string, signal: AbortSignal, cursor?: string) {
  const query = 'yearMonth=' + yearMonth + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '');
  const result = await authenticatedRequest<{
    transactions: (Transaction & { date: string })[];
    nextCursor: string | null;
  }>('/home/recent?' + query, { signal });
  return {
    items: result.transactions.map((item) => toRecordListItem(item, item.date)),
    nextCursor: result.nextCursor,
  };
}
