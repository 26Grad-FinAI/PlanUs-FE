import { authenticatedRequest } from '@/services/api/apiClient';
import type { UserProfile } from '@/types/profile';

interface ProfilePayload {
  age: number;
  gender: 'MALE' | 'FEMALE';
  monthlyIncome: number;
  monthlyFixedExpenses: { name: string; amount: number }[];
  monthlySavingsGoal: number;
  employmentStatus: boolean;
  homeOwnership: boolean;
  selfIntroduction: string | null;
}

export function saveProfile(profile: UserProfile, signal?: AbortSignal) {
  if (profile.age === null) throw new Error('나이를 입력해주세요.');

  const body: ProfilePayload = {
    age: profile.age,
    gender: profile.gender === 'male' ? 'MALE' : 'FEMALE',
    monthlyIncome: profile.monthlyIncome,
    monthlyFixedExpenses: profile.fixedExpenses.map(({ label, amount }) => ({
      name: label,
      amount,
    })),
    monthlySavingsGoal: profile.monthlySavings,
    employmentStatus: profile.isEmployed,
    homeOwnership: profile.ownsHome === 'owned',
    selfIntroduction: profile.introduction,
  };

  return authenticatedRequest('/users/me/profile', {
    method: 'POST',
    body: JSON.stringify(body),
    signal,
  });
}

export async function fetchSavedProfile(signal: AbortSignal): Promise<UserProfile> {
  const profile = await authenticatedRequest<ProfilePayload>('/users/me/profile', { signal });
  return {
    age: profile.age,
    gender: profile.gender === 'MALE' ? 'male' : 'female',
    monthlyIncome: profile.monthlyIncome,
    fixedExpenses: profile.monthlyFixedExpenses.map(({ name, amount }) => ({
      label: name,
      amount,
    })),
    monthlySavings: profile.monthlySavingsGoal,
    isEmployed: profile.employmentStatus,
    ownsHome: profile.homeOwnership ? 'owned' : 'rented',
    introduction: profile.selfIntroduction ?? '',
  };
}
