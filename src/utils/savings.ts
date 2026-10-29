import { AppliedSavingsPlan, SavingsPlan } from '@/types/ai';

/** 화면과 저장 로직이 같은 월/분석/플랜 식별 기준을 사용한다. */
export function getAppliedPlanIds(
  applied: AppliedSavingsPlan[],
  analysisId: string,
  year: number,
  month: number,
): Set<string> {
  return new Set(
    applied
      .filter(
        (item) => item.year === year && item.month === month && item.analysisId === analysisId,
      )
      .map((item) => item.id),
  );
}

export function calculateSavings(plans: SavingsPlan[]) {
  const monthly = plans.reduce((sum, plan) => sum + plan.monthlySavings, 0);
  return { monthly, annual: monthly * 12 };
}
