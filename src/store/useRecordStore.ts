/**
 * 소비 기록 상태 스토어 (Zustand)
 *
 * mock 단계에서 소비 기록의 단일 소스(single source of truth) 역할을 한다.
 * 모듈 전역 배열을 직접 변이하는 대신 store로 관리하므로,
 * 기록이 추가되면 이를 구독하는 화면(홈 등)이 자동으로 다시 렌더된다.
 *
 * TODO: API 연결 시 초기 records는 fetchSpendingRecords로 로드하고,
 *       addRecord 내부는 createSpendingRecord(params) 호출 + 서버 응답 반영으로 교체
 */

import { create } from 'zustand';

import { mockSpendingRecords } from '@/services/mock/record.mock';
import { CreateSpendingRecordParams, SpendingRecord } from '@/types/record';

interface RecordState {
  records: SpendingRecord[];
  /** 소비 기록 추가 — 최신 기록이 위로 오도록 맨 앞에 삽입 */
  addRecord: (params: CreateSpendingRecordParams) => void;
}

export const useRecordStore = create<RecordState>((set) => ({
  // seed 배열을 직접 참조하지 않도록 복사본으로 초기화
  records: [...mockSpendingRecords],

  addRecord: (params) =>
    set((state) => {
      const newRecord: SpendingRecord = {
        id: String(Date.now()),
        ...params,
        createdAt: new Date().toISOString(),
      };
      return { records: [newRecord, ...state.records] };
    }),
}));
