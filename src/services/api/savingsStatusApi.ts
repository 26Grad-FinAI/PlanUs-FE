import { authenticatedRequest } from '@/services/api/apiClient';

export interface MonthlySavingsRecord {
  yearMonth: string;
  savings: number;
}

interface SavingsStatus {
  totalSavings: number;
  monthlyRecords: MonthlySavingsRecord[];
}

export function fetchSavingsStatus(signal: AbortSignal) {
  return authenticatedRequest<SavingsStatus>('/users/me/savings-status', { signal });
}
