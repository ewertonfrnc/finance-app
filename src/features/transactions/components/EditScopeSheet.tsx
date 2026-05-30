import type { RecurrenceScope } from "@/src/features/transactions/types";
import { type ScopeOption, ScopeSheet } from "./ScopeSheet";

const OPTIONS: ScopeOption[] = [
  {
    scope: "single",
    label: "Apenas este lançamento",
    desc: "Cria uma exceção só para esta data. A série segue como estava.",
  },
  {
    scope: "following",
    label: "Este e os próximos",
    desc: "Aplica a esta e às próximas ocorrências da série.",
  },
  {
    scope: "all",
    label: "Toda a série",
    desc: "Aplica a todas as ocorrências. A data não muda.",
  },
];

interface EditScopeSheetProps {
  isPending: boolean;
  onClose: () => void;
  onConfirm: (scope: RecurrenceScope) => void;
}

export function EditScopeSheet(props: EditScopeSheetProps) {
  return <ScopeSheet title="Salvar alterações" options={OPTIONS} {...props} />;
}
