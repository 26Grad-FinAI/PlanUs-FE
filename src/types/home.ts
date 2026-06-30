/**
 * 홈 화면 요약 정보 타입 정의
 *
 * HomeSummary : 이번 달 사용 금액/예산/남은 예산/소진율
 */

export interface HomeSummary {
  // 이번 달 사용 금액
  totalExpense: number;
  // 이번 달 예산 총액
  budgetTotal: number;
  // 남은 예산 = budgetTotal - totalExpense (0 미만으로 내려가지 않음)
  remaining: number;
  // 예산 소진율 (%), 0~100
  usageRate: number;
}
