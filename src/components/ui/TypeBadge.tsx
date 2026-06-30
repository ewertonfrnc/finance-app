import { View, useColorScheme } from "react-native";

import type { TransactionType } from "@/src/features/transactions/types";
import { categoryColorsForScheme } from "@/src/lib/designTokens";
import { TRANSACTION_TYPE_VISUAL } from "@/src/lib/transactionTypeVisuals";

const SIZE = {
  sm: {
    container: "w-6 h-6 rounded-lg",
    iconSize: 13,
  },
  md: {
    container: "w-8 h-8 rounded-xl",
    iconSize: 17,
  },
};

interface TypeBadgeProps {
  type: TransactionType;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const scheme = useColorScheme();
  const colors = categoryColorsForScheme(scheme)[type];
  const { Icon } = TRANSACTION_TYPE_VISUAL[type];
  const { container, iconSize } = SIZE[size];

  return (
    <View
      style={{ backgroundColor: colors.bg }}
      className={`${container} items-center justify-center`}
    >
      <Icon size={iconSize} color={colors.dot} strokeWidth={2.4} />
    </View>
  );
}
