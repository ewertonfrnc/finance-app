import { listTransactions } from "@/src/features/transactions/services/transactions.service";
import type { Transaction } from "@/src/features/transactions/types";
import { mapApiTransaction } from "@/src/lib/mappers";

/**
 * Busca as transações de um dia específico e converte para tipos de domínio.
 * Usado como fallback; prefira filtrar sobre o cache do mês via useMonthTransactions.
 */
export async function getDayTransactions(
  year: number,
  month: number,
  day: number,
): Promise<Transaction[]> {
  const raw = await listTransactions({ year, month, day });
  return raw.map(mapApiTransaction);
}
