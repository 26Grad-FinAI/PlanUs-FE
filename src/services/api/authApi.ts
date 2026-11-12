import { ApiError, request } from '@/services/api/apiClient';
import { mockAuthResponse, MOCK_CREDENTIALS } from '@/services/mock/auth.mock';
import { AuthError, type AuthResponse, type LoginParams, type SignupParams } from '@/types/auth';

const mockPreview = __DEV__ && process.env.EXPO_PUBLIC_AUTH_PREVIEW === '1';

export async function login(params: LoginParams): Promise<AuthResponse> {
  if (mockPreview) {
    await mockRequestDelay();
    const emailMatches = params.email.trim().toLowerCase() === MOCK_CREDENTIALS.email;
    if (!emailMatches || params.password !== MOCK_CREDENTIALS.password) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    return mockAuthResponse;
  }

  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function signup(params: SignupParams): Promise<AuthResponse> {
  try {
    if (mockPreview) {
      await mockRequestDelay();
      if (params.email.toLowerCase() === MOCK_CREDENTIALS.email) {
        throw new AuthError('이미 가입된 계정이에요.');
      }
      return { ...mockAuthResponse, email: params.email };
    }

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

function mockRequestDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300));
}
