import { useMemo } from 'react';

import type { MonthSummary } from '@/src/features/transactions/types';

import { useDailyBalances } from './useDailyBalances';

const EMPTY_SUMMARY: MonthSummary = {
  currentBalance: 0,
  peak: 0,
  valley: 0,
  totalIncome: 0,
  totalExpenses: 0,
};

export function useMonthSummary(year: number, month: number) {
  const { data: dailyBalances, ...queryResult } = useDailyBalances(year, month);

  const summary = useMemo<MonthSummary>(() => {
    if (dailyBalances.length === 0) return EMPTY_SUMMARY;

    const balances = dailyBalances.map((d) => d.endBalance);

    return {
      currentBalance: dailyBalances[dailyBalances.length - 1].endBalance,
      peak: Math.max(...balances),
      valley: Math.min(...balances),
      totalIncome: dailyBalances.reduce((sum, d) => sum + d.totalIncome, 0),
      totalExpenses: dailyBalances.reduce((sum, d) => sum + d.totalSpending, 0),
    };
  }, [dailyBalances]);

  return { data: summary, ...queryResult };
}
