/** Tipos que espelham exatamente o contrato do backend Go. Não usar diretamente no app. */

export type TransactionType = 'entrada' | 'saida' | 'diario' | 'economia';

export interface ApiTransaction {
  id: string;
  type: TransactionType;
  amount: number; // centavos
  description: string;
  date: string; // ISO datetime: "2026-04-12T00:00:00Z"
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
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
