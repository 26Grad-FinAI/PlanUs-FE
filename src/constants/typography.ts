/** Pretendard 정적 파일을 굵기별로 지정해 플랫폼의 합성 굵기를 방지한다. */
export const fontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
} as const;

export const fontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '5xl': 48,
} as const;

export const typography = {
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  button: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
  section: { fontSize: 18, lineHeight: 26, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 34, fontWeight: '700' },
  amount: { fontSize: 32, lineHeight: 42, fontWeight: '700' },
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
