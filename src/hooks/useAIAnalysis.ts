import { useCallback, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createMockAIAnalysis } from '@/services/mock/ai.mock';
import { useBudgetStore } from '@/store/useBudgetStore';
import { calculateSavings, getAppliedPlanIds } from '@/utils/savings';
import { toISODate } from '@/utils/formatDate';

/** 선택은 시뮬레이션이며, 저장된 적용 이력만 예산에 영향을 준다. */
export function useAIAnalysis() {
  const [today, setToday] = useState(() => new Date());
  const dayKey = toISODate(today);
  const analysis = useMemo(() => createMockAIAnalysis(new Date(`${dayKey}T12:00:00`)), [dayKey]);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const selectionScope = `${year}-${month}-${analysis.id}`;
  const [selection, setSelection] = useState({ scope: selectionScope, ids: [] as string[] });
  const [notice, setNotice] = useState<{ scope: string; text: string; error: boolean } | null>(
    null,
  );
  const appliedSavings = useBudgetStore((state) => state.appliedSavings);
  const applySavingsPlans = useBudgetStore((state) => state.applySavingsPlans);
  const appliedIds = useMemo(
    () => getAppliedPlanIds(appliedSavings, analysis.id, year, month),
    [appliedSavings, analysis.id, year, month],
  );
  const selectedIds = new Set(
    selection.scope === selectionScope ? selection.ids.filter((id) => !appliedIds.has(id)) : [],
  );
  const selectedPlans = analysis.plans.filter((plan) => selectedIds.has(plan.id));
  const totals = calculateSavings(selectedPlans);
  const allApplied =
    analysis.plans.length > 0 && analysis.plans.every((plan) => appliedIds.has(plan.id));

  useFocusEffect(
    useCallback(() => {
      // 탭 복귀, 앱 재개, 자정 경과 시 이번 주와 이번 달을 다시 계산한다.
      const refresh = () => setToday(new Date());
      refresh();
      const timer = setInterval(refresh, 60000);
      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') refresh();
      });
      return () => {
        clearInterval(timer);
        subscription.remove();
      };
    }, []),
  );

  function togglePlan(id: string) {
    if (appliedIds.has(id)) return;
    setNotice(null);
    setSelection((current) => {
      const ids = current.scope === selectionScope ? current.ids : [];
      return {
        scope: selectionScope,
        ids: ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
      };
    });
  }

  function apply() {
    const result = applySavingsPlans(analysis, [...selectedIds]);
    setNotice(result.success ? null : { scope: selectionScope, text: result.message, error: true });
    if (result.success) setSelection({ scope: selectionScope, ids: [] });
  }

  return {
    analysis,
    selectedIds,
    appliedIds,
    totals,
    allApplied,
    togglePlan,
    apply,
    notice: notice?.scope === selectionScope ? notice : null,
  };
}
