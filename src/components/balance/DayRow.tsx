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
import { categoryColorsForScheme, schemeKey } from "@/src/lib/designTokens";
import { TRANSACTION_TYPE_VISUAL } from "@/src/lib/transactionTypeVisuals";
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

const CATEGORIES: {
  type: TransactionType;
  label: string;
}[] = [
  { type: "entrada", label: TRANSACTION_TYPE_VISUAL.entrada.label },
  { type: "saida", label: TRANSACTION_TYPE_VISUAL.saida.label },
  { type: "diario", label: TRANSACTION_TYPE_VISUAL.diario.label },
  { type: "economia", label: TRANSACTION_TYPE_VISUAL.economia.label },
];

const TODAY = format(new Date(), "yyyy-MM-dd");
const PRIVACY_MASK = "••••";
const CATEGORY_INACTIVE_COLORS = {
  light: { bg: "#ebeff1", ink: "#8d99a1" },
  dark: { bg: "#2a3438", ink: "#8f9ba2" },
} as const;
const ROW_SURFACE_COLORS = {
  light: {
    todayRow: "rgba(16, 60, 40, 0.03)",
    todayDate: "rgba(16, 60, 40, 0.10)",
    weekendDate: "rgba(14, 19, 16, 0.04)",
  },
  dark: {
    todayRow: "rgba(115, 205, 159, 0.08)",
    todayDate: "rgba(115, 205, 159, 0.10)",
    weekendDate: "rgba(255, 255, 255, 0.04)",
  },
} as const;
const CATEGORY_MARK_CLASSES: Record<
  TransactionType,
  { bg: string }
> = {
  entrada: { bg: "bg-cat-entrada-bg" },
  saida: { bg: "bg-cat-saida-bg" },
  diario: { bg: "bg-cat-diario-bg" },
  economia: { bg: "bg-cat-economia-bg" },
};

interface TransactionLinesProps {
  lines: { type: TransactionType; label: string }[];
  amounts: Record<TransactionType, number>;
  scheme: "light" | "dark";
  hideEntrada?: boolean;
  entradaFadeStyle?: AnimatedStyle<ViewStyle>;
}

function CategoryMark({
  category,
  inactiveColors,
  scheme,
}: {
  category?: { type: TransactionType };
  inactiveColors: { bg: string; ink: string };
  scheme: "light" | "dark";
}) {
  if (!category) {
    return (
      <View
        style={{ backgroundColor: inactiveColors.bg }}
        className="h-4 w-4 items-center justify-center rounded-full"
      >
        <Text
          style={{ color: inactiveColors.ink }}
          className="font-mono-semibold text-[10px] leading-none"
        >
          ·
        </Text>
      </View>
    );
  }

  const classes = CATEGORY_MARK_CLASSES[category.type];
  const colors = categoryColorsForScheme(scheme)[category.type];
  const { Icon } = TRANSACTION_TYPE_VISUAL[category.type];

  return (
    <View
      className={`h-4 w-4 items-center justify-center rounded ${classes.bg}`}
    >
      <Icon size={10} color={colors.dot} strokeWidth={2.6} />
    </View>
  );
}

function TransactionLines({
  lines,
  amounts,
  scheme,
  hideEntrada = false,
  entradaFadeStyle,
}: TransactionLinesProps) {
  const inactiveColors = CATEGORY_INACTIVE_COLORS[scheme];

  if (lines.length === 0) {
    return (
      <View className="flex-row items-center justify-between gap-3 opacity-45">
        <View className="flex-row items-center gap-2">
          <CategoryMark inactiveColors={inactiveColors} scheme={scheme} />
          <Text className="text-muted text-body-small">Sem lançamento</Text>
        </View>
        <CurrencyText value={0} variant="small" sign="neutral" />
      </View>
    );
  }

  return (
    <>
      {lines.map((cat) => {
        const active = amounts[cat.type] > 0;

        return (
          <View key={cat.type} className="flex-row items-center gap-2">
            <CategoryMark
              category={active ? { type: cat.type } : undefined}
              inactiveColors={inactiveColors}
              scheme={scheme}
            />
            <Text className="text-muted text-body-small flex-1">
              {cat.label}
            </Text>
            {cat.type === "entrada" ? (
              <Animated.View style={entradaFadeStyle}>
                {hideEntrada ? (
                  <Text className="font-mono-medium text-foreground text-sm">
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
        );
      })}
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
  const schemeName = schemeKey(scheme);
  const colors = getBalanceTierColors(dayBalance.endBalance, scheme);
  const surface = ROW_SURFACE_COLORS[schemeName];

  const dateCellBg = isToday
    ? surface.todayDate
    : weekend
      ? surface.weekendDate
      : undefined;
  const rowBg = isToday ? surface.todayRow : undefined;
  const dayNumClassName = `font-mono-semibold text-base leading-none ${
    isFuture ? "text-ds-future" : "text-ds-text"
  }`;
  const weekdayClassName = `font-mono-semibold text-weekday mt-0.5 tracking-wide uppercase ${
    isFuture ? "text-ds-future-mute" : "text-ds-mute"
  }`;

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
      style={[animatedStyle, rowBg ? { backgroundColor: rowBg } : undefined]}
      className="border-ds-hair relative flex-row items-stretch overflow-hidden border-b"
    >
      <View
        style={dateCellBg ? { backgroundColor: dateCellBg } : undefined}
        className="border-ds-hair relative w-14 items-center justify-center border-r py-2"
      >
        {isToday && (
          <View className="bg-ds-green absolute top-0 bottom-0 left-0 w-1 rounded-r-full" />
        )}
        <Text className={dayNumClassName}>{dayNum}</Text>
        <Text className={weekdayClassName}>{weekday}</Text>
      </View>

      <View
        className={`flex-1 justify-center gap-1 px-3 py-2 ${isProjectionOnly ? "opacity-50" : ""}`}
      >
        <TransactionLines
          lines={visibleLines}
          amounts={amounts}
          scheme={schemeName}
          hideEntrada={displayHidden}
          entradaFadeStyle={fadeStyle}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.bg,
        }}
        className="border-ds-hair w-36 items-end justify-center border-l px-2.5"
      >
        <Animated.View style={fadeStyle}>
          {displayHidden ? (
            <Text
              style={{ color: colors.ink }}
              className="font-mono-medium text-sm"
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
