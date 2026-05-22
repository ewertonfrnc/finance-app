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
      className={`flex-row items-center gap-1 rounded-full ${
        isSmall ? "px-2 py-0.5" : "px-2.5 py-1"
      }`}
    >
      <View
        style={{ backgroundColor: color }}
        className={
          isSmall ? "h-1.5 w-1.5 rounded-full" : "h-2 w-2 rounded-full"
        }
      />
      <Text
        className={`text-foreground font-medium ${
          isSmall ? "text-[10px]" : "text-xs"
        }`}
      >
        {name}
      </Text>
    </View>
  );
}
