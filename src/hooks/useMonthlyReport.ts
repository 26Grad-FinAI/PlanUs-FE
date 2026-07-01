/**
 * 소비 통계 화면의 상태 + 데이터 조회를 모아둔 훅
 *
 * 월 이동(이전/다음)과 해당 월 리포트 조회를 담당하고,
 * 화면(MonthlyReportScreen)은 반환값을 하위 컴포넌트에 전달하기만 한다.
 */

import { useEffect, useMemo, useState } from 'react';

import { fetchMonthlyReport } from '@/services/mock/report.mock';
import { MonthlyReport } from '@/types/report';

export function useMonthlyReport() {
  const today = useMemo(() => new Date(), []);
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [report, setReport] = useState<MonthlyReport | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchMonthlyReport(monthCursor.getFullYear(), monthCursor.getMonth() + 1).then((data) => {
      if (!cancelled) setReport(data);
    });
    return () => {
      cancelled = true;
    };
  }, [monthCursor]);

  function handlePrevMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  return {
    monthCursor,
    report,
    handlePrevMonth,
    handleNextMonth,
  };
}
