import type { RecurrenceScope } from "@/src/features/transactions/types";
import { type ScopeOption, ScopeSheet } from "./ScopeSheet";

const OPTIONS: ScopeOption[] = [
  {
    scope: "single",
    label: "Apenas este lançamento",
    desc: "Remove só a ocorrência desta data. A série continua.",
  },
  {
    scope: "following",
    label: "Este e os próximos",
    desc: "Encerra a série a partir desta data.",
  },
  {
    scope: "all",
    label: "Toda a série",
    desc: "Remove o lançamento original e todas as ocorrências.",
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
