import { AIAnalysis } from '@/types/ai';
import { toISODate } from '@/utils/formatDate';

/** 문구와 플랜은 시안의 Mock이며, 기간과 식별자는 현재 주(월~일)에 맞춘다. */
export function createMockAIAnalysis(today: Date): AIAnalysis {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    id: `mock-weekly-${toISODate(start)}`,
    periodLabel: `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getMonth() + 1}월 ${end.getDate()}일`,
    insight:
      '배달 음식 지출이 주말에 집중되고, 매달 20일 이후 지출이 늘어나는 패턴이 보여요. 식비와 주거비 관리는 비슷한 사람들보다 우수한 편이에요. 배달앱 사용을 주 2회로 줄이면 월 8~12만원을 더 아낄 수 있어요.',
    plans: [
      {
        id: 'cook-at-home',
        category: 'dining',
        description: '배달 대신 직접 요리',
        monthlySavings: 80000,
      },
      {
        id: 'review-subscriptions',
        category: 'leisure',
        description: '구독 서비스 정리',
        monthlySavings: 50000,
      },
      {
        id: 'review-phone-plan',
        category: 'telecom',
        description: '통신 요금제 조정',
        monthlySavings: 20000,
      },
    ],
  };
}
