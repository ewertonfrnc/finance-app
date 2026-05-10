import type {
  ApiCreateTransactionPayload,
  ApiDayBalance,
  ApiListTransactionsParams,
  ApiResponse,
  ApiTransaction,
  ApiUpdateTransactionPayload,
} from "@/src/features/transactions/types";
import { mapApiTransaction } from "@/src/lib/mappers";

import { apiClient } from "@/src/services/client";
import type { Transaction } from "../types/domain";

export async function listTransactions(
  params: ApiListTransactionsParams,
): Promise<ApiTransaction[]> {
  const response = await apiClient.get<ApiResponse<ApiTransaction[]>>(
    "/v1/transactions",
    { params },
  );

  if (!response.data.success) {
    throw new Error("Resposta inválida da API");
  }

  return response.data.data;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await apiClient.get<ApiResponse<ApiTransaction>>(
    `/v1/transactions/${id}`,
  );
  return mapApiTransaction(response.data.data);
}

export async function createTransaction(
  payload: ApiCreateTransactionPayload,
): Promise<Transaction> {
  const response = await apiClient.post<ApiResponse<ApiTransaction>>(
    "/v1/transactions",
    payload,
  );
  return mapApiTransaction(response.data.data);
}

export async function updateTransaction(
  id: string,
  payload: ApiUpdateTransactionPayload,
): Promise<Transaction> {
  const response = await apiClient.patch<ApiResponse<ApiTransaction>>(
    `/v1/transactions/${id}`,
    payload,
  );
  return mapApiTransaction(response.data.data);
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/v1/transactions/${id}`);
}

export async function getMonthBalance(
  year: number,
  month: number,
): Promise<ApiDayBalance[]> {
  const response = await apiClient.get<ApiResponse<ApiDayBalance[]>>(
    "/v1/balance",
    { params: { year, month } },
  );

  if (!response.data.success) {
    throw new Error("Resposta inválida da API");
  }

  return response.data.data;
}
