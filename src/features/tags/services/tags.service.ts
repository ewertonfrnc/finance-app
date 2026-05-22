import { apiClient } from '@/src/services/client';
import type { ApiTransaction } from '@/src/features/transactions/types/api';
import type { Transaction } from '@/src/features/transactions/types/domain';
import { mapApiTransaction } from '@/src/lib/mappers';
import type {
  ApiCreateTagPayload,
  ApiResponse,
  ApiTag,
  ApiTagWithTotal,
  ApiUpdateTagPayload,
} from '../types/api';
import type { Tag, TagWithTotal } from '../types/domain';

function mapApiTag(raw: ApiTag): Tag {
  return {
    id: raw.id,
    name: raw.name,
    color: raw.color,
    userId: raw.user_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapApiTagWithTotal(raw: ApiTagWithTotal): TagWithTotal {
  return {
    ...mapApiTag(raw),
    monthlyTotal: raw.monthly_total,
    transactionCount: raw.transaction_count,
  };
}

export async function getTagsWithTotals(year: number, month: number): Promise<TagWithTotal[]> {
  const response = await apiClient.get<ApiResponse<ApiTagWithTotal[]>>('/v1/tags', {
    params: { year, month },
  });
  return response.data.data.map(mapApiTagWithTotal);
}

export async function getTagTransactions(
  tagId: string,
  year: number,
  month: number,
): Promise<Transaction[]> {
  const response = await apiClient.get<ApiResponse<ApiTransaction[]>>(
    `/v1/tags/${tagId}/transactions`,
    { params: { year, month } },
  );
  return response.data.data.map(mapApiTransaction);
}

export async function createTag(payload: ApiCreateTagPayload): Promise<Tag> {
  const response = await apiClient.post<ApiResponse<ApiTag>>('/v1/tags', payload);
  return mapApiTag(response.data.data);
}

export async function updateTag(id: string, payload: ApiUpdateTagPayload): Promise<Tag> {
  const response = await apiClient.patch<ApiResponse<ApiTag>>(`/v1/tags/${id}`, payload);
  return mapApiTag(response.data.data);
}

export async function deleteTag(id: string): Promise<void> {
  await apiClient.delete(`/v1/tags/${id}`);
}

export async function setTransactionTags(transactionId: string, tagIds: string[]): Promise<void> {
  await apiClient.put(`/v1/transactions/${transactionId}/tags`, { tags: tagIds });
}
