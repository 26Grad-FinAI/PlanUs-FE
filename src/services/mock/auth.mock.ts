/**
 * 인증 관련 Mock 데이터
 *
 * 인증 화면 미리보기에서만 사용한다.
 */

import { AuthResponse } from '@/types/auth';

/** 테스트용 계정 */
export const MOCK_CREDENTIALS = {
  email: 'test@planners.com',
  password: 'test1234',
} as const;

/** 로그인 성공 시 반환되는 Mock 응답 */
export const mockAuthResponse: AuthResponse = {
  userId: 1,
  email: MOCK_CREDENTIALS.email,
  accessToken: 'mock-access-token-abc123',
  refreshToken: 'mock-refresh-token-xyz789',
  profileCompleted: false, // AI 예산 추천 화면 테스트용 — 온보딩 미완료로 설정
};
