import { useEffect, useRef } from "react";
import { Pressable, TextInput } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { TransactionType } from "@/src/features/transactions/types";
import { formatBRL } from "@/src/lib/currency";
import { CATEGORY_COLORS } from "@/src/lib/designTokens";

interface CurrencyInputProps {
  value: number; // centavos
  onValueChange: (cents: number) => void;
  type?: TransactionType;
}

export function CurrencyInput({
  value,
  onValueChange,
  type = "diario",
}: CurrencyInputProps) {
  const inputRef = useRef<TextInput>(null);

  const fromColor = useSharedValue(CATEGORY_COLORS[type].dot);
  const toColor = useSharedValue(CATEGORY_COLORS[type].dot);
  const progress = useSharedValue(1);
  const prevType = useRef<TransactionType>(type);
  const opacity = useSharedValue(value === 0 ? 0.35 : 1);

  useEffect(() => {
    if (prevType.current === type) return;
    fromColor.value = CATEGORY_COLORS[prevType.current].dot;
    toColor.value = CATEGORY_COLORS[type].dot;
    progress.value = 0;
    progress.value = withTiming(1, { duration: 300 });
    prevType.current = type;
  }, [type, fromColor, toColor, progress]);

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
