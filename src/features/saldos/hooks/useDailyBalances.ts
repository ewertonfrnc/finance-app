import { useMemo } from 'react';

import { computeDailyBalances } from '@/src/lib/balance';
import { useSettingsStore } from '@/src/stores/useSettingsStore';

import { useMonthTransactions } from './useMonthTransactions';

export function useDailyBalances(year: number, month: number) {
  const initialBalance = useSettingsStore((s) => s.initialBalance);
  const { data: transactions = [], ...queryResult } = useMonthTransactions(year, month);

  const dailyBalances = useMemo(
    () => computeDailyBalances(transactions, initialBalance, year, month),
    [transactions, initialBalance, year, month],
  );

  return { data: dailyBalances, ...queryResult };
}
