import type { TransactionType } from "@/src/features/transactions/types";
import { Text, View } from "react-native";

interface TypeBadgeProps {
  type: TransactionType;
  size?: "sm" | "md";
}

const TYPE_CONFIG: Record<
  TransactionType,
  { label: string; bgClass: string; textClass: string }
> = {
  entrada: {
    label: "E",
    bgClass: "bg-success",
    textClass: "text-success-foreground",
  },
  saida: {
    label: "S",
    bgClass: "bg-danger",
    textClass: "text-danger-foreground",
  },
  diario: {
    label: "D",
    bgClass: "bg-warning",
    textClass: "text-warning-foreground",
  },
  economia: {
    label: "EC",
    bgClass: "bg-accent",
    textClass: "text-accent-foreground",
  },
};

const SIZE_CLASSES = {
  sm: { container: "w-6 h-6 rounded-full", text: "text-xs font-bold" },
  md: { container: "w-8 h-8 rounded-full", text: "text-sm font-bold" },
};

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const { label, bgClass, textClass } = TYPE_CONFIG[type];
  const { container, text } = SIZE_CLASSES[size];
  return (
    <View className={`${container} ${bgClass} items-center justify-center`}>
      <Text className={`${text} ${textClass}`}>{label}</Text>
    </View>
  );
}
