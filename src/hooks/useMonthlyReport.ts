/** 월별 조회와 재시도, 두 비교 영역의 펼침 상태를 관리한다. */
import { useEffect, useState } from 'react';
import { fetchMonthlyReport } from '@/services/mock/report.mock';
import { MonthlyReport } from '@/types/report';

interface ReportResult {
  key: string;
  report: MonthlyReport | null;
  error: string | null;
}

export function useMonthlyReport() {
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [budgetExpanded, setBudgetExpanded] = useState(false);
  const [peersExpanded, setPeersExpanded] = useState(false);
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth() + 1;
  const requestKey = `${year}-${month}-${attempt}`;

  useEffect(() => {
    let cancelled = false;
    fetchMonthlyReport(year, month).then(
      (report) => {
        if (!cancelled) setResult({ key: requestKey, report, error: null });
      },
      () => {
        if (!cancelled) {
          setResult({ key: requestKey, report: null, error: '통계를 불러오지 못했어요.' });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [year, month, requestKey]);

  function moveMonth(offset: number) {
    setMonthCursor((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1));
    setBudgetExpanded(false);
    setPeersExpanded(false);
  }

  // 월 선택 직후에는 이전 결과를 새 월의 통계처럼 표시하지 않는다.
  const currentResult = result?.key === requestKey ? result : null;
  return {
    monthCursor,
    report: currentResult?.report ?? null,
    error: currentResult?.error ?? null,
    isLoading: currentResult === null,
    retry: () => setAttempt((previous) => previous + 1),
    handlePrevMonth: () => moveMonth(-1),
    handleNextMonth: () => moveMonth(1),
    budgetExpanded,
    peersExpanded,
    toggleBudget: () => setBudgetExpanded((previous) => !previous),
    togglePeers: () => setPeersExpanded((previous) => !previous),
  };
}
