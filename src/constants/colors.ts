/** 새 화면 이미지 기준의 의미별 색상. 기존 키는 화면 전환 중에도 유지한다. */
export const colors = {
  primary: '#1DA7E0',
  primaryDark: '#087FB5',
  primaryLight: '#E7F5FE',

  background: '#FFFFFF',
  backgroundAlt: '#F8F9FA',
  surfaceMuted: '#F3F4F6',
  disabledBg: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',

  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textDisabled: '#9CA3AF',

  border: '#E5E7EB',
  borderInput: '#D1D5DB',

  error: '#F0445C',
  errorBg: '#FEF2F2',

  income: '#0BAE84',
  incomeBg: '#F0FDF4',
  expense: '#F0445C',
  expenseBg: '#FEF2F2',
  planned: '#D97706',
  plannedBg: '#FFFBEB',
  plannedBorder: '#FCD34D',

  shadow: '#000000',
} as const;
