/** 프로필 단계별 검증과 화면 입력의 정규화. */
import { ProfileDraft, ProfileErrors, UserProfile } from '@/types/profile';

export function validateProfileStep(draft: ProfileDraft, step: 1 | 2): ProfileErrors {
  const errors: ProfileErrors = {};
  if (step === 1) {
    if (!draft.gender) errors.gender = '성별을 선택해주세요.';
    if (draft.isEmployed === null) errors.isEmployed = '취업 여부를 선택해주세요.';
    if (!draft.ownsHome) errors.ownsHome = '주택 소유 유무를 선택해주세요.';
    return errors;
  }
  const validMoney = (value: string) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
  if (!validMoney(draft.monthlyIncome)) errors.monthlyIncome = '월 소득을 입력해주세요.';
  if (!validMoney(draft.monthlySavings)) errors.monthlySavings = '매달 목표 저축액을 입력해주세요.';
  const rows = draft.fixedExpenses.filter((item) => item.label.trim() || item.amount);
  if (rows.some((item) => !item.label.trim() || !validMoney(item.amount))) {
    errors.fixedExpenses = '고정 지출의 항목명과 금액을 모두 입력해주세요.';
  }
  const fixedTotal = rows.reduce((sum, item) => sum + Number(item.amount), 0);
  if (!Number.isSafeInteger(fixedTotal))
    errors.fixedExpenses = '고정 지출의 총금액을 확인해주세요.';
  if (
    !errors.monthlyIncome &&
    !errors.monthlySavings &&
    !errors.fixedExpenses &&
    fixedTotal + Number(draft.monthlySavings) > Number(draft.monthlyIncome)
  ) {
    errors.monthlySavings = '고정 지출과 목표 저축액의 합계가 월 소득을 넘어요.';
  }
  if (draft.introduction.trim().length < 10)
    errors.introduction = '자기소개를 10자 이상 입력해주세요.';
  return errors;
}
export function normalizeProfile(draft: ProfileDraft): UserProfile {
  if (!draft.gender || draft.isEmployed === null || !draft.ownsHome) {
    throw new Error('기본 정보를 확인해주세요.');
  }
  return {
    age: draft.age ? Number(draft.age) : null,
    gender: draft.gender,
    isEmployed: draft.isEmployed,
    ownsHome: draft.ownsHome,
    monthlyIncome: Number(draft.monthlyIncome),
    monthlySavings: Number(draft.monthlySavings),
    introduction: draft.introduction.trim(),
    fixedExpenses: draft.fixedExpenses
      .filter((item) => item.label.trim() || item.amount)
      .map((item) => ({ label: item.label.trim(), amount: Number(item.amount) })),
  };
}
