import type { TransactionType } from "@/src/features/transactions/types";

function getScope(userId: string | null) {
  return userId ?? "anonymous";
}

export const queryKeys = {
  transactions: (
    userId: string | null,
    year: number,
    month: number,
    day?: number,
    type?: TransactionType,
  ) => ["transactions", getScope(userId), year, month, day, type] as const,
  transactionsAll: (userId: string | null) =>
    ["transactions", getScope(userId)] as const,
  transaction: (userId: string | null, id: string) =>
    ["transactions", getScope(userId), "detail", id] as const,
  balance: (userId: string | null, year: number, month: number) =>
    ["balance", getScope(userId), year, month] as const,
  balanceAll: (userId: string | null) => ["balance", getScope(userId)] as const,
  tags: (userId: string | null, year: number, month: number) =>
    ["tags", getScope(userId), year, month] as const,
  tagsAll: (userId: string | null) => ["tags", getScope(userId)] as const,
  tagTransactions: (
    userId: string | null,
    tagId: string,
    year: number,
    month: number,
  ) => ["tags", getScope(userId), tagId, "transactions", year, month] as const,
} as const;
