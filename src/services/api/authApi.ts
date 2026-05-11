/**
 * 인증 API 서비스
 *
 * 현재는 mock 데이터를 반환하며, API 연결 시 주석 처리된 코드를 활성화한다.
 */

import { LoginParams, SignupParams, AuthResponse } from '@/types/auth';
import { mockAuthResponse, MOCK_CREDENTIALS } from '@/services/mock/auth.mock';

/**
 * 로그인 요청
 */
export async function login(params: LoginParams): Promise<AuthResponse> {
  // TODO: API 연결 시 아래 주석 해제
  // const res = await apiClient.post<AuthResponse>('/auth/login', params);
  // return res.data;

  const isValidEmail = params.email === MOCK_CREDENTIALS.email;
  const isValidPassword = params.password === MOCK_CREDENTIALS.password;

  if (!isValidEmail || !isValidPassword) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  return mockAuthResponse;
}

/**
 * 회원가입 요청
 */
export async function signup(params: SignupParams): Promise<AuthResponse> {
  // TODO: API 연결 시 아래 주석 해제
  // const res = await apiClient.post<AuthResponse>('/auth/signup', params);
  // return res.data;

  return {
    ...mockAuthResponse,
    email: params.email,
    // 회원가입 직후이므로 프로필 미완료 상태
    profileCompleted: false,
  };
}
