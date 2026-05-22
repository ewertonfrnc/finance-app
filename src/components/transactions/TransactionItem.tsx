import { Pressable, Text, View } from "react-native";

import { TagBadge } from "@/src/features/tags/components/TagBadge";
import type {
  Transaction,
  TransactionType,
} from "@/src/features/transactions/types";
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
  onPress?: () => void;
}

export function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  const { type, amount, description } = transaction;
  const isIncome = type === "entrada";
  const signedAmount = isIncome ? amount : -amount;

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

        {transaction.tags.length > 0 && (
          <View className="mt-1 flex-row flex-wrap gap-1">
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
        <CurrencyText value={signedAmount} variant="small" />
        <Text className="text-muted mt-0.5 text-xs">{TYPE_LABEL[type]}</Text>
      </View>
    </Pressable>
  );
}
