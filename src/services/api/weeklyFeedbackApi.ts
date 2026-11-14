import { authenticatedRequest } from '@/services/api/apiClient';
import type { WeeklyFeedback } from '@/types/ai';

type WeeklyFeedbackResponse =
  | ({ created: true } & WeeklyFeedback)
  | { created: false; reason?: string; error?: string };

export async function fetchWeeklyFeedback(
  userId: number,
  weekEnd: string,
  signal: AbortSignal,
): Promise<WeeklyFeedback | null> {
  const query = new URLSearchParams({ userId: String(userId), weekEnd });
  const response = await authenticatedRequest<WeeklyFeedbackResponse>(
    '/internal/aifeedback/run-weekly?' + query,
    { signal, internal: true, cache: 'no-store' },
  );

  if (response.created === true && response.feedback?.trim()) {
    return { feedback: response.feedback, confidence: response.confidence };
  }
  if (response.created === false && response.reason) return null;
  throw new Error('AI 종합 의견을 불러오지 못했어요.');
}
