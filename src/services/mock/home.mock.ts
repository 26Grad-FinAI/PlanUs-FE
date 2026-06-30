/**
 * 홈 화면 요약 정보 Mock 데이터 및 Mock API 함수
 *
 * 이번 달 사용 금액 / 예산 / 남은 예산 / 소진율은 실제로는 백엔드가
 * 월별로 한 번에 계산해서 내려주는 값이라고 가정한다.
 * 화면(HomeCalendarScreen)은 연/월만 넘기고 직접 합산하지 않는다.
 */

import { mockSpendingRecords } from './record.mock';
import { mockAIBudget } from './budget.mock';
import { HomeSummary } from '@/types/home';

/**
 * 특정 월의 홈 요약 정보 조회 (Mock)
 *
 * TODO: API 연결 시 사용
 * const res = await api.get(`/home/summary`, { params: { year, month } });
 * return res.data;
 */
export async function fetchHomeSummary(year: number, month: number): Promise<HomeSummary> {
  const budgetTotal = mockAIBudget.aiTotalAmount;

  const totalExpense = mockSpendingRecords
    .filter((record) => {
      const [recordYear, recordMonth] = record.date.split('-').map(Number);
      return record.type === 'expense' && recordYear === year && recordMonth === month;
    })
    .reduce((sum, record) => sum + record.amount, 0);

  const remaining = Math.max(budgetTotal - totalExpense, 0);
  const usageRate =
    budgetTotal > 0 ? Math.min(Math.round((totalExpense / budgetTotal) * 100), 100) : 0;

  return { totalExpense, budgetTotal, remaining, usageRate };
}
