import type { Href } from "expo-router";

import type { Transaction } from "@/src/features/transactions/types/domain";

/**
 * Rota de detalhe de um lançamento. Ocorrências de uma série compartilham o
 * mesmo id, então recorrentes levam a date da ocorrência tocada pra que a tela
 * de detalhe saiba qual instância está sendo aberta. Avulsas vão só com o id.
 */
export function transactionDetailHref(tx: Transaction): Href {
  return {
    pathname: "/transaction/[id]",
    params: tx.seriesId ? { id: tx.id, date: tx.date } : { id: tx.id },
  };
}
