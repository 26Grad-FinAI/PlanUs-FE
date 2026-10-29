/** 온보딩의 편집 중 입력과 검증 완료 프로필. */
export type Gender = 'male' | 'female';
export type HomeOwnership = 'owned' | 'rented';
export interface FixedExpenseItem {
  id: string;
  label: string;
  amount: string;
}
export interface ProfileDraft {
  age: string;
  gender: Gender | null;
  isEmployed: boolean | null;
  ownsHome: HomeOwnership | null;
  monthlyIncome: string;
  fixedExpenses: FixedExpenseItem[];
  monthlySavings: string;
  introduction: string;
}
export interface UserProfile {
  age: number | null;
  gender: Gender;
  isEmployed: boolean;
  ownsHome: HomeOwnership;
  monthlyIncome: number;
  fixedExpenses: { label: string; amount: number }[];
  monthlySavings: number;
  introduction: string;
}
export type ProfileErrors = Partial<Record<keyof ProfileDraft, string>>;
