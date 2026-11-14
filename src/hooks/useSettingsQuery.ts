import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '@/store/useAuthStore';

type QueryResult<T> = { status: 'loading' } | { status: 'success'; data: T } | { status: 'error' };

export function useSettingsQuery<T>(fetchData: (signal: AbortSignal) => Promise<T>) {
  const sessionId = useAuthStore((state) => state.session?.id);
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState<{
    sessionId: symbol;
    attempt: number;
    result: QueryResult<T>;
  }>();

  useFocusEffect(
    useCallback(() => {
      if (!sessionId) return;
      const controller = new AbortController();
      const { signal } = controller;

      void fetchData(signal).then(
        (data) => {
          if (!signal.aborted)
            setResponse({ sessionId, attempt, result: { status: 'success', data } });
        },
        () => {
          if (!signal.aborted) setResponse({ sessionId, attempt, result: { status: 'error' } });
        },
      );

      return () => controller.abort();
    }, [attempt, fetchData, sessionId]),
  );

  const result: QueryResult<T> =
    response && response.sessionId === sessionId && response.attempt === attempt
      ? response.result
      : { status: 'loading' };

  return { result, retry: () => setAttempt((previous) => previous + 1) };
}
