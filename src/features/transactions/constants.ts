import type { TransactionType } from "./types";

export const DAY_FILTER_OPTIONS: {
  label: string;
  value: TransactionType | null;
}[] = [
  { label: "Todas", value: null },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
  { label: "Diários", value: "diario" },
  { label: "Economia", value: "economia" },
];
