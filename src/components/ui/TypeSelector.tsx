import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const activeIndex = TYPES.findIndex((type) => type.value === value);
    const layout = chipLayouts.current[activeIndex];

    if (!layout) return;

    if (initialized.current) {
      pillX.value = withSpring(layout.x, SPRING);
      pillW.value = withSpring(layout.width, SPRING);
      return;
    }

    pillX.value = layout.x;
    pillW.value = layout.width;
    initialized.current = true;
  }, [pillW, pillX, value]);

  return (
    <View className="relative min-h-11 flex-row items-center justify-between">
      <Animated.View
        pointerEvents="none"
        style={pillStyle}
        className="absolute top-0 bottom-0 rounded-full"
      />

      {TYPES.map((type, index) => {
        const active = value === type.value;
        const colors = CATEGORY_COLORS[type.value];

        return (
          <Pressable
            key={type.value}
            onPress={() => onChange(type.value)}
            className="z-10 min-h-11 flex-row items-center justify-center gap-1.5 rounded-full px-2.5"
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              chipLayouts.current[index] = { x, width };

              if (!initialized.current && active) {
                pillX.value = x;
                pillW.value = width;
                initialized.current = true;
              }
            }}
          >
            <View
              style={active ? { backgroundColor: colors.dot } : undefined}
              className={`h-2 w-2 rounded-full ${active ? "" : "bg-muted/40"}`}
            />
            <Text
              style={active ? { color: colors.ink } : undefined}
              className={`text-sm font-bold ${active ? "" : "text-muted"}`}
              numberOfLines={1}
            >
              {type.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
