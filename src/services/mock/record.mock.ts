/** 기록 스토어 초기화에 사용하는 샘플 소비 기록. */

import { SpendingRecord } from '@/types/record';

// 오늘 기준 상대 일수(offsetDays)로 ISO 날짜 문자열 생성
// 실행 날짜가 달라져도 최근 기록이 보이도록
// 절대 날짜 대신 상대 오프셋으로 mock 데이터를 구성한다.
function dateWithOffset(offsetDays: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 소비 기록 샘플 데이터
// 오늘과 과거 날짜의 실제 수입·지출 기록만 제공한다.
export const mockSpendingRecords: SpendingRecord[] = [
  {
    id: '1',
    type: 'expense',
    amount: 6500,
    description: '스타벅스',
    date: dateWithOffset(0),
    category: 'dining',
    memo: '팀 미팅 전에 아이스 아메리카노',
    spendingNature: 'happy',
    isRecurring: false,
    createdAt: `${dateWithOffset(0)}T09:30:00.000Z`,
  },
  {
    id: '2',
    type: 'expense',
    amount: 45000,
    description: '이마트',
    spendingNature: 'needed',
    isRecurring: false,
    date: dateWithOffset(-1),
    category: 'grocery',
    createdAt: `${dateWithOffset(-1)}T18:20:00.000Z`,
  },
  {
    id: '3',
    type: 'expense',
    amount: 12000,
    description: '카카오택시',
    spendingNature: 'impulse',
    isRecurring: false,
    date: dateWithOffset(-2),
    category: 'transport',
    createdAt: `${dateWithOffset(-2)}T22:00:00.000Z`,
  },
  {
    id: '4',
    type: 'income',
    amount: 300000,
    description: '용돈',
    date: dateWithOffset(-2),
    category: 'allowance',
    createdAt: `${dateWithOffset(-2)}T09:00:00.000Z`,
  },
  {
    id: '5',
    type: 'expense',
    amount: 28000,
    description: 'CGV 영화관',
    spendingNature: 'happy',
    isRecurring: false,
    date: dateWithOffset(-4),
    category: 'leisure',
    createdAt: `${dateWithOffset(-4)}T20:10:00.000Z`,
  },
  {
    id: '6',
    type: 'expense',
    amount: 8000,
    description: '김밥천국',
    spendingNature: 'happy',
    isRecurring: false,
    date: dateWithOffset(-6),
    category: 'dining',
    createdAt: `${dateWithOffset(-6)}T21:40:00.000Z`,
  },
  {
    id: '7',
    type: 'expense',
    amount: 15000,
    description: '약국',
    spendingNature: 'needed',
    isRecurring: false,
    date: dateWithOffset(-9),
    category: 'medical',
    createdAt: `${dateWithOffset(-9)}T11:15:00.000Z`,
  },
  {
    id: '8',
    type: 'expense',
    amount: 50000,
    description: '팀 회식',
    spendingNature: 'happy',
    isRecurring: false,
    date: dateWithOffset(-3),
    category: 'dining',
    createdAt: `${dateWithOffset(-3)}T08:00:00.000Z`,
  },
  {
    id: '9',
    type: 'expense',
    amount: 38000,
    description: '토익 응시료',
    spendingNature: 'needed',
    isRecurring: true,
    date: dateWithOffset(-5),
    category: 'education',
    createdAt: `${dateWithOffset(-5)}T08:00:00.000Z`,
  },
  {
    id: '10',
    type: 'expense',
    amount: 120000,
    description: '주말 여행 숙소',
    spendingNature: 'happy',
    isRecurring: false,
    date: dateWithOffset(-8),
    category: 'travel',
    createdAt: `${dateWithOffset(-8)}T08:00:00.000Z`,
  },
];
