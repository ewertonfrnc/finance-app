import { Text, View } from "react-native";

interface TagBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

export function TagBadge({ name, color, size = "md" }: TagBadgeProps) {
  const isSmall = size === "sm";
  return (
    <View
      style={{ backgroundColor: color + "33" }}
      className={`rounded-full flex-row items-center gap-1 ${
        isSmall ? "px-2 py-0.5" : "px-2.5 py-1"
      }`}
    >
      <View
        style={{ backgroundColor: color }}
        className={isSmall ? "w-1.5 h-1.5 rounded-full" : "w-2 h-2 rounded-full"}
      />
      <Text
        className={`font-medium text-foreground ${
          isSmall ? "text-[10px]" : "text-xs"
        }`}
      >
        {name}
      </Text>
    </View>
  );
}
