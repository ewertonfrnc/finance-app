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
import { categoryColorsForScheme } from "@/src/lib/designTokens";

interface CurrencyInputProps {
  value: number; // centavos
  onValueChange: (cents: number) => void;
  type?: TransactionType;
  accentColor?: string;
}

export function CurrencyInput({
  value,
  onValueChange,
  type = "diario",
  accentColor,
}: CurrencyInputProps) {
  const inputRef = useRef<TextInput>(null);
  const scheme = useColorScheme();
  const categoryColors = categoryColorsForScheme(scheme);
  const currentColor = accentColor ?? categoryColors[type].dot;

  const fromColor = useSharedValue(currentColor);
  const toColor = useSharedValue(currentColor);
  const progress = useSharedValue(1);
  const prevType = useRef<TransactionType>(type);
  const opacity = useSharedValue(value === 0 ? 0.35 : 1);

  useEffect(() => {
    if (prevType.current === type && toColor.value === currentColor) return;
    fromColor.value = toColor.value;
    toColor.value = currentColor;
    progress.value = 0;
    progress.value = withTiming(1, { duration: 300 });
    prevType.current = type;
  }, [type, currentColor, fromColor, toColor, progress]);

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
