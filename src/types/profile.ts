/**
 * 프로필 관련 타입 정의
 *
 * AI 예산 산출에 필요한 사용자 기본 정보 타입들을 정의한다.
 * 온보딩 첫 단계(ProfileSetupScreen)에서 수집하며,
 * 이후 BudgetRecommendationScreen으로 전달되어 AI 예산 산출에 활용된다.
 */

// 성별
export type Gender = 'male' | 'female';

// 주택 소유 유무
export type HomeOwnership = 'owned' | 'rented';

// 최다 소비 카테고리 (record.ts의 SpendingCategory 중 지출 카테고리만 사용)
export type TopSpendingCategory =
  | 'grocery'
  | 'dining'
  | 'alcohol'
  | 'clothing'
  | 'leisure'
  | 'medical'
  | 'education'
  | 'travel'
  | 'telecom'
  | 'other';

// 월 고정 지출 항목 (항목명 + 금액)
export interface FixedExpenseItem {
  id: string;
  label: string; // 항목명 (예: 월세, 보험료)
  amount: string; // 금액 문자열 (숫자만, 콤마 없음)
}

// 목표 저축액 (언제까지 얼마 저축)
export interface SavingsGoal {
  targetYear: string; // 목표 연도 (4자리, 예: "2026")
  targetMonth: string; // 목표 월 (1~12, 예: "12")
  targetAmount: string; // 목표 금액 문자열 (숫자만)
}

// 폼에서 관리하는 프로필 데이터 (문자열 기반, 아직 파싱 전)
export interface UserProfile {
  age: string;
  gender: Gender | null;
  monthlyIncome: string;
  fixedExpenses: FixedExpenseItem[];
  savingsGoal: SavingsGoal;
  isEmployed: boolean | null;
  ownsHome: HomeOwnership | null;
  topSpendingCategory: TopSpendingCategory | null;
}

// API 전송용 파라미터 (숫자 타입으로 파싱 완료)
export interface CreateProfileParams {
  age: number;
  gender: Gender;
  monthlyIncome: number;
  fixedExpenses: Array<{ label: string; amount: number }>;
  // 목표 저축액을 입력하지 않은 경우 null 허용
  savingsGoal: {
    targetYear: number;
    targetMonth: number;
    targetAmount: number;
  } | null;
  isEmployed: boolean;
  ownsHome: HomeOwnership;
  topSpendingCategory: TopSpendingCategory;
}
