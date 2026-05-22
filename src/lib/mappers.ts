import type { ApiTransaction } from "@/src/features/transactions/types/api";
import type { Transaction } from "@/src/features/transactions/types/domain";

/** Converte o tipo bruto da API para o tipo de domínio do app. */
export function mapApiTransaction(raw: ApiTransaction): Transaction {
  return {
    id: raw.id,
    type: raw.type,
    amount: raw.amount,
    description: raw.description,
    date: raw.date.split("T")[0], // "2026-04-12T00:00:00Z" → "2026-04-12"
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    userId: raw.user_id,
    tags: (raw.tags ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    })),
  };
}
