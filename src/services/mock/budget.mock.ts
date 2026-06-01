/**
 * AI 예산 추천 Mock 데이터 및 Mock API 함수
 *
 * 서울 1인 가구 평균 소비 패턴 기반 모의 산출값
 * AI 추천 총 예산: 950,000원
 */

import { AIBudgetRecommendation } from '@/types/budget';

export const mockAIBudget: AIBudgetRecommendation = {
  aiTotalAmount: 950000,
  insight:
    '서울 1인 가구 평균 소비 패턴을 분석했어요. 외식·여가 비중을 효율적으로 조정해 저축 여력을 높였습니다.',
  categories: [
    { category: 'grocery', label: '식료품', aiAmount: 200000, userAmount: 200000 },
    { category: 'dining', label: '외식', aiAmount: 150000, userAmount: 150000 },
    { category: 'alcohol', label: '주류', aiAmount: 30000, userAmount: 30000 },
    { category: 'clothing', label: '의류', aiAmount: 80000, userAmount: 80000 },
    { category: 'leisure', label: '여가/문화', aiAmount: 100000, userAmount: 100000 },
    { category: 'medical', label: '의료/건강', aiAmount: 50000, userAmount: 50000 },
    { category: 'education', label: '교육', aiAmount: 120000, userAmount: 120000 },
    { category: 'travel', label: '숙박/여행', aiAmount: 80000, userAmount: 80000 },
    { category: 'telecom', label: '정보통신', aiAmount: 80000, userAmount: 80000 },
    { category: 'other', label: '기타', aiAmount: 60000, userAmount: 60000 },
  ],
};

/**
 * AI 예산 추천 조회 (Mock)
 *
 * TODO: API 연결 시 사용
 * const res = await api.get('/budget/recommendation');
 * return res.data;
 */
export async function fetchAIBudgetRecommendation(): Promise<AIBudgetRecommendation> {
  // 원본 배열 변이 방지를 위해 깊은 복사 반환
  return {
    ...mockAIBudget,
    categories: mockAIBudget.categories.map((c) => ({ ...c })),
  };
}
