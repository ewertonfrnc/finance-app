import type { ApiTransaction } from "@/src/features/transactions/types/api";
import type { Transaction } from "@/src/features/transactions/types/domain";

/** Converte o tipo bruto da API para o tipo de domínio do app. */
export function mapApiTransaction(raw: ApiTransaction): Transaction {
  const date = raw.date.split("T")[0]; // "2026-04-12T00:00:00Z" → "2026-04-12"
  return {
    id: raw.id,
    type: raw.type,
    amount: raw.amount,
    description: raw.description,
    date,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    userId: raw.user_id,
    tags: (raw.tags ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    })),
    recurrence: raw.recurrence ?? "none", // fallback p/ respostas antigas em cache
    seriesId: raw.series_id,
    recurrenceEndDate: raw.recurrence_end_date,
    // Ocorrências de uma série compartilham o mesmo id; a chave precisa da data.
    occurrenceKey: raw.series_id ? `${raw.series_id}:${date}` : raw.id,
  };
}
