import { useMemo } from "react";

import { useMonthTransactions } from "./useMonthTransactions";

/**
 * Retorna as transações de um dia filtrando sobre o cache do mês.
 * Não faz requisição extra ao servidor — reutiliza os dados já buscados pela tela de Saldos.
 */
export function useDayTransactions(year: number, month: number, day: number) {
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const { data: transactions = [], ...queryResult } = useMonthTransactions(
    year,
    month,
  );

  const dayTransactions = useMemo(
    () => transactions.filter((tx) => tx.date === dateStr),
    [transactions, dateStr],
  );

  return { data: dayTransactions, ...queryResult };
}
