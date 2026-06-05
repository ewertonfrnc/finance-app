import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { TransactionType } from "@/src/features/transactions/types";
import { SPRING } from "@/src/lib/animations";
import { CATEGORY_COLORS } from "@/src/lib/designTokens";

interface TypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

const TYPES: { value: TransactionType; label: string }[] = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "diario", label: "Diário" },
  { value: "economia", label: "Economia" },
];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const chipLayouts = useRef<{ x: number; width: number }[]>([]);
  const initialized = useRef(false);

  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillW.value,
    backgroundColor: CATEGORY_COLORS[value].bg,
  }));

  function handlePress(index: number, type: TransactionType) {
    const layout = chipLayouts.current[index];
    if (layout) {
      pillX.value = withSpring(layout.x, SPRING);
      pillW.value = withSpring(layout.width, SPRING);
    }
    onChange(type);
  }

  return (
    <View className="bg-surface-secondary border-surface-tertiary flex-row gap-1 rounded-4xl border px-1.5 py-2.5">
      {/* Sliding pill background */}
      <Animated.View
        style={pillStyle}
        className="absolute top-1.5 bottom-1.5 rounded-4xl"
      />

      {TYPES.map((type, i) => {
        const active = value === type.value;
        const colors = CATEGORY_COLORS[type.value];

        return (
          <Pressable
            key={type.value}
            onPress={() => handlePress(i, type.value)}
            className="flex-1 flex-row items-center justify-center gap-1.5 py-2"
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              chipLayouts.current[i] = { x, width };

              // Set initial position without animation
              if (!initialized.current && active) {
                pillX.value = x;
                pillW.value = width;
                initialized.current = true;
              }
            }}
          >
            <View
              style={active ? { backgroundColor: colors.dot } : undefined}
              className={`h-2 w-2 rounded-full ${active ? "" : "bg-muted"}`}
            />
            <Text
              style={active ? { color: colors.ink } : undefined}
              className={`text-sm font-semibold ${active ? "" : "text-muted"}`}
            >
              {type.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
