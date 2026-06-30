/**
 * 소비/수입 카테고리 메타데이터 (라벨 + 아이콘)
 *
 * 소비 등록, AI 예산 추천, 홈 화면 등 여러 화면에서 동일한 카테고리 정보를
 * 각자 다른 형태로 중복 정의하던 것을 하나로 모았다.
 */

import { Ionicons } from '@expo/vector-icons';

import { SpendingCategory } from '@/types/record';

export interface CategoryItem {
  id: SpendingCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// 지출 카테고리 (10종) — 소비 등록 화면의 칩 노출 순서
export const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'grocery', label: '식료품', icon: 'cart-outline' },
  { id: 'dining', label: '외식', icon: 'restaurant-outline' },
  { id: 'alcohol', label: '주류', icon: 'beer-outline' },
  { id: 'clothing', label: '의류', icon: 'shirt-outline' },
  { id: 'leisure', label: '여가/문화', icon: 'film-outline' },
  { id: 'medical', label: '의료/건강', icon: 'medkit-outline' },
  { id: 'education', label: '교육', icon: 'book-outline' },
  { id: 'travel', label: '숙박/여행', icon: 'airplane-outline' },
  { id: 'telecom', label: '정보통신', icon: 'phone-portrait-outline' },
  { id: 'other', label: '기타', icon: 'ellipsis-horizontal-circle-outline' },
];

// 수입 카테고리 (3종)
export const INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'salary', label: '월급', icon: 'briefcase-outline' },
  { id: 'allowance', label: '용돈', icon: 'gift-outline' },
  { id: 'other', label: '기타', icon: 'ellipsis-horizontal-circle-outline' },
];

// 카테고리 ID → {label, icon} 빠른 조회용 (지출 + 수입 전체)
export const CATEGORY_META: Record<
  SpendingCategory,
  { label: string; icon: CategoryItem['icon'] }
> = Object.fromEntries(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(({ id, label, icon }) => [id, { label, icon }]),
) as Record<SpendingCategory, { label: string; icon: CategoryItem['icon'] }>;
