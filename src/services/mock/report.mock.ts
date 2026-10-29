/** 입력 기록과 분리된 월별 샘플. 요약과 모든 차트는 같은 월별 원본에서 집계한다. */
import { BUDGET_CATEGORY_META } from '@/constants/categories';
import { REPORT_VISIBLE_COUNT } from '@/constants/report';
import { BudgetCategory } from '@/types/budget';
import { CategoryBreakdownItem, MonthlyReport, MonthlyTrendItem } from '@/types/report';

interface CategorySample {
  category: BudgetCategory;
  actual: number;
  budget: number;
  average: number;
}

const CATEGORY_SAMPLES: readonly CategorySample[] = [
  { category: 'dining', actual: 450000, budget: 420000, average: 320000 },
  { category: 'grocery', actual: 360000, budget: 420000, average: 380000 },
  { category: 'leisure', actual: 240000, budget: 230000, average: 180000 },
  { category: 'telecom', actual: 180000, budget: 200000, average: 150000 },
  { category: 'travel', actual: 120000, budget: 180000, average: 140000 },
  { category: 'education', actual: 80000, budget: 100000, average: 70000 },
  { category: 'clothing', actual: 60000, budget: 80000, average: 90000 },
  { category: 'medical', actual: 40000, budget: 60000, average: 35000 },
  { category: 'transport', actual: 30000, budget: 40000, average: 45000 },
  { category: 'other', actual: 10000, budget: 20000, average: 20000 },
];

interface MonthSample {
  expense: number;
  income: number;
  hasBudget: boolean;
  hasPeers: boolean;
}

// 앱을 시작한 월을 기준으로 시안을 확인하고, 과거 6번째 월에서 예산·비교 없음도 확인한다.
const anchor = new Date();
const anchorMonth = anchor.getFullYear() * 12 + anchor.getMonth();
const MONTH_SAMPLES: readonly MonthSample[] = [
  { expense: 1570000, income: 2300000, hasBudget: true, hasPeers: true },
  { expense: 1550000, income: 2300000, hasBudget: true, hasPeers: true },
  { expense: 1700000, income: 2500000, hasBudget: true, hasPeers: true },
  { expense: 1800000, income: 2300000, hasBudget: true, hasPeers: true },
  { expense: 1600000, income: 2400000, hasBudget: true, hasPeers: true },
  { expense: 1400000, income: 2300000, hasBudget: true, hasPeers: true },
  { expense: 850000, income: 1900000, hasBudget: false, hasPeers: false },
];

function getMonthSample(year: number, month: number): MonthSample | undefined {
  return MONTH_SAMPLES[anchorMonth - (year * 12 + month - 1)];
}

function buildMonthlyTrend(year: number, month: number): MonthlyTrendItem[] {
  return Array.from({ length: 6 }, (_, index) => {
    const offset = 5 - index;
    const date = new Date(year, month - 1 - offset, 1);
    return {
      label: `${date.getMonth() + 1}월`,
      amount: getMonthSample(date.getFullYear(), date.getMonth() + 1)?.expense ?? 0,
      isCurrent: offset === 0,
    };
  });
}

function buildCategoryBreakdown(
  items: MonthlyReport['budgetComparison'],
  totalExpense: number,
): CategoryBreakdownItem[] {
  if (totalExpense === 0) return [];
  const spending = items.filter((item) => item.actual > 0);
  const top: CategoryBreakdownItem[] = spending.slice(0, REPORT_VISIBLE_COUNT).map((item) => ({
    category: item.category,
    label: item.label,
    amount: item.actual,
    ratio: Math.round((item.actual / totalExpense) * 100),
  }));
  const remaining = spending
    .slice(REPORT_VISIBLE_COUNT)
    .reduce((sum, item) => sum + item.actual, 0);
  if (remaining > 0) {
    top.push({
      category: 'remaining',
      label: '그 외',
      amount: remaining,
      ratio: Math.round((remaining / totalExpense) * 100),
    });
  }
  return top;
}

export async function fetchMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
  const sample = getMonthSample(year, month);
  const baseExpense = CATEGORY_SAMPLES.reduce((sum, item) => sum + item.actual, 0);
  const totalExpense = sample?.expense ?? 0;
  const budgetComparison = sample
    ? CATEGORY_SAMPLES.map((item) => ({
        category: item.category,
        label: BUDGET_CATEGORY_META[item.category].label,
        budget: sample.hasBudget ? item.budget : 0,
        actual: Math.floor((item.actual * totalExpense) / baseExpense / 1000) * 1000,
      }))
    : [];

  // 천 원 단위 배분의 나머지를 합쳐 요약·도넛·추이의 총액이 달라지지 않게 한다.
  if (budgetComparison.length > 0) {
    const allocated = budgetComparison.reduce((sum, item) => sum + item.actual, 0);
    budgetComparison[0].actual += totalExpense - allocated;
    budgetComparison.sort((a, b) => b.actual - a.actual);
  }
  const averages = new Map(CATEGORY_SAMPLES.map((item) => [item.category, item.average]));

  return {
    year,
    month,
    totalExpense,
    totalIncome: sample?.income ?? 0,
    totalBudget: budgetComparison.reduce((sum, item) => sum + item.budget, 0),
    categoryBreakdown: buildCategoryBreakdown(budgetComparison, totalExpense),
    monthlyTrend: buildMonthlyTrend(year, month),
    budgetComparison,
    peerComparison: sample?.hasPeers
      ? budgetComparison.map((item) => ({
          category: item.category,
          label: item.label,
          actual: item.actual,
          average: averages.get(item.category) ?? 0,
        }))
      : [],
  };
}
