import { Text, View } from "react-native";

import { getTagColors } from "../constants";

interface TagBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

export function TagBadge({ name, color, size = "md" }: TagBadgeProps) {
  const isSmall = size === "sm";
  const colors = getTagColors(color);

  return (
    <View
      style={{
        backgroundColor: colors.bg + "33",
        borderColor: colors.bg + "44",
        borderWidth: 1,
      }}
      className={`flex-row items-center gap-1 rounded-full ${
        isSmall ? "px-2 py-0.5" : "px-2.5 py-1"
      }`}
    >
      <View
        style={{ backgroundColor: colors.dot }}
        className={
          isSmall ? "h-1.5 w-1.5 rounded-full" : "h-2 w-2 rounded-full"
        }
      />
      <Text
        style={{ color: colors.ink }}
        className={`font-medium ${isSmall ? "text-[10px]" : "text-xs"}`}
      >
        {name}
      </Text>
    </View>
  );
}
