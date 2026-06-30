import { Repeat } from "lucide-react-native";
import { Pressable, Text, View, useColorScheme } from "react-native";

import { TagBadge } from "@/src/features/tags/components/TagBadge";
import type { Transaction } from "@/src/features/transactions/types";
import { formatDayHeader } from "@/src/lib/date";
import { colorsForScheme } from "@/src/lib/designTokens";
import { TRANSACTION_TYPE_LABEL } from "@/src/lib/transactionTypeVisuals";
import { CurrencyText } from "../ui/CurrencyText";
import { TypeBadge } from "../ui/TypeBadge";

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
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  const isRecurring = transaction.recurrence !== "none";
  const hasSubline = showDate || isRecurring || transaction.tags.length > 0;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3"
    >
      <TypeBadge type={type} size="md" />

      <View className="flex-1">
        <Text
          className="text-foreground text-transaction font-semibold"
          numberOfLines={1}
        >
          {description}
        </Text>

        {hasSubline && (
          <View className="mt-1 flex-row flex-wrap items-center gap-1">
            {isRecurring && (
              <Repeat size={12} color={colors.mute} strokeWidth={2} />
            )}
            {showDate && (
              <Text className="text-muted text-body-small">
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
        <Text className="text-muted text-body-small mt-0.5">
          {TRANSACTION_TYPE_LABEL[type]}
        </Text>
      </View>
    </Pressable>
  );
}
