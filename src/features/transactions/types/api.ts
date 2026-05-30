/** Tipos que espelham exatamente o contrato do backend Go. Não usar diretamente no app. */

export type { ApiResponse } from "@/src/lib/types";

export type TransactionType = "entrada" | "saida" | "diario" | "economia";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type RecurrenceScope = "single" | "following" | "all";

export interface ApiTagRef {
  id: string;
  name: string;
  color: string;
}

export interface ApiTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: ApiTagRef[];
  recurrence: RecurrenceType;
  series_id?: string;
  recurrence_end_date?: string;
  // Origem de uma avulsa criada por edição "single": vínculo com a série original.
  source_series_id?: string;
  source_occurrence_date?: string;
}

export interface ApiListTransactionsParams {
  year: number;
  month: number;
  day?: number;
  type?: TransactionType;
}

export interface ApiCreateTransactionPayload {
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  tags?: string[];
  recurrence?: RecurrenceType;
  recurrence_end_date?: string;
}

export interface ApiUpdateTransactionPayload {
  type?: TransactionType;
  amount?: number;
  description?: string;
  date?: string;
  tags?: string[];
  scope?: RecurrenceScope;
  instance_date?: string;
}

export interface ApiDeleteScopeParams {
  scope: RecurrenceScope;
  date?: string;
}

export interface ApiDayBalance {
  day: number;
  income: number;
  expense: number;
  daily: number;
  daily_projected: number;
  savings: number;
  running_balance: number;
}
