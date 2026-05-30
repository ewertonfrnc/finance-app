import type { RecurrenceScope } from "@/src/features/transactions/types";
import { type ScopeOption, ScopeSheet } from "./ScopeSheet";

const OPTIONS: ScopeOption[] = [
  {
    scope: "single",
    label: "Apenas este lançamento",
    desc: "Remove só este dia. A série continua.",
  },
  {
    scope: "following",
    label: "Este e os próximos",
    desc: "Remove este e todos os próximos lançamentos.",
  },
  {
    scope: "all",
    label: "Toda a série",
    desc: "Remove todos os lançamentos da série.",
    tone: "danger",
  },
];

interface DeleteScopeSheetProps {
  isPending: boolean;
  onClose: () => void;
  onConfirm: (scope: RecurrenceScope) => void;
}

export function DeleteScopeSheet(props: DeleteScopeSheetProps) {
  return <ScopeSheet title="Excluir esta série?" options={OPTIONS} {...props} />;
}
