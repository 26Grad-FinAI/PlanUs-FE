import { authenticatedRequest } from '@/services/api/apiClient';
import type { WeeklyFeedback } from '@/types/ai';

type WeeklyFeedbackResponse =
  | {
      exists: true;
      weekStart: string;
      weekEnd: string;
      feedbackText: string;
      confidence: string | null;
    }
  | { exists: false };

export async function fetchWeeklyFeedback(signal: AbortSignal): Promise<WeeklyFeedback | null> {
  const response = await authenticatedRequest<WeeklyFeedbackResponse>(
    '/ai-feedback/weekly/latest',
    { signal },
  );

  if (!response.exists) return null;
  const { weekStart, weekEnd, feedbackText, confidence } = response;
  return { weekStart, weekEnd, feedback: feedbackText, confidence };
}
