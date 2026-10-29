/** 화면 이미지의 2배 해상도를 논리 픽셀 기준으로 정리한 공통 치수. */
import { colors } from '@/constants/colors';

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
  page: 20,
  huge: 40,
} as const;
export const radius = { input: 8, button: 12, card: 16, large: 24, pill: 999 } as const;
export const metrics = {
  touch: 44,
  input: 48,
  button: 56,
  header: 52,
  icon: 24,
  tabBar: 70,
  contentMax: 640,
  modalMax: 360,
  hairline: 1,
} as const;
export const shadows = {
  floating: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  raised: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  menu: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;
