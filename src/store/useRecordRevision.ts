import { create } from 'zustand';

interface RecordRevision {
  revision: number;
  invalidate: () => void;
}

export const useRecordRevision = create<RecordRevision>((set) => ({
  revision: 0,
  invalidate: () => set(({ revision }) => ({ revision: revision + 1 })),
}));
