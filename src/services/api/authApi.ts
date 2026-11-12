import { ApiError, request } from '@/services/api/apiClient';
import { AuthError, type AuthResponse, type LoginParams, type SignupParams } from '@/types/auth';

export async function login(params: LoginParams): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function signup(params: SignupParams): Promise<AuthResponse> {
  try {
    return await request<AuthResponse>('/auth/signup', {
      method: 'POST',
      // TODO: 약관 동의 화면 구현 후 사용자가 선택한 동의 값을 연동한다.
      body: JSON.stringify({ ...params, agreeToTerms: true }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.code === 'AUTH_409_001') {
      throw new AuthError('이미 가입된 계정이에요.');
    }
    throw error;
  }
}
