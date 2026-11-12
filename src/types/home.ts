/**
 * 홈 화면 요약 정보 타입 정의
 *
 * HomeSummary : 이번 달 사용 금액/예산/남은 예산/소진율
 */

import type { RecordListItem } from '@/types/record';

export interface HomeSummary {
  // 이번 달 사용 금액
  totalExpense: number;
  // 이번 달 예산 총액
  budgetTotal: number;
  // 남은 예산 = budgetTotal - totalExpense
  remaining: number;
  // 예산 소진율 (%)
  usageRate: number;
  monthlyIncome: number;
  additionalIncome: number;
  totalIncome: number;
  fixedExpense: number;
  totalOutflow: number;
}

export interface DailyTotals {
  date: string;
  totalExpense: number;
  totalIncome: number;
}

export interface DateGroup {
  date: string;
  items: RecordListItem[];
}
