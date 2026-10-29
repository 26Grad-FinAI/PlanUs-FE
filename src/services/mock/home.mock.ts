/**
 * 홈 화면 요약 정보 Mock 데이터 및 Mock API 함수
 *
 * 이번 달 사용 금액 / 예산 / 남은 예산 / 소진율은 실제로는 백엔드가
 * 월별로 한 번에 계산해서 내려주는 값이라고 가정한다.
 * 화면(HomeCalendarScreen)은 연/월만 넘기고 직접 합산하지 않는다.
 */

import { mockAIBudget } from './budget.mock';
import { mockUserProfile } from './profile.mock';
import { useRecordStore } from '@/store/useRecordStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { HomeSummary } from '@/types/home';

/**
 * 특정 월의 홈 요약 정보 조회 (Mock)
 *
 * TODO: API 연결 시 사용
 * const res = await api.get(`/home/summary`, { params: { year, month } });
 * return res.data;
 */
export async function fetchHomeSummary(year: number, month: number): Promise<HomeSummary> {
  const confirmed = useBudgetStore.getState().confirmedBudget;
  const isConfirmedMonth = confirmed?.year === year && confirmed.month === month;
  const profile = isConfirmedMonth ? confirmed.profile : mockUserProfile;
  const budgetTotal = isConfirmedMonth
    ? confirmed.recommendation.categories.reduce((sum, item) => sum + item.userAmount, 0)
    : mockAIBudget.aiTotalAmount;

  const monthRecords = useRecordStore.getState().records.filter((record) => {
    const [recordYear, recordMonth] = record.date.split('-').map(Number);
    return recordYear === year && recordMonth === month;
  });
  // 날짜 선택은 목록에만 적용하고 월 집계에는 영향을 주지 않는다.
  const totalExpense = monthRecords
    .filter((record) => record.type === 'expense')
    .reduce((sum, record) => sum + record.amount, 0);
  // 프로필 월 소득과 별도로 입력한 용돈·기타 수입을 추가 수입으로 합산한다.
  const additionalIncome = monthRecords
    .filter((record) => record.type === 'income')
    .reduce((sum, record) => sum + record.amount, 0);
  const fixedExpense = profile.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);

  const remaining = Math.max(budgetTotal - totalExpense, 0);
  const usageRate =
    budgetTotal > 0 ? Math.min(Math.round((totalExpense / budgetTotal) * 100), 100) : 0;

  return {
    totalExpense,
    budgetTotal,
    remaining,
    usageRate,
    monthlyIncome: profile.monthlyIncome,
    additionalIncome,
    totalIncome: profile.monthlyIncome + additionalIncome,
    fixedExpense,
    totalOutflow: fixedExpense + totalExpense,
  };
}
