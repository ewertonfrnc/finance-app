import { Pressable, Text, View } from "react-native";

import { TagBadge } from "@/src/features/tags/components/TagBadge";
import type {
  Transaction,
  TransactionType,
} from "@/src/features/transactions/types";
import { formatDayHeader } from "@/src/lib/date";
import { CurrencyText } from "../ui/CurrencyText";
import { TypeBadge } from "../ui/TypeBadge";

const TYPE_LABEL: Record<TransactionType, string> = {
  entrada: "Entrada",
  saida: "Saída",
  diario: "Diário",
  economia: "Economia",
};

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  showDate?: boolean;
}

export function TransactionItem({
  transaction,
  onPress,
  showDate = false,
}: TransactionItemProps) {
  const { type, amount, description } = transaction;

  const hasSubline = showDate || transaction.tags.length > 0;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3"
    >
      <TypeBadge type={type} size="md" />

      <View className="flex-1">
        <Text
          className="text-foreground text-base font-medium"
          numberOfLines={1}
        >
          {description}
        </Text>

        {hasSubline && (
          <View className="mt-1 flex-row flex-wrap items-center gap-1">
            {showDate && (
              <Text className="text-muted text-xs">
                {formatDayHeader(transaction.date)}
              </Text>
            )}
            {transaction.tags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                color={tag.color}
                size="sm"
              />
            ))}
          </View>
        )}
      </View>

      <View className="items-end">
        <CurrencyText value={amount} sign="neutral" variant="small" />
        <Text className="text-muted mt-0.5 text-xs">{TYPE_LABEL[type]}</Text>
      </View>
    </Pressable>
  );
}
