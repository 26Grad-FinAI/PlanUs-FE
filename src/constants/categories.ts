/**
 * 소비/수입 카테고리 메타데이터 (라벨 + 아이콘)
 *
 * 소비 등록, AI 예산 추천, 홈 화면 등 여러 화면에서 동일한 카테고리 정보를
 * 각자 다른 형태로 중복 정의하던 것을 하나로 모았다.
 */

import Ionicons from '@expo/vector-icons/Ionicons';

import { SpendingCategory } from '@/types/record';
import { BudgetCategory } from '@/types/budget';

export interface CategoryItem {
  id: SpendingCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// 지출 카테고리 (10종) — 소비 등록 화면의 칩 노출 순서
export const EXPENSE_CATEGORIES = [
  { id: 'grocery', label: '식료품', icon: 'cart-outline' },
  { id: 'dining', label: '외식', icon: 'restaurant-outline' },
  { id: 'transport', label: '교통/운송', icon: 'bus-outline' },
  { id: 'clothing', label: '의류/미용', icon: 'shirt-outline' },
  { id: 'leisure', label: '문화/운동/펫', icon: 'film-outline' },
  { id: 'medical', label: '의료/건강', icon: 'medkit-outline' },
  { id: 'education', label: '교육', icon: 'book-outline' },
  { id: 'travel', label: '숙박/여행', icon: 'airplane-outline' },
  { id: 'telecom', label: '정보통신', icon: 'phone-portrait-outline' },
  { id: 'other', label: '기타', icon: 'ellipsis-horizontal' },
] satisfies CategoryItem[];

// 신규 수입은 시안의 용돈·기타만 선택한다. 월급은 프로필 월 소득에서 관리한다.
export const INCOME_CATEGORIES = [
  { id: 'allowance', label: '용돈', icon: 'gift-outline' },
  { id: 'other', label: '기타', icon: 'ellipsis-horizontal' },
] satisfies CategoryItem[];

// 카테고리 ID → {label, icon} 빠른 조회용 (지출 + 수입 전체)
export const CATEGORY_META: Record<
  SpendingCategory,
  { label: string; icon: CategoryItem['icon'] }
> = Object.fromEntries(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(({ id, label, icon }) => [id, { label, icon }]),
) as Record<SpendingCategory, { label: string; icon: CategoryItem['icon'] }>;

// 카테고리별 차트 색상 — 통계 화면에서 카테고리를 시각적으로 구분할 때 사용
export const CATEGORY_COLOR: Record<SpendingCategory, string> = {
  dining: '#1DA7E0',
  grocery: '#A799F1',
  leisure: '#7AD8C0',
  telecom: '#F8C769',
  travel: '#F79BC1',
  education: '#0EA5E9',
  clothing: '#F472B6',
  medical: '#14B8A6',
  transport: '#F8A866',
  other: '#CBD5E1',
  allowance: '#22C55E',
};

/** 예산도 등록과 같은 카테고리 표시를 사용한다. */
export const BUDGET_CATEGORY_META: Record<
  BudgetCategory,
  { label: string; icon: CategoryItem['icon'] }
> = {
  grocery: CATEGORY_META.grocery,
  dining: CATEGORY_META.dining,
  clothing: CATEGORY_META.clothing,
  leisure: CATEGORY_META.leisure,
  medical: CATEGORY_META.medical,
  education: CATEGORY_META.education,
  travel: CATEGORY_META.travel,
  transport: CATEGORY_META.transport,
  telecom: CATEGORY_META.telecom,
  other: CATEGORY_META.other,
};
