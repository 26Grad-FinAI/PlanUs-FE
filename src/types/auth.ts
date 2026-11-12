export interface LoginParams {
  email: string;
  password: string;
}

export interface SignupParams extends LoginParams {
  nickname: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  userId: number;
  email: string;
  profileCompleted: boolean;
}

/** 회원가입 화면에서 중복 이메일 안내 모달을 열 때 사용한다. */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
