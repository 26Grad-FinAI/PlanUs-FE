/**
 * 인증 관련 Mock 데이터
 *
 * API 연결 전까지 이 데이터를 사용해 로그인/회원가입 동작을 시뮬레이션한다.
 * 실제 서버 연결 시 authApi.ts의 주석을 해제하면 됨.
 */

import { AuthResponse } from "@/types/auth";

/** 테스트용 계정 — 이 이메일/비밀번호로만 로그인 성공 */
export const MOCK_CREDENTIALS = {
  email: "test@planners.com",
  password: "test1234",
} as const;

/** 로그인 성공 시 반환되는 Mock 응답 (서버 응답 구조와 동일) */
export const mockAuthResponse: AuthResponse = {
  userId:           1,
  email:            MOCK_CREDENTIALS.email,
  nickname:         "김스펜드",
  accessToken:      "mock-access-token-abc123",
  refreshToken:     "mock-refresh-token-xyz789",
  profileCompleted: false, // 첫 로그인이므로 온보딩 미완료
};
