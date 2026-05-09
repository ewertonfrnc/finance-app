import { getDaysInMonth } from 'date-fns';

import type { DayBalance, Transaction } from '@/src/features/transactions/types';

/**
 * Acumula o saldo dia a dia a partir de uma lista de transações e de um saldo inicial.
 * Função pura — sem side effects, testável sem mock de rede.
 */
export function computeDailyBalances(
  transactions: Transaction[],
  initialBalance: number,
  year: number,
  month: number,
): DayBalance[] {
  const days = getDaysInMonth(new Date(year, month - 1));
  const monthStr = String(month).padStart(2, '0');

  // Agrupa transações por data ("2026-04-12")
  const byDay = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const list = byDay.get(tx.date) ?? [];
    list.push(tx);
    byDay.set(tx.date, list);
  }

  let running = initialBalance;

  return Array.from({ length: days }, (_, i) => {
    const dayStr = String(i + 1).padStart(2, '0');
    const date = `${year}-${monthStr}-${dayStr}`;
    const dayTxs = byDay.get(date) ?? [];

    const totalIncome = dayTxs
      .filter((t) => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpending = dayTxs
      .filter((t) => t.type !== 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    running = running + totalIncome - totalSpending;

    return { date, endBalance: running, totalIncome, totalSpending };
  });
}
