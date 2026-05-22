/** Tipos que espelham exatamente o contrato do backend Go. Não usar diretamente no app. */

export type { ApiResponse } from '@/src/lib/types';

export interface ApiTag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTagWithTotal extends ApiTag {
  monthly_total: number; // centavos
  transaction_count: number;
}

export interface ApiCreateTagPayload {
  name: string;
  color: string;
}

export interface ApiUpdateTagPayload {
  name?: string;
  color?: string;
}
