import { Text, View, useColorScheme } from "react-native";

import { getTagColors } from "../constants";

interface TagBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

export function TagBadge({ name, color, size = "md" }: TagBadgeProps) {
  const isSmall = size === "sm";
  const scheme = useColorScheme();
  const colors = getTagColors(color, scheme);

  return (
    <View
      style={{
        borderColor: colors.dot,
        borderWidth: 1,
      }}
      className={`bg-surface-secondary flex-row items-center gap-1 rounded-full ${
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
        className={`text-foreground font-medium ${isSmall ? "text-[10px]" : "text-xs"}`}
      >
        {name}
      </Text>
    </View>
  );
}
