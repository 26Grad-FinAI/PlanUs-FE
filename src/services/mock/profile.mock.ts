/**
 * 프로필 mock 데이터
 *
 * 실제 API 연결 전까지 ProfileSetupScreen 및 관련 기능에서 사용한다.
 * 직장인 여성 28세, 월세 거주, 외식·쇼핑 위주 소비 패턴을 가정한 샘플 데이터다.
 */

import { UserProfile } from '@/types/profile';

export const mockUserProfile: UserProfile = {
  age: '28',
  gender: 'female',
  monthlyIncome: '3000000',
  fixedExpenses: [
    { id: '1', label: '월세', amount: '500000' },
    { id: '2', label: '보험료', amount: '150000' },
    { id: '3', label: '통신비', amount: '80000' },
  ],
  savingsGoal: {
    targetYear: '2026',
    targetMonth: '12',
    targetAmount: '5000000',
  },
  isEmployed: true,
  ownsHome: 'rented',
  topSpendingCategories: ['dining', 'clothing', 'leisure'],
};

// TODO: API 연결 시 사용
// export async function fetchUserProfile(): Promise<UserProfile> {
//   const res = await api.get('/profile');
//   return res.data;
// }

// TODO: API 연결 시 사용
// export async function saveUserProfile(params: CreateProfileParams): Promise<void> {
//   await api.post('/profile', params);
// }

export async function fetchUserProfile(): Promise<UserProfile> {
  return mockUserProfile;
}
