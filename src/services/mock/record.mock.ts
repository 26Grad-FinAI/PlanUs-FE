/**
 * 소비 기록 Mock 데이터 및 Mock API 함수
 *
 * 실제 API 연결 전까지 이 파일의 데이터를 사용한다.
 * API 연결 시 주석 해제 후 mock 반환 코드를 제거한다.
 */

import { SpendingRecord, CreateSpendingRecordParams } from '@/types/record';

// 오늘 기준 상대 일수(offsetDays)로 ISO 날짜 문자열 생성
// 항상 "오늘"을 중심으로 과거/미래 기록이 함께 보이도록 하기 위해
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
// offset < 0: 과거(확정) 기록, offset === 0: 오늘, offset > 0: 미래(예정) 기록
export const mockSpendingRecords: SpendingRecord[] = [
  {
    id: '1',
    type: 'expense',
    amount: 6500,
    description: '스타벅스',
    date: dateWithOffset(0),
    category: 'dining',
    memo: '아이스 아메리카노',
    createdAt: `${dateWithOffset(0)}T09:30:00.000Z`,
  },
  {
    id: '2',
    type: 'expense',
    amount: 45000,
    description: '이마트',
    date: dateWithOffset(-1),
    category: 'grocery',
    createdAt: `${dateWithOffset(-1)}T18:20:00.000Z`,
  },
  {
    id: '3',
    type: 'expense',
    amount: 12000,
    description: '카카오택시',
    date: dateWithOffset(-2),
    category: 'other',
    createdAt: `${dateWithOffset(-2)}T22:00:00.000Z`,
  },
  {
    id: '4',
    type: 'income',
    amount: 3000000,
    description: '월급',
    date: dateWithOffset(-2),
    category: 'salary',
    createdAt: `${dateWithOffset(-2)}T09:00:00.000Z`,
  },
  {
    id: '5',
    type: 'expense',
    amount: 28000,
    description: 'CGV 영화관',
    date: dateWithOffset(-4),
    category: 'leisure',
    createdAt: `${dateWithOffset(-4)}T20:10:00.000Z`,
  },
  {
    id: '6',
    type: 'expense',
    amount: 32000,
    description: '호프집',
    date: dateWithOffset(-6),
    category: 'alcohol',
    createdAt: `${dateWithOffset(-6)}T21:40:00.000Z`,
  },
  {
    id: '7',
    type: 'expense',
    amount: 15000,
    description: '약국',
    date: dateWithOffset(-9),
    category: 'medical',
    createdAt: `${dateWithOffset(-9)}T11:15:00.000Z`,
  },
  {
    id: '8',
    type: 'expense',
    amount: 50000,
    description: '팀 회식',
    date: dateWithOffset(2),
    category: 'dining',
    createdAt: `${dateWithOffset(2)}T08:00:00.000Z`,
  },
  {
    id: '9',
    type: 'expense',
    amount: 38000,
    description: '토익 응시료',
    date: dateWithOffset(5),
    category: 'education',
    createdAt: `${dateWithOffset(5)}T08:00:00.000Z`,
  },
  {
    id: '10',
    type: 'expense',
    amount: 120000,
    description: '주말 여행 숙소',
    date: dateWithOffset(8),
    category: 'travel',
    createdAt: `${dateWithOffset(8)}T08:00:00.000Z`,
  },
];

/**
 * 소비 기록 목록 조회 (Mock)
 *
 * TODO: API 연결 시 사용
 * const res = await api.get('/records');
 * return res.data;
 */
export async function fetchSpendingRecords(): Promise<SpendingRecord[]> {
  // 원본 배열 참조 대신 복사본 반환 → 외부에서의 직접 변이 방지
  return mockSpendingRecords.map((record) => ({ ...record }));
}

/**
 * 소비 기록 생성 (Mock)
 * 실제로는 저장하지 않고 생성된 객체만 반환
 *
 * TODO: API 연결 시 사용
 * const res = await api.post('/records', params);
 * return res.data;
 */
export async function createSpendingRecord(
  params: CreateSpendingRecordParams,
): Promise<SpendingRecord> {
  const newRecord: SpendingRecord = {
    id: String(Date.now()),
    ...params,
    createdAt: new Date().toISOString(),
  };

  // 목록 맨 앞에 삽입해 이후 fetchSpendingRecords 호출 시 결과에 반영
  mockSpendingRecords.unshift(newRecord);
  return { ...newRecord };
}
