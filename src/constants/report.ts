/** 통계 차트는 예산의 분류를 사용하고 기존 카테고리 색상을 공유한다. */
import { CATEGORY_COLOR } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { CategoryBreakdownItem } from '@/types/report';

export const REPORT_CATEGORY_COLOR: Record<CategoryBreakdownItem['category'], string> = {
  ...CATEGORY_COLOR,
  transport: colors.primaryDark,
  remaining: CATEGORY_COLOR.other,
};

export const REPORT_VISIBLE_COUNT = 5;
