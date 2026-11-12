import type { BudgetCategory } from '@/types/budget';

export const EXPENSE_CATEGORY_IDS: Record<BudgetCategory, number> = {
  grocery: 1,
  clothing: 2,
  medical: 3,
  transport: 4,
  leisure: 5,
  education: 6,
  dining: 7,
  travel: 8,
  telecom: 9,
  other: 10,
};

export function expenseCategoryFromId(id: number): BudgetCategory {
  return (
    (Object.keys(EXPENSE_CATEGORY_IDS) as BudgetCategory[]).find(
      (category) => EXPENSE_CATEGORY_IDS[category] === id,
    ) ?? 'other'
  );
}
