import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchDailyRecords, fetchRecentRecords } from '@/services/api/homeApi';
import type { DateGroup } from '@/types/home';
import type { RecordListItem } from '@/types/record';

function groupRecords(items: RecordListItem[]): DateGroup[] {
  const groups = new Map<string, DateGroup>();
  for (const item of items) {
    const group = groups.get(item.date);
    if (group) group.items.push(item);
    else groups.set(item.date, { date: item.date, items: [item] });
  }
  return Array.from(groups.values());
}

interface RecordListState {
  key: string;
  items: RecordListItem[];
  error?: string;
  nextCursor: string | null;
  loadingMore?: boolean;
  nextPageError?: string;
}

interface RecordListRequest {
  key: string;
  controller: AbortController;
  nextCursor: string | null;
  loadingMore: boolean;
}

export function useHomeRecords(
  yearMonth: string,
  selectedDate: string | null,
  recordRevision: number,
) {
  const [attempt, setAttempt] = useState(0);
  const [list, setList] = useState<RecordListState>();
  const listRequest = useRef<RecordListRequest>(null);
  const listKey = `${yearMonth}/${selectedDate ?? ''}/${recordRevision}/${attempt}`;
  const currentList = list?.key === listKey ? list : undefined;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const request: RecordListRequest = {
      key: listKey,
      controller,
      nextCursor: null,
      loadingMore: false,
    };
    listRequest.current = request;
    const firstPage = selectedDate
      ? fetchDailyRecords(selectedDate, signal)
      : fetchRecentRecords(yearMonth, signal);
    void firstPage
      .then((page) => {
        if (signal.aborted) return;
        request.nextCursor = page.nextCursor;
        setList({ key: listKey, ...page });
      })
      .catch((error: unknown) => {
        if (signal.aborted) return;
        setList({
          key: listKey,
          items: [],
          nextCursor: null,
          error: error instanceof Error ? error.message : '거래 내역을 불러오지 못했어요.',
        });
      });
    return () => controller.abort();
  }, [listKey, selectedDate, yearMonth]);

  async function loadNextPage() {
    const request = listRequest.current;
    const cursor = currentList?.nextCursor;
    if (
      !cursor ||
      !request ||
      request.key !== listKey ||
      request.nextCursor !== cursor ||
      request.loadingMore
    ) {
      return;
    }

    const { signal } = request.controller;
    if (signal.aborted) return;
    request.loadingMore = true;
    setList({ ...currentList, loadingMore: true, nextPageError: undefined });
    try {
      const page = await fetchRecentRecords(yearMonth, signal, cursor);
      if (signal.aborted) return;
      request.nextCursor = page.nextCursor;
      const existingIds = new Set(currentList.items.map(({ id }) => id));
      setList({
        key: listKey,
        items: [...currentList.items, ...page.items.filter(({ id }) => !existingIds.has(id))],
        nextCursor: page.nextCursor,
      });
    } catch (error: unknown) {
      if (signal.aborted) return;
      setList({
        ...currentList,
        loadingMore: false,
        nextPageError:
          error instanceof Error ? error.message : '다음 거래 내역을 불러오지 못했어요.',
      });
    } finally {
      request.loadingMore = false;
    }
  }

  const visibleGroups = useMemo(() => groupRecords(currentList?.items ?? []), [currentList?.items]);

  return {
    visibleGroups,
    listLoading: !currentList,
    listError: currentList?.error,
    nextPageLoading: currentList?.loadingMore ?? false,
    nextPageError: currentList?.nextPageError,
    loadNextPage,
    retryRecords: () => setAttempt((previous) => previous + 1),
  };
}
