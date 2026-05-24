import { format, parseISO } from "date-fns";
import { memo, useCallback } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { formatWeekday, isWeekend } from "@/src/lib/date";
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

type HealthLevel =
  | "dark-green"
  | "light-green"
  | "yellow"
  | "light-red"
  | "dark-red";

const HEALTH_COLORS = {
  light: {
    "dark-green": { bg: "#b8ecd4", text: "#114d36" },
    "light-green": { bg: "#dbf4e7", text: "#185b43" },
    yellow: { bg: "#f8edc8", text: "#73580f" },
    "light-red": { bg: "#f8d9dd", text: "#852035" },
    "dark-red": { bg: "#efbcc5", text: "#701529" },
  },
  dark: {
    "dark-green": { bg: "#214f3c", text: "#baf5d7" },
    "light-green": { bg: "#1a3f31", text: "#a6efca" },
    yellow: { bg: "#493f25", text: "#f4d98e" },
    "light-red": { bg: "#4a2b31", text: "#f8b8c3" },
    "dark-red": { bg: "#5a2530", text: "#ffd2da" },
  },
} as const;

// balance em centavos; limiares: 2000, 1000, 0, -500 reais
function getHealthLevel(balance: number): HealthLevel {
  if (balance >= 200000) return "dark-green";
  if (balance >= 100000) return "light-green";
  if (balance >= 0) return "yellow";
  if (balance > -50000) return "light-red";
  return "dark-red";
}

interface TransactionLinesProps {
  lines: { type: TransactionType; label: string }[];
  amounts: Record<TransactionType, number>;
}

function TransactionLines({ lines, amounts }: TransactionLinesProps) {
  if (lines.length === 0) {
    return (
      <View className="flex-row items-center justify-between opacity-35">
        <Text className="text-muted text-xs">Sem lançamento</Text>
        <CurrencyText value={0} variant="small" sign="neutral" />
      </View>
    );
  }

  return (
    <>
      {lines.map((cat) => (
        <View key={cat.type} className="flex-row items-center">
          <Text className="text-muted flex-1 text-xs">{cat.label}</Text>
          <CurrencyText
            value={amounts[cat.type]}
            variant="small"
            sign="neutral"
          />
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
  const futureOpacity = isProjectionOnly
    ? "opacity-50"
    : isFuture
      ? "opacity-80"
      : "";
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
  const healthLevel = getHealthLevel(dayBalance.endBalance);
  const colors =
    HEALTH_COLORS[scheme === "dark" ? "dark" : "light"][healthLevel];

  const weekendDayBg = weekend
    ? scheme === "dark"
      ? "rgba(120, 100, 60, 0.25)"
      : "rgba(200, 160, 60, 0.13)"
    : undefined;

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
          className={`font-mono-medium text-sm ${isToday ? "text-success" : "text-foreground"}`}
        >
          {dayNum}
        </Text>
        {isToday && (
          <View className="bg-success absolute top-1 -right-1 h-1.5 w-1.5 rounded-full" />
        )}
        <Text className="text-muted text-xs">{weekday}</Text>
      </View>

      <View className={`flex-1 justify-center gap-1 py-2 ${futureOpacity}`}>
        <TransactionLines lines={visibleLines} amounts={amounts} />
      </View>

      <View
        style={{
          backgroundColor: colors.bg,
          width: 144,
          borderBottomWidth: 2,
          borderBottomColor: scheme === "dark" ? "#131c14" : "#f7faf8",
        }}
        className={`items-end justify-center px-2.5 ${futureOpacity}`}
      >
        <CurrencyText
          value={dayBalance.endBalance}
          variant="small"
          sign="neutral"
          style={{ color: colors.text }}
        />
      </View>
    </AnimatedPressable>
  );
});
