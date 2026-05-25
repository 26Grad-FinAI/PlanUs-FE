/**
 * 소비 기록 Mock 데이터 및 Mock API 함수
 *
 * 실제 API 연결 전까지 이 파일의 데이터를 사용한다.
 * API 연결 시 주석 해제 후 mock 반환 코드를 제거한다.
 */

import { SpendingRecord, CreateSpendingRecordParams } from '@/types/record';

// 소비 기록 샘플 데이터
export const mockSpendingRecords: SpendingRecord[] = [
  {
    id: '1',
    type: 'expense',
    amount: 6500,
    description: '스타벅스',
    date: '2026-05-12',
    category: 'dining',
    memo: '아이스 아메리카노',
    createdAt: '2026-05-12T09:30:00.000Z',
  },
  {
    id: '2',
    type: 'expense',
    amount: 45000,
    description: '이마트',
    date: '2026-05-11',
    category: 'grocery',
    createdAt: '2026-05-11T18:20:00.000Z',
  },
  {
    id: '3',
    type: 'expense',
    amount: 12000,
    description: '카카오택시',
    date: '2026-05-10',
    category: 'other',
    createdAt: '2026-05-10T22:00:00.000Z',
  },
  {
    id: '4',
    type: 'income',
    amount: 3200000,
    description: '5월 월급',
    date: '2026-05-10',
    category: 'other',
    createdAt: '2026-05-10T09:00:00.000Z',
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
  return mockSpendingRecords;
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

  return newRecord;
}
