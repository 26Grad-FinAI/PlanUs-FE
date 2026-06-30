/**
 * 홈 캘린더 화면의 상태 + 파생 데이터를 모아둔 훅
 *
 * 화면(HomeCalendarScreen)은 이 훅의 반환값을 그대로 하위 컴포넌트에 전달하기만 하고,
 * 월 이동/날짜 선택/요약 조회 등의 로직은 모두 여기서 처리한다.
 */

import { useEffect, useMemo, useState } from 'react';

import { fetchHomeSummary } from '@/services/mock/home.mock';
import { useRecordStore } from '@/store/useRecordStore';
import { HomeSummary } from '@/types/home';
import { SpendingRecord } from '@/types/record';
import { buildMonthWeeks, startOfDay, toISODate } from '@/utils/formatDate';

const EMPTY_SUMMARY: HomeSummary = { totalExpense: 0, budgetTotal: 0, remaining: 0, usageRate: 0 };

export interface DateGroup {
  date: string;
  items: SpendingRecord[];
}

export function useHomeCalendar() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayISO = useMemo(() => toISODate(today), [today]);
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // 소비 기록 store 구독 — 기록이 추가되면 records가 바뀌어 아래 값들이 자동으로 다시 계산된다
  const records = useRecordStore((s) => s.records);

  // 날짜 문자열 → 해당 날짜의 기록 목록 매핑 (캘린더 셀에서 빠르게 조회하기 위함)
  const recordsByDate = useMemo(() => {
    const map: Record<string, SpendingRecord[]> = {};
    records.forEach((record) => {
      if (!map[record.date]) map[record.date] = [];
      map[record.date].push(record);
    });
    return map;
  }, [records]);

  // 현재 보고 있는 달에 속한 기록만 필터링
  const monthRecords = useMemo(() => {
    return records.filter((record) => {
      const [year, month] = record.date.split('-').map(Number);
      return year === monthCursor.getFullYear() && month - 1 === monthCursor.getMonth();
    });
  }, [monthCursor, records]);

  // 이번 달 사용 금액/예산/남은 예산/소진율 — 기록이 바뀔 때마다 요약도 다시 조회한다
  const [summary, setSummary] = useState<HomeSummary>(EMPTY_SUMMARY);
  useEffect(() => {
    let cancelled = false;
    fetchHomeSummary(monthCursor.getFullYear(), monthCursor.getMonth() + 1).then((data) => {
      if (!cancelled) setSummary(data);
    });
    return () => {
      cancelled = true;
    };
  }, [monthCursor, records]);

  // 날짜별로 그룹화 후 최근 날짜가 먼저 오도록 정렬
  const dateGroups: DateGroup[] = useMemo(() => {
    const map: Record<string, SpendingRecord[]> = {};
    monthRecords.forEach((record) => {
      if (!map[record.date]) map[record.date] = [];
      map[record.date].push(record);
    });
    return Object.entries(map)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, items]) => ({ date, items }));
  }, [monthRecords]);

  // 캘린더에서 특정 날짜를 탭하면 해당 날짜의 내역만 아래 목록에 보여준다
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const visibleGroups = selectedDate
    ? dateGroups.filter((group) => group.date === selectedDate)
    : dateGroups;

  const weeks = useMemo(() => buildMonthWeeks(monthCursor), [monthCursor]);

  function handlePrevMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  }

  function handleNextMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  }

  // 같은 날짜를 다시 누르면 선택 해제 → 전체 목록으로 복귀
  function handleDayPress(dateKey: string) {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  }

  return {
    today,
    todayISO,
    monthCursor,
    weeks,
    recordsByDate,
    summary,
    selectedDate,
    visibleGroups,
    handlePrevMonth,
    handleNextMonth,
    handleDayPress,
  };
}
