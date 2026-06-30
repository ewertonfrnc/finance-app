import {
  ArrowDownLeft,
  ArrowUpRight,
  BanknoteArrowDown,
  PiggyBank,
  type LucideIcon,
} from "lucide-react-native";

import type { TransactionType } from "@/src/features/transactions/types";

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  entrada: "Entrada",
  saida: "Saída",
  diario: "Diário",
  economia: "Economia",
};

export const TRANSACTION_TYPE_VISUAL: Record<
  TransactionType,
  { Icon: LucideIcon; label: string }
> = {
  entrada: { Icon: ArrowUpRight, label: TRANSACTION_TYPE_LABEL.entrada },
  saida: { Icon: ArrowDownLeft, label: TRANSACTION_TYPE_LABEL.saida },
  diario: { Icon: BanknoteArrowDown, label: TRANSACTION_TYPE_LABEL.diario },
  economia: { Icon: PiggyBank, label: TRANSACTION_TYPE_LABEL.economia },
};
