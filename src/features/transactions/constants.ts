import type { RecurrenceType, TransactionType } from "./types";

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

/** Rótulo curto/minúsculo da recorrência — usado no badge da série e no chip do ScopeSheet. */
export const RECURRENCE_LABELS: Record<
  Exclude<RecurrenceType, "none">,
  string
> = {
  daily: "todo dia",
  weekly: "toda semana",
  monthly: "todo mês",
  yearly: "todo ano",
};

export function formatRecurrenceLabel(recurrence: RecurrenceType): string {
  return recurrence === "none" ? "" : RECURRENCE_LABELS[recurrence];
}
