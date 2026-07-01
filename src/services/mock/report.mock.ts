/**
 * 소비 통계(월간 리포트) Mock 데이터 및 Mock API 함수
 *
 * 실제로는 백엔드가 월 단위로 집계해 한 번에 내려주는 값이라고 가정한다.
 * 화면은 연/월만 넘기고 직접 계산하지 않는다.
 */

import {
  BudgetComparisonItem,
  CategoryBreakdownItem,
  MonthlyReport,
  MonthlyTrendItem,
} from '@/types/report';

// 이번 달 카테고리별 예산 / 실제 지출 (전체 카테고리)
// 예산 비교 섹션은 이 전체 목록을 그대로 보여주고,
// 도넛(비중)은 여기서 상위 항목만 추리고 나머지는 '기타'로 묶는다
const CATEGORY_SPENDING: BudgetComparisonItem[] = [
  { category: 'dining', label: '외식', budget: 420000, actual: 450000 },
  { category: 'grocery', label: '식료품', budget: 420000, actual: 360000 },
  { category: 'leisure', label: '여가/문화', budget: 230000, actual: 240000 },
  { category: 'telecom', label: '정보통신', budget: 200000, actual: 180000 },
  { category: 'travel', label: '숙박/여행', budget: 180000, actual: 120000 },
  { category: 'education', label: '교육', budget: 120000, actual: 90000 },
  { category: 'clothing', label: '의류', budget: 100000, actual: 70000 },
  { category: 'medical', label: '의료/건강', budget: 80000, actual: 60000 },
  { category: 'alcohol', label: '주류', budget: 50000, actual: 40000 },
  { category: 'other', label: '기타', budget: 80000, actual: 50000 },
];

// 도넛 차트에 개별 표시할 최대 카테고리 수 (나머지는 '기타'로 합산)
const DONUT_TOP_N = 5;

// 최근 6개월 지출 추이 (조회 월에서 과거로 6개월). 마지막 항목이 조회 월
const TREND_AMOUNTS = [1400000, 1600000, 1800000, 1700000, 1550000, 1660000];

function buildMonthlyTrend(year: number, month: number): MonthlyTrendItem[] {
  return TREND_AMOUNTS.map((amount, index) => {
    // index 5(마지막)가 조회 월, 거기서 과거로 거슬러 올라간다
    const offset = TREND_AMOUNTS.length - 1 - index;
    const date = new Date(year, month - 1 - offset, 1);
    return {
      label: `${date.getMonth() + 1}월`,
      amount,
      isCurrent: offset === 0,
    };
  });
}

// 도넛/범례용 비중 데이터 — 상위 DONUT_TOP_N개만 개별 표시하고 나머지는 '기타'로 합산
function buildCategoryBreakdown(totalExpense: number): CategoryBreakdownItem[] {
  const toRatio = (amount: number) => Math.round((amount / totalExpense) * 100);
  // 지출이 없는(0원) 카테고리는 도넛/범례에 표시하지 않는다
  const sorted = CATEGORY_SPENDING.filter((item) => item.actual > 0).sort(
    (a, b) => b.actual - a.actual,
  );

  const top = sorted.slice(0, DONUT_TOP_N).map((item) => ({
    category: item.category,
    label: item.label,
    amount: item.actual,
    ratio: toRatio(item.actual),
  }));

  // 상위에 들지 못한 나머지 항목들을 '기타' 한 조각으로 합산
  const restAmount = sorted.slice(DONUT_TOP_N).reduce((sum, item) => sum + item.actual, 0);
  if (restAmount > 0) {
    top.push({ category: 'other', label: '기타', amount: restAmount, ratio: toRatio(restAmount) });
  }

  return top;
}

/**
 * 특정 월의 소비 통계 조회 (Mock)
 *
 * TODO: API 연결 시 사용
 * const res = await api.get('/report/monthly', { params: { year, month } });
 * return res.data;
 */
export async function fetchMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
  const totalExpense = CATEGORY_SPENDING.reduce((sum, item) => sum + item.actual, 0);
  const totalBudget = CATEGORY_SPENDING.reduce((sum, item) => sum + item.budget, 0);

  return {
    year,
    month,
    totalExpense,
    totalBudget,
    categoryBreakdown: buildCategoryBreakdown(totalExpense),
    monthlyTrend: buildMonthlyTrend(year, month),
    budgetComparison: CATEGORY_SPENDING,
  };
}
