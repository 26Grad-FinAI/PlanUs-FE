/** Pretendard 정적 파일을 굵기별로 지정해 플랫폼의 합성 굵기를 방지한다. */
export const fontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extrabold: 'Pretendard-ExtraBold',
  black: 'Pretendard-Black',
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
  '4xl': 32,
  '5xl': 48,
} as const;

export const typography = {
  caption: { fontSize: 12, lineHeight: 18, fontFamily: fontFamily.regular },
  label: { fontSize: 14, lineHeight: 20, fontFamily: fontFamily.medium },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fontFamily.regular },
  button: { fontSize: 18, lineHeight: 26, fontFamily: fontFamily.semibold },
  section: { fontSize: 18, lineHeight: 26, fontFamily: fontFamily.bold },
  title: { fontSize: 24, lineHeight: 34, fontFamily: fontFamily.bold },
  amount: { fontSize: 32, lineHeight: 42, fontFamily: fontFamily.bold },
  splashHeadline: {
    fontSize: 36,
    lineHeight: 50,
    letterSpacing: -0.75,
    fontFamily: fontFamily.extrabold,
  },
  splashWordmark: {
    fontSize: 44,
    lineHeight: 54,
    letterSpacing: -1.5,
    fontFamily: fontFamily.black,
  },
} as const;
