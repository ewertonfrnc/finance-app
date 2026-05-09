import { Pressable, Text } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-3 py-1.5 ${
        selected ? "bg-accent" : "bg-surface-secondary"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? "text-accent-foreground" : "text-foreground"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
