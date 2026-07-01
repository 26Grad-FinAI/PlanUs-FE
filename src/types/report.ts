/**
 * 소비 통계(월간 리포트) 타입 정의
 *
 * 화면에 필요한 모든 통계 값은 백엔드가 월 단위로 계산해 내려준다고 가정한다.
 * (카테고리별 비중 / 최근 6개월 추이 / 카테고리별 예산 대비 실제 지출)
 */

import { SpendingCategory } from '@/types/record';

// 카테고리별 지출 비중 (도넛 차트 + 범례용)
export interface CategoryBreakdownItem {
  category: SpendingCategory;
  label: string;
  amount: number;
  // 전체 지출 대비 비율 (0~100)
  ratio: number;
}

// 최근 N개월 지출 추이 (막대 차트용)
export interface MonthlyTrendItem {
  // 표시용 라벨 (예: "3월")
  label: string;
  amount: number;
  // 조회 기준월 여부 — 막대 강조에 사용
  isCurrent: boolean;
}

// 카테고리별 예산 대비 실제 지출 비교
export interface BudgetComparisonItem {
  category: SpendingCategory;
  label: string;
  budget: number;
  actual: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalExpense: number;
  totalBudget: number;
  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
  budgetComparison: BudgetComparisonItem[];
}
