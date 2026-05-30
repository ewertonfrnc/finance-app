import type { RecurrenceScope } from "@/src/features/transactions/types";
import { type ScopeOption, ScopeSheet } from "./ScopeSheet";

const OPTIONS: ScopeOption[] = [
  {
    scope: "single",
    label: "Apenas este lançamento",
    desc: "Muda só este dia. Os outros continuam iguais.",
  },
  {
    scope: "following",
    label: "Este e os próximos",
    desc: "Muda este e os próximos lançamentos da série.",
  },
  {
    scope: "all",
    label: "Toda a série",
    desc: "Muda todos os lançamentos da série.",
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
