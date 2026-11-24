import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useToday } from '@/hooks/useToday';
import { ApiError } from '@/services/api/apiClient';
import { currentBudgetMonth } from '@/services/api/budgetApi';
import { applySavingsPlans, fetchSavingsPlans } from '@/services/api/savingsSimulationApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useRecordRevision } from '@/store/useRecordRevision';
import type { SavingsPlan } from '@/types/ai';

type PlanQuery =
  | { status: 'loading' }
  | { status: 'success'; plans: SavingsPlan[] }
  | { status: 'error' };

type Application =
  | { status: 'applying' }
  | { status: 'applied' }
  | { status: 'alreadyApplied'; message: string }
  | { status: 'error'; message: string };

interface MonthScope {
  sessionId: symbol;
  yearMonth: string;
}

export function useAIAnalysis() {
  useToday();
  const { year, month } = currentBudgetMonth();
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  const sessionId = useAuthStore((state) => state.session?.id);
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState<{
    sessionId: symbol;
    month: string;
    attempt: number;
    query: PlanQuery;
  }>();
  const [selection, setSelection] = useState<MonthScope & { ids: number[] }>();
  const [application, setApplication] = useState<
    MonthScope & {
      planKey: string;
      result: Application;
    }
  >();
  const applyPending = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!sessionId) return;
      const controller = new AbortController();
      const { signal } = controller;
      void fetchSavingsPlans(yearMonth, signal).then(
        (plans) => {
          if (signal.aborted) return;
          setResponse({
            sessionId,
            month: yearMonth,
            attempt,
            query: { status: 'success', plans },
          });
          setSelection((previous) => {
            if (previous?.sessionId !== sessionId || previous.yearMonth !== yearMonth) {
              return previous;
            }
            return {
              ...previous,
              ids: previous.ids.filter((id) => plans.some((plan) => plan.categoryId === id)),
            };
          });
        },
        () => {
          if (!signal.aborted)
            setResponse({ sessionId, month: yearMonth, attempt, query: { status: 'error' } });
        },
      );
      return () => controller.abort();
    }, [yearMonth, attempt, sessionId]),
  );

  const query: PlanQuery =
    response &&
    response.sessionId === sessionId &&
    response.month === yearMonth &&
    response.attempt === attempt
      ? response.query
      : { status: 'loading' };
  const plans = query.status === 'success' ? query.plans : [];
  const planKey = plans
    .map(({ categoryId, reductionWon }) => `${categoryId}:${reductionWon}`)
    .sort()
    .join(',');
  const currentApplication =
    application?.sessionId === sessionId && application?.yearMonth === yearMonth
      ? application
      : undefined;
  const result =
    currentApplication && currentApplication.planKey === planKey
      ? currentApplication.result
      : undefined;
  const selectedIds =
    selection?.sessionId === sessionId && selection?.yearMonth === yearMonth ? selection.ids : [];
  const selectedPlans = plans.filter((plan) => selectedIds.includes(plan.categoryId));
  const monthly = selectedPlans.reduce((sum, plan) => sum + plan.monthlySavingWon, 0);
  const locked = result?.status === 'applied' || result?.status === 'alreadyApplied';

  function togglePlan(categoryId: number) {
    if (!sessionId || applyPending.current || locked) return;
    setApplication(undefined);
    setSelection((previous) => {
      const ids =
        previous?.sessionId === sessionId && previous.yearMonth === yearMonth ? previous.ids : [];
      return {
        sessionId,
        yearMonth,
        ids: ids.includes(categoryId)
          ? ids.filter((id) => id !== categoryId)
          : [...ids, categoryId],
      };
    });
  }

  async function apply() {
    if (!sessionId || applyPending.current || locked || !selectedPlans.length) return;

    applyPending.current = true;
    const scope = { sessionId, yearMonth, planKey };
    setApplication({ ...scope, result: { status: 'applying' } });
    const isCurrentSession = () => useAuthStore.getState().session?.id === sessionId;
    try {
      const applied = await applySavingsPlans(
        yearMonth,
        selectedPlans.map((plan) => plan.categoryId),
      );
      if (!isCurrentSession()) return;
      if (!applied.applied) throw new Error('예산에 반영하지 못했어요. 다시 시도해주세요.');
      useBudgetStore.getState().updateAppliedSavings(yearMonth, applied.updatedCategories);
      useRecordRevision.getState().invalidate();
      setApplication({ ...scope, result: { status: 'applied' } });
    } catch (error) {
      if (!isCurrentSession()) return;
      if (error instanceof ApiError && error.code === 'SIMULATION_409_002') {
        setApplication({
          ...scope,
          result: {
            status: 'alreadyApplied',
            message: '이 주간 피드백의 절약 제안은 이미 반영되어 추가 반영할 수 없어요.',
          },
        });
      } else {
        const message = error instanceof Error ? error.message : '예산에 반영하지 못했어요.';
        setApplication({ ...scope, result: { status: 'error', message } });
      }
    } finally {
      applyPending.current = false;
    }
  }

  return {
    query,
    selectedIds,
    hasSelection: selectedPlans.length > 0,
    monthly,
    annual: monthly * 12,
    result,
    locked,
    togglePlan,
    apply,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
