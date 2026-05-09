import { formatDayHeader } from "@/src/lib/date";
import { Text, View } from "react-native";

import type { Transaction, TransactionType } from "@/src/features/transactions/types";
import { CurrencyText } from "../ui/CurrencyText";
import { TypeBadge } from "../ui/TypeBadge";

const TYPE_LABEL: Record<TransactionType, string> = {
  entrada: "Entradas",
  saida: "Saídas",
  diario: "Diários",
  economia: "Economia",
};

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { type, amount, description, date } = transaction;
  const isIncome = type === "entrada";
  const signedAmount = isIncome ? amount : -amount;

  return (
    <View className="flex-row items-center px-4 py-3 gap-3">
      <TypeBadge type={type} size="md" />

      <View className="flex-1">
        <Text className="text-foreground text-sm font-medium" numberOfLines={1}>
          {description}
        </Text>
        <View className="flex-row items-center gap-2 mt-0.5">
          <Text className="text-muted text-xs">{formatDayHeader(date)}</Text>
        </View>
      </View>

      <View className="items-end">
        <CurrencyText value={signedAmount} variant="small" />
        <Text className="text-muted text-xs mt-0.5">{TYPE_LABEL[type]}</Text>
      </View>
    </View>
  );
}
