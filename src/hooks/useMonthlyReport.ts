/** 월별 조회와 재시도, 두 비교 영역의 펼침 상태를 관리한다. */
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMonthlyReport, fetchPeerComparison } from '@/services/api/reportApi';
import { useRecordRevision } from '@/store/useRecordRevision';
import { toISODate } from '@/utils/formatDate';

type QueryResult<T> = { status: 'success'; data: T } | { status: 'error' };

function useReportQuery<T>(
  yearMonth: string,
  revision: string,
  fetchData: (yearMonth: string, signal: AbortSignal) => Promise<T>,
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    attempt: number;
    value: QueryResult<T>;
    refreshFailed?: boolean;
  }>();
  const key = `${yearMonth}/${revision}`;

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      const { signal } = controller;
      void fetchData(yearMonth, signal).then(
        (data) => {
          if (!signal.aborted) setResult({ key, attempt, value: { status: 'success', data } });
        },
        () => {
          if (!signal.aborted) {
            setResult((previous) =>
              previous?.key === key && previous.value.status === 'success'
                ? { ...previous, attempt, refreshFailed: true }
                : { key, attempt, value: { status: 'error' } },
            );
          }
        },
      );
      return () => controller.abort();
    }, [yearMonth, key, attempt, fetchData]),
  );

  const current = result?.key === key ? result : undefined;
  return {
    result:
      current && (current.attempt === attempt || current.value.status === 'success')
        ? current.value
        : { status: 'loading' as const },
    refreshFailed: current?.attempt === attempt && current.refreshFailed === true,
    retry: () => setAttempt((previous) => previous + 1),
  };
}

export function useMonthlyReport() {
  const recordRevision = useRecordRevision((state) => state.revision);
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [monthRevision, setMonthRevision] = useState(0);
  const [budgetExpanded, setBudgetExpanded] = useState(false);
  const [peersExpanded, setPeersExpanded] = useState(false);
  const yearMonth = toISODate(monthCursor).slice(0, 7);
  const revision = `${monthRevision}/${recordRevision}`;
  const report = useReportQuery(yearMonth, revision, fetchMonthlyReport);
  const peers = useReportQuery(yearMonth, revision, fetchPeerComparison);

  function moveMonth(offset: number) {
    setMonthCursor((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1));
    setMonthRevision((previous) => previous + 1);
    setBudgetExpanded(false);
    setPeersExpanded(false);
  }

  return {
    monthCursor,
    report,
    peers,
    handlePrevMonth: () => moveMonth(-1),
    handleNextMonth: () => moveMonth(1),
    budgetExpanded,
    peersExpanded,
    toggleBudget: () => setBudgetExpanded((previous) => !previous),
    togglePeers: () => setPeersExpanded((previous) => !previous),
  };
}
