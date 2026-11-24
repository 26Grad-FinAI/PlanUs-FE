import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchWeeklyFeedback } from '@/services/api/weeklyFeedbackApi';
import { useAuthStore } from '@/store/useAuthStore';
import type { WeeklyFeedbackState } from '@/types/ai';

export function useWeeklyFeedback(): WeeklyFeedbackState {
  const sessionId = useAuthStore((state) => state.session?.id);
  const [query, setQuery] = useState<{ sessionId: symbol; result: WeeklyFeedbackState }>();

  useFocusEffect(
    useCallback(() => {
      if (!sessionId) return;
      const controller = new AbortController();
      const { signal } = controller;

      void fetchWeeklyFeedback(signal).then(
        (feedback) => {
          if (signal.aborted) return;
          setQuery({
            sessionId,
            result: feedback ? { status: 'success', ...feedback } : { status: 'empty' },
          });
        },
        () => {
          if (signal.aborted) return;
          setQuery({ sessionId, result: { status: 'error' } });
        },
      );
      return () => controller.abort();
    }, [sessionId]),
  );

  return query && query.sessionId === sessionId ? query.result : { status: 'loading' };
}
