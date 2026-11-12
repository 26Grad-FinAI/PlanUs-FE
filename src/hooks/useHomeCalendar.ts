import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useToday } from '@/hooks/useToday';
import { useHomeRecords } from '@/hooks/useHomeRecords';
import { fetchHomeCalendar, fetchHomeSummary } from '@/services/api/homeApi';
import type { DailyTotals, HomeSummary } from '@/types/home';
import { useRecordRevision } from '@/store/useRecordRevision';
import { buildMonthWeeks, toISODate } from '@/utils/formatDate';

interface MonthData {
  summary: HomeSummary;
  calendar: DailyTotals[];
}

export function useHomeCalendar() {
  const today = useToday();
  const todayISO = toISODate(today);
  const recordRevision = useRecordRevision((state) => state.revision);
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [monthResult, setMonthResult] = useState<{
    key: string;
    data?: MonthData;
    error?: string;
  }>();
  const yearMonth = toISODate(monthCursor).slice(0, 7);
  const monthKey = `${yearMonth}/${attempt}/${recordRevision}`;
  const currentMonth = monthResult?.key === monthKey ? monthResult : undefined;
  const month = currentMonth?.data;
  const monthError = currentMonth?.error;
  const records = useHomeRecords(yearMonth, selectedDate, recordRevision);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      const { signal } = controller;
      void Promise.all([fetchHomeSummary(yearMonth, signal), fetchHomeCalendar(yearMonth, signal)])
        .then(([summary, calendar]) => {
          if (!signal.aborted) setMonthResult({ key: monthKey, data: { summary, calendar } });
        })
        .catch((error: unknown) => {
          if (!signal.aborted) {
            setMonthResult({
              key: monthKey,
              error: error instanceof Error ? error.message : '홈 정보를 불러오지 못했어요.',
            });
          }
        });
      return () => controller.abort();
    }, [yearMonth, monthKey]),
  );

  const totalsByDate = useMemo(
    () => Object.fromEntries(month?.calendar.map((day) => [day.date, day]) ?? []),
    [month],
  );
  const weeks = useMemo(() => buildMonthWeeks(monthCursor), [monthCursor]);

  function moveMonth(offset: number) {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDate(null);
  }

  return {
    today,
    todayISO,
    monthCursor,
    weeks,
    totalsByDate,
    summary: month?.summary,
    monthError,
    selectedDate,
    ...records,
    retryMonth: () => setAttempt((previous) => previous + 1),
    handlePrevMonth: () => moveMonth(-1),
    handleNextMonth: () => moveMonth(1),
    handleDayPress: (date: string) => setSelectedDate((prev) => (prev === date ? null : date)),
  };
}
