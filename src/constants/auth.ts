/** 인증 화면의 시안 치수와 서비스 문구. */
export const authLayout = {
  contentMax: 440,
  wordmarkWidth: 220,
  wordmarkAspectRatio: 3,
  socialButtonSize: 52,
} as const;

export const authCopy = {
  introduction: '공공데이터 기반 소비 플래너',
  signupIntroduction: '플래너스와 함께 소비 계획을 시작해요',
} as const;

export const brandImages = {
  wordmark: require('../../assets/images/brand/planus-wordmark.png'),
  kakaoLogin: require('../../assets/images/social/kakao-login.png'),
  googleLogin: require('../../assets/images/social/google-login.png'),
} as const;
