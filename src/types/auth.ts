/**
 * 인증 관련 타입 정의
 */

/** 로그인 요청 파라미터 */
export interface LoginParams {
  email: string;
  password: string;
}

/** 회원가입 요청 파라미터 */
export interface SignupParams {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 로그인 / 회원가입 성공 응답
 */
export interface AuthResponse {
  userId: number;
  email: string;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  /** true면 프로필 입력이 완료된 상태 — 온보딩 스킵 여부 판단에 사용 */
  profileCompleted: boolean;
}

/**
 * 앱 전역에서 사용하는 인증된 사용자 정보
 * AuthResponse에서 토큰을 제외한 사용자 식별 정보만 포함
 */
export type AuthUser = Omit<AuthResponse, 'accessToken' | 'refreshToken'>;

/** 서버의 응답 형식과 분리한 화면용 인증 오류. */
export class AuthError extends Error {
  readonly code: 'EMAIL_ALREADY_REGISTERED';

  constructor(code: 'EMAIL_ALREADY_REGISTERED', message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}
