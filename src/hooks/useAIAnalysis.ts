import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useToday } from '@/hooks/useToday';
import { ApiError } from '@/services/api/apiClient';
import { currentBudgetMonth } from '@/services/api/budgetApi';
import { applySavingsPlans, fetchSavingsSuggestion } from '@/services/api/savingsSimulationApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useRecordRevision } from '@/store/useRecordRevision';
import type { SavingsSuggestion } from '@/types/ai';

type PlanQuery =
  | { status: 'loading' }
  | { status: 'success'; suggestion: SavingsSuggestion | null }
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

interface FeedbackScope extends MonthScope {
  feedbackId: number;
}

export function useAIAnalysis() {
  useToday();
  const { year, month } = currentBudgetMonth();
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  const sessionId = useAuthStore((state) => state.session?.id);
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState<MonthScope & { attempt: number; query: PlanQuery }>();
  const [selection, setSelection] = useState<FeedbackScope & { ids: number[] }>();
  const [application, setApplication] = useState<
    FeedbackScope & {
      result: Application;
    }
  >();
  const applyPending = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!sessionId) return;
      const controller = new AbortController();
      const { signal } = controller;
      void fetchSavingsSuggestion(yearMonth, signal).then(
        (suggestion) => {
          if (signal.aborted) return;
          setResponse({
            sessionId,
            yearMonth,
            attempt,
            query: { status: 'success', suggestion },
          });
          setSelection((previous) => {
            if (
              !previous ||
              previous.sessionId !== sessionId ||
              previous.yearMonth !== yearMonth ||
              previous.feedbackId !== suggestion?.feedbackId
            ) {
              return previous;
            }
            return {
              ...previous,
              ids: previous.ids.filter((id) =>
                suggestion?.plans.some((plan) => plan.categoryId === id),
              ),
            };
          });
        },
        () => {
          if (!signal.aborted)
            setResponse({ sessionId, yearMonth, attempt, query: { status: 'error' } });
        },
      );
      return () => controller.abort();
    }, [yearMonth, attempt, sessionId]),
  );

  const query: PlanQuery =
    response &&
    response.sessionId === sessionId &&
    response.yearMonth === yearMonth &&
    response.attempt === attempt
      ? response.query
      : { status: 'loading' };
  const suggestion = query.status === 'success' ? query.suggestion : null;
  const plans = suggestion?.plans ?? [];
  const feedbackId = suggestion?.feedbackId;
  const currentApplication =
    application?.sessionId === sessionId &&
    application?.yearMonth === yearMonth &&
    application?.feedbackId === feedbackId
      ? application
      : undefined;
  const result = currentApplication?.result;
  const selectedIds =
    selection?.sessionId === sessionId &&
    selection?.yearMonth === yearMonth &&
    selection?.feedbackId === feedbackId
      ? selection.ids
      : [];
  const selectedPlans = plans.filter((plan) => selectedIds.includes(plan.categoryId));
  const monthly = selectedPlans.reduce((sum, plan) => sum + plan.monthlySavingWon, 0);
  const locked =
    suggestion?.applied === true ||
    result?.status === 'applied' ||
    result?.status === 'alreadyApplied';

  function togglePlan(categoryId: number) {
    if (!sessionId || feedbackId === undefined || applyPending.current || locked) return;
    setApplication(undefined);
    setSelection((previous) => {
      const ids =
        previous?.sessionId === sessionId &&
        previous.yearMonth === yearMonth &&
        previous.feedbackId === feedbackId
          ? previous.ids
          : [];
      return {
        sessionId,
        yearMonth,
        feedbackId,
        ids: ids.includes(categoryId)
          ? ids.filter((id) => id !== categoryId)
          : [...ids, categoryId],
      };
    });
  }

  async function apply() {
    if (
      !sessionId ||
      feedbackId === undefined ||
      applyPending.current ||
      locked ||
      !selectedPlans.length
    )
      return;

    applyPending.current = true;
    const scope = { sessionId, yearMonth, feedbackId };
    setApplication({ ...scope, result: { status: 'applying' } });
    const isCurrentSession = () => useAuthStore.getState().session?.id === sessionId;
    try {
      const applied = await applySavingsPlans(
        yearMonth,
        feedbackId,
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
