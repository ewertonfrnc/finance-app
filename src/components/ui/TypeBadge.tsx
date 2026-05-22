import { ArrowDownLeft, ArrowUpRight, type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import type { TransactionType } from "@/src/features/transactions/types";

// Hex approximations of the theme oklch colors — same inline-style pattern as TagBadge
const TYPE_COLOR: Record<TransactionType, string> = {
  entrada:  "#2d7a52",
  saida:    "#c05050",
  diario:   "#a07820",
  economia: "#3d6b50",
};

type IconConfig = { kind: "icon"; Icon: LucideIcon };
type TextConfig = { kind: "text"; label: string };

const TYPE_CONFIG: Record<TransactionType, IconConfig | TextConfig> = {
  entrada:  { kind: "icon", Icon: ArrowUpRight },
  saida:    { kind: "icon", Icon: ArrowDownLeft },
  diario:   { kind: "text", label: "D" },
  economia: { kind: "text", label: "E" },
};

const SIZE = {
  sm: { container: "w-6 h-6 rounded-lg",  text: "text-xs font-bold",  iconSize: 13 },
  md: { container: "w-8 h-8 rounded-xl",  text: "text-sm font-bold", iconSize: 17 },
};

interface TypeBadgeProps {
  type: TransactionType;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const color  = TYPE_COLOR[type];
  const config = TYPE_CONFIG[type];
  const { container, text, iconSize } = SIZE[size];

  return (
    <View
      style={{ backgroundColor: color + "22" }}
      className={`${container} items-center justify-center`}
    >
      {config.kind === "icon" ? (
        <config.Icon size={iconSize} color={color} />
      ) : (
        <Text style={{ color }} className={text}>
          {config.label}
        </Text>
      )}
    </View>
  );
}
