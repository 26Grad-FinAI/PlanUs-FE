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
  /** 유형과 식별자는 유지하고 입력 필드만 교체한다. 없는 기록은 새로 생성하지 않는다. */
  updateRecord: (id: string, params: CreateSpendingRecordParams) => boolean;
  deleteRecord: (id: string) => void;
}

// 빠르게 연속 저장해도 같은 밀리초의 기록끼리 ID가 겹치지 않도록 순번을 함께 사용한다.
let nextRecordId = 0;

export const useRecordStore = create<RecordState>((set) => ({
  // seed 배열을 직접 참조하지 않도록 복사본으로 초기화
  records: [...mockSpendingRecords],

  addRecord: (params) =>
    set((state) => {
      const newRecord: SpendingRecord = {
        id: `record-${Date.now()}-${nextRecordId++}`,
        ...params,
        createdAt: new Date().toISOString(),
      };
      return { records: [newRecord, ...state.records] };
    }),

  updateRecord: (id, params) => {
    let updated = false;
    set((state) => {
      const record = state.records.find((item) => item.id === id);
      // UI뿐 아니라 저장 경계에서도 유형 변경과 삭제된 기록의 재생성을 차단한다.
      if (!record || record.type !== params.type) return state;
      updated = true;
      return {
        records: state.records.map((item) =>
          item.id === id ? { ...params, id: item.id, createdAt: item.createdAt } : item,
        ),
      };
    });
    return updated;
  },

  deleteRecord: (id) =>
    set((state) => ({ records: state.records.filter((item) => item.id !== id) })),
}));
