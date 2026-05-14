import { useEffect, useRef } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { TransactionType } from "@/src/features/transactions/types";
import { SPRING } from "@/src/lib/animations";

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

const TYPE_COLORS: Record<TransactionType, { dot: string; text: string }> = {
  diario: { dot: "bg-warning", text: "text-warning" },
  saida: { dot: "bg-danger", text: "text-danger" },
  entrada: { dot: "bg-success", text: "text-success" },
  economia: { dot: "bg-accent", text: "text-accent" },
};

// Pill background hex — matches CurrencyInput's COLORS palette
const PILL_COLORS = {
  light: {
    diario: "#CBA12226",
    saida: "#D64E4526",
    entrada: "#355E4526",
    economia: "#1E3D2B26",
  },
  dark: {
    diario: "#C89F2226",
    saida: "#E65A4A26",
    entrada: "#4C8A6226",
    economia: "#5AB87A26",
  },
} as const;


export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const scheme = useColorScheme();
  const palette = PILL_COLORS[scheme === "dark" ? "dark" : "light"];

  const chipLayouts = useRef<{ x: number; width: number }[]>([]);
  const initialized = useRef(false);

  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);

  const currentIndex = TYPES.findIndex((t) => t.value === value);

  // Animate pill when value changes (after initial layout)
  useEffect(() => {
    if (!initialized.current) return;
    const layout = chipLayouts.current[currentIndex];
    if (!layout) return;
    pillX.value = withSpring(layout.x, SPRING);
    pillW.value = withSpring(layout.width, SPRING);
  }, [currentIndex, pillX, pillW]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillW.value,
    backgroundColor: palette[value],
  }));

  return (
    <View className="bg-surface-secondary flex-row gap-1 rounded-2xl p-1.5">
      {/* Sliding pill background */}
      <Animated.View
        style={pillStyle}
        className="absolute top-1.5 bottom-1.5 rounded-xl"
      />

      {TYPES.map((type, i) => {
        const active = value === type.value;
        const colors = TYPE_COLORS[type.value];

        return (
          <Pressable
            key={type.value}
            onPress={() => onChange(type.value)}
            className="flex-1 flex-row items-center justify-center gap-1.5 py-2"
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              chipLayouts.current[i] = { x, width };

              // Set initial position without animation
              if (!initialized.current && i === currentIndex) {
                pillX.value = x;
                pillW.value = width;
                initialized.current = true;
              }
            }}
          >
            <View
              className={`h-2 w-2 rounded-full ${active ? colors.dot : "bg-muted"}`}
            />
            <Text
              className={`text-sm font-semibold ${active ? colors.text : "text-muted"}`}
            >
              {type.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
