import { format, parseISO } from "date-fns";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  type ViewStyle,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  type AnimatedStyle,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { getBalanceTierColors } from "@/src/lib/balanceTier";
import { formatWeekday, isWeekend } from "@/src/lib/date";
import { colorsForScheme } from "@/src/lib/designTokens";
import { usePrivacyStore } from "@/src/stores/usePrivacyStore";
import { CurrencyText } from "../ui/CurrencyText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DayRowProps {
  dayBalance: DayBalance;
  date: string;
  filter: TransactionType | null;
  onPress: (date: string) => void;
  onLongPress?: (date: string) => void;
}

const CATEGORIES: { type: TransactionType; label: string }[] = [
  { type: "entrada", label: "Entrada" },
  { type: "saida", label: "Saída" },
  { type: "diario", label: "Diário" },
  { type: "economia", label: "Economia" },
];

const TODAY = format(new Date(), "yyyy-MM-dd");
const PRIVACY_MASK = "••••";

interface TransactionLinesProps {
  lines: { type: TransactionType; label: string }[];
  amounts: Record<TransactionType, number>;
  hideEntrada?: boolean;
  entradaFadeStyle?: AnimatedStyle<ViewStyle>;
}

function TransactionLines({
  lines,
  amounts,
  hideEntrada = false,
  entradaFadeStyle,
}: TransactionLinesProps) {
  if (lines.length === 0) {
    return (
      <View className="flex-row items-center justify-between opacity-35">
        <Text className="text-muted text-body-small">Sem lançamento</Text>
        <CurrencyText value={0} variant="small" sign="neutral" />
      </View>
    );
  }

  return (
    <>
      {lines.map((cat) => (
        <View key={cat.type} className="flex-row items-center">
          <Text className="text-muted text-body-small flex-1">{cat.label}</Text>
          {cat.type === "entrada" ? (
            <Animated.View style={entradaFadeStyle}>
              {hideEntrada ? (
                <Text className="font-mono-medium text-foreground text-base">
                  {PRIVACY_MASK}
                </Text>
              ) : (
                <CurrencyText
                  value={amounts[cat.type]}
                  variant="small"
                  sign="neutral"
                />
              )}
            </Animated.View>
          ) : (
            <CurrencyText
              value={amounts[cat.type]}
              variant="small"
              sign="neutral"
            />
          )}
        </View>
      ))}
    </>
  );
}

export const DayRow = memo(function DayRow({
  dayBalance,
  date,
  filter,
  onPress,
  onLongPress,
}: DayRowProps) {
  const { hideValues } = usePrivacyStore();

  const fadeOpacity = useSharedValue(1);
  const [displayHidden, setDisplayHidden] = useState(hideValues);
  const isMountedRef = useRef(false);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeOpacity.value }));

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    cancelAnimation(fadeOpacity);
    fadeOpacity.value = withTiming(0, { duration: 10 }, (finished) => {
      if (!finished) return;
      scheduleOnRN(setDisplayHidden, hideValues);
      // fade-in is started by the [displayHidden] effect below, after React commits the new content
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideValues]);

  // Starts fade-in only after React has committed the swapped content to the view tree
  useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 80 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayHidden]);

  const handlePress = useCallback(() => onPress(date), [onPress, date]);
  const handleLongPress = useCallback(
    () => onLongPress?.(date),
    [onLongPress, date],
  );
  const isToday = dayBalance.date === TODAY;
  const isFuture = dayBalance.date > TODAY;
  const weekend = isWeekend(dayBalance.date);
  const isProjectionOnly =
    isFuture &&
    dayBalance.daily > 0 &&
    dayBalance.daily === dayBalance.dailyProjected &&
    dayBalance.income === 0 &&
    dayBalance.expense === 0 &&
    dayBalance.savings === 0;
  const dayNum = format(parseISO(dayBalance.date), "dd");
  const weekday = formatWeekday(dayBalance.date);

  const amounts: Record<TransactionType, number> = {
    entrada: dayBalance.income,
    saida: dayBalance.expense,
    diario: dayBalance.daily,
    economia: dayBalance.savings,
  };

  const visibleLines = CATEGORIES.filter(
    (cat) => (filter === null || cat.type === filter) && amounts[cat.type] > 0,
  );

  const scheme = useColorScheme();
  const colors = getBalanceTierColors(dayBalance.endBalance, scheme);
  const dsColors = colorsForScheme(scheme);
  const dayNumColor = isToday
    ? dsColors.green
    : isFuture
      ? dsColors.future
      : dsColors.text;
  const weekdayColor = isFuture ? dsColors.futureMute : dsColors.mute;

  const weekendDayBg = weekend ? dsColors.weekendBg : undefined;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className="flex-row items-stretch gap-3 rounded-lg pl-4"
    >
      <View
        style={weekendDayBg ? { backgroundColor: weekendDayBg } : undefined}
        className="my-2 w-8 items-center justify-center rounded-md py-0.5"
      >
        <Text
          style={{ color: dayNumColor }}
          className="font-mono-medium text-sm"
        >
          {dayNum}
        </Text>
        {isToday && (
          <View
            style={{ backgroundColor: dsColors.green }}
            className="absolute top-1 -right-1 h-1.5 w-1.5 rounded-full"
          />
        )}
        <Text
          style={{ color: weekdayColor }}
          className="text-weekday font-medium tracking-wide uppercase"
        >
          {weekday}
        </Text>
      </View>

      <View
        className={`flex-1 justify-center gap-1 py-2 ${isProjectionOnly ? "opacity-50" : ""}`}
      >
        <TransactionLines
          lines={visibleLines}
          amounts={amounts}
          hideEntrada={displayHidden}
          entradaFadeStyle={fadeStyle}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.bg,
          width: 144,
          borderBottomWidth: 2,
          borderBottomColor: dsColors.hair,
        }}
        className={`items-end justify-center px-2.5`}
      >
        <Animated.View style={fadeStyle}>
          {displayHidden ? (
            <Text
              style={{ color: colors.ink }}
              className="font-mono-medium text-base"
            >
              {PRIVACY_MASK}
            </Text>
          ) : (
            <CurrencyText
              value={dayBalance.endBalance}
              variant="small"
              sign="neutral"
              style={{ color: colors.ink }}
            />
          )}
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
});
