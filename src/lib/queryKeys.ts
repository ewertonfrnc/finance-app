import type { TransactionType } from '@/src/features/transactions/types';

export const queryKeys = {
  transactions: (year: number, month: number, day?: number, type?: TransactionType) =>
    ['transactions', year, month, day, type] as const,
  transactionsAll: () => ['transactions'] as const,
  transaction: (id: string) => ['transactions', 'detail', id] as const,
} as const;
