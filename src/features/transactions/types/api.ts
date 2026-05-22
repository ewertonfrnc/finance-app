/** Tipos que espelham exatamente o contrato do backend Go. Não usar diretamente no app. */

export type { ApiResponse } from '@/src/lib/types';

export type TransactionType = "entrada" | "saida" | "diario" | "economia";

export interface ApiTagRef {
  id: string;
  name: string;
  color: string;
}

export interface ApiTransaction {
  id: string;
  type: TransactionType;
  amount: number; // centavos
  description: string;
  date: string; // ISO datetime: "2026-04-12T00:00:00Z"
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: ApiTagRef[];
}

export interface ApiListTransactionsParams {
  year: number;
  month: number;
  day?: number;
  type?: TransactionType;
}

export interface ApiCreateTransactionPayload {
  type: TransactionType;
  amount: number; // centavos
  description: string;
  date: string; // "YYYY-MM-DD"
}

export interface ApiUpdateTransactionPayload {
  type?: TransactionType;
  amount?: number; // centavos
  description?: string;
  date?: string; // "YYYY-MM-DD"
}

export interface ApiDayBalance {
  day: number;
  income: number; // centavos
  expense: number; // centavos
  daily: number; // centavos — daily_actual + daily_projected
  daily_projected: number; // centavos — só a projeção do orçamento diário
  savings: number; // centavos
  running_balance: number; // centavos
}
