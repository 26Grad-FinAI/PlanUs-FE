/**
 * 입력 유효성 검사 유틸리티
 *
 * 각 함수는 { isValid, message } 형태를 반환하여
 * 컴포넌트에서 오류 메시지를 바로 표시할 수 있도록 한다.
 */

interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * 이메일 형식 검사
 * - 빈 값 여부
 * - RFC 5322 기반 간소화 정규식으로 형식 확인
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 비밀번호 검사
 * - 빈 값 여부
 * - 최소 8자 이상
 * - maxLength 옵션: 최대 글자 수 초과 여부
 */
export function validatePassword(
  password: string,
  options: { maxLength?: number } = {},
): ValidationResult {
  const { maxLength } = options;

  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }

  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }

  if (maxLength !== undefined && password.length > maxLength) {
    return { isValid: false, message: `비밀번호는 ${maxLength}자 이하여야 합니다.` };
  }

  return { isValid: true, message: '' };
}

/**
 * 비밀번호 확인 검사
 * - 빈 값 여부
 * - password와 일치 여부
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 닉네임 검사
 * - 빈 값 여부
 * - 최소 2자 이상
 */
export function validateNickname(nickname: string): ValidationResult {
  if (!nickname.trim()) {
    return { isValid: false, message: '닉네임을 입력해주세요.' };
  }

  if (nickname.trim().length < 2) {
    return { isValid: false, message: '닉네임은 2자 이상이어야 합니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 숫자 입력 검사 (금액, 나이 등)
 * - 빈 값 여부
 * - 음수 불가
 * - 최대값 제한 (선택적)
 */
export function validateNumber(
  value: string,
  options: { min?: number; max?: number; fieldName?: string } = {},
): ValidationResult {
  const { min = 0, max, fieldName = '값' } = options;

  if (!value.trim()) {
    return { isValid: false, message: `${fieldName}을(를) 입력해주세요.` };
  }

  const num = Number(value);
  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName}은(는) 숫자여야 합니다.` };
  }

  if (num < min) {
    return {
      isValid: false,
      message: `${fieldName}은(는) ${min} 이상이어야 합니다.`,
    };
  }

  if (max !== undefined && num > max) {
    return {
      isValid: false,
      message: `${fieldName}은(는) ${max} 이하여야 합니다.`,
    };
  }

  return { isValid: true, message: '' };
}
