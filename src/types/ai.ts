export interface WeeklyFeedback {
  feedback: string;
  confidence?: string | null;
}

export type WeeklyFeedbackState =
  | { status: 'loading' }
  | ({ status: 'success'; weekStart: string; weekEnd: string } & WeeklyFeedback)
  | { status: 'empty' }
  | { status: 'error' };

export interface SavingsPlan {
  categoryId: number;
  categoryName: string;
  reductionWon: number;
  currentBehavior: string | null;
  targetBehavior: string | null;
  contextInsight: string | null;
  monthlySavingWon: number;
}

export interface SavingsApplication {
  applied: boolean;
  updatedCategories: { categoryId: number; before: number; after: number }[];
  newTotalBudget: number;
}
