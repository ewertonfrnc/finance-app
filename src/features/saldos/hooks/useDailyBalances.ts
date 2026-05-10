import { useBalanceQuery } from './useBalanceQuery';

export function useDailyBalances(year: number, month: number) {
  const { data = [], ...queryResult } = useBalanceQuery(year, month);
  return { data, ...queryResult };
}
