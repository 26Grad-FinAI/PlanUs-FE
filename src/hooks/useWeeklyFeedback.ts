import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useToday } from '@/hooks/useToday';
import { fetchWeeklyFeedback } from '@/services/api/weeklyFeedbackApi';
import { useAuthStore } from '@/store/useAuthStore';
import type { WeeklyFeedbackState } from '@/types/ai';
import { toISODate } from '@/utils/formatDate';

interface FeedbackQuery {
  sessionId: symbol;
  weekEnd: string;
  result: Exclude<WeeklyFeedbackState, { status: 'loading' }>;
}

function previousSunday() {
  const koreaTime = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return new Date(
    koreaTime.getUTCFullYear(),
    koreaTime.getUTCMonth(),
    koreaTime.getUTCDate() - (koreaTime.getUTCDay() || 7),
    12,
  );
}

export function useWeeklyFeedback(): WeeklyFeedbackState {
  useToday();
  const weekEnd = toISODate(previousSunday());
  const sessionId = useAuthStore((state) => state.session?.id);
  const [query, setQuery] = useState<FeedbackQuery>();
  const completed = useRef<Pick<FeedbackQuery, 'sessionId' | 'weekEnd'>>(undefined);

  useFocusEffect(
    useCallback(() => {
      const session = useAuthStore.getState().session;
      if (!session || session.id !== sessionId) return;
      const cached = completed.current;
      if (cached?.sessionId === sessionId && cached.weekEnd === weekEnd) return;

      const controller = new AbortController();
      const { signal } = controller;
      const isActive = () => !signal.aborted && useAuthStore.getState().session?.id === sessionId;
      const [year, month, day] = weekEnd.split('-').map(Number);
      const weekStart = toISODate(new Date(year, month - 1, day - 6, 12));

      void fetchWeeklyFeedback(session.userId, weekEnd, signal).then(
        (feedback) => {
          if (!isActive()) return;
          const response: FeedbackQuery = {
            sessionId,
            weekEnd,
            result: feedback
              ? { status: 'success', weekStart, weekEnd, ...feedback }
              : { status: 'empty' },
          };
          completed.current = { sessionId, weekEnd };
          setQuery(response);
        },
        () => {
          if (isActive()) setQuery({ sessionId, weekEnd, result: { status: 'error' } });
        },
      );
      return () => controller.abort();
    }, [sessionId, weekEnd]),
  );

  return query?.sessionId === sessionId && query?.weekEnd === weekEnd
    ? query.result
    : { status: 'loading' };
}
