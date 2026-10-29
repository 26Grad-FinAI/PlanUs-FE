/** 프로필 조회에 사용하는 독립적인 샘플. */
import { UserProfile } from '@/types/profile';
export const mockUserProfile: UserProfile = {
  age: 28,
  gender: 'female',
  monthlyIncome: 3000000,
  fixedExpenses: [
    { label: '월세', amount: 500000 },
    { label: '보험료', amount: 150000 },
    { label: '통신비', amount: 80000 },
  ],
  monthlySavings: 500000,
  isEmployed: true,
  ownsHome: 'rented',
  introduction: '2월에 자취를 시작했어요. 여행 자금 300만원을 모으는 중이에요.',
};
export async function fetchUserProfile(): Promise<UserProfile> {
  return {
    ...mockUserProfile,
    fixedExpenses: mockUserProfile.fixedExpenses.map((item) => ({ ...item })),
  };
}
