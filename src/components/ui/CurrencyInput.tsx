import { useEffect, useRef } from "react";
import { Pressable, TextInput, useColorScheme } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { TransactionType } from "@/src/features/transactions/types";
import { formatBRL } from "@/src/lib/currency";

interface CurrencyInputProps {
  value: number; // centavos
  onValueChange: (cents: number) => void;
  type?: TransactionType;
}

// Hex approximations of the oklch tokens from global.css
const COLORS = {
  light: {
    diario: "#CBA122", // oklch(0.75 0.13 85)
    saida: "#D64E45", // oklch(0.62 0.16 15)
    entrada: "#355E45", // oklch(0.42 0.06 155)
    economia: "#1E3D2B", // oklch(0.25 0.04 160)
  },
  dark: {
    diario: "#C89F22", // oklch(0.75 0.12 85)
    saida: "#E65A4A", // oklch(0.65 0.18 15)
    entrada: "#4C8A62", // oklch(0.55 0.08 155)
    economia: "#5AB87A", // oklch(0.72 0.16 155)
  },
} as const;

export function CurrencyInput({
  value,
  onValueChange,
  type = "diario",
}: CurrencyInputProps) {
  const inputRef = useRef<TextInput>(null);
  const scheme = useColorScheme();
  const palette = COLORS[scheme === "dark" ? "dark" : "light"];

  const fromColor = useSharedValue(palette[type]);
  const toColor = useSharedValue(palette[type]);
  const progress = useSharedValue(1);
  const prevType = useRef<TransactionType>(type);
  const opacity = useSharedValue(value === 0 ? 0.35 : 1);

  useEffect(() => {
    if (prevType.current === type) return;
    fromColor.value = palette[prevType.current];
    toColor.value = palette[type];
    progress.value = 0;
    progress.value = withTiming(1, { duration: 300 });
    prevType.current = type;
  }, [type, palette, fromColor, toColor, progress]);

  const isEmpty = value === 0;
  useEffect(() => {
    opacity.value = withTiming(isEmpty ? 0.35 : 1, { duration: 200 });
  }, [isEmpty, opacity]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [fromColor.value, toColor.value],
    ),
    opacity: opacity.value,
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [fromColor.value, toColor.value],
    ),
  }));

  const handleChangeText = (text: string) => {
    const digits = text.replace(/\D/g, "");
    onValueChange(digits ? parseInt(digits, 10) : 0);
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      <Animated.Text
        style={animatedTextStyle}
        className="font-mono-semibold text-balance-highlight"
      >
        {formatBRL(value)}
      </Animated.Text>
      <Animated.View style={animatedBgStyle} className="mt-2 h-0.5" />
      <TextInput
        ref={inputRef}
        value={String(value)}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        caretHidden
        style={{ height: 0, width: 0, opacity: 0 }}
      />
    </Pressable>
  );
}
