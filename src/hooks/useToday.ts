/** 자정과 앱 복귀 시 기기 로컬 날짜를 갱신한다. */
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { startOfDay, toISODate } from '@/utils/formatDate';

export function useToday() {
  const [today, setToday] = useState(() => startOfDay(new Date()));
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function refresh() {
      clearTimeout(timer);
      const now = new Date();
      setToday((previous) => (toISODate(previous) === toISODate(now) ? previous : startOfDay(now)));
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 100);
    }
    refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);
  return today;
}
