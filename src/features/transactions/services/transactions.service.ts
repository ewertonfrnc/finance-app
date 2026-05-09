import type {
  ApiListTransactionsParams,
  ApiResponse,
  ApiTransaction,
} from "@/src/features/transactions/types";

import { apiClient } from "@/src/services/client";

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
