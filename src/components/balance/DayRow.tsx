import { format, parseISO } from "date-fns";
import { Pressable, Text, View, useColorScheme } from "react-native";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { formatWeekday, isWeekend } from "@/src/lib/date";
import { CurrencyText } from "../ui/CurrencyText";

interface DayRowProps {
  dayBalance: DayBalance;
  filter: TransactionType | null;
  onPress: () => void;
}

const CATEGORIES: { type: TransactionType; label: string }[] = [
  { type: "entrada", label: "Entradas" },
  { type: "saida", label: "Saídas" },
  { type: "diario", label: "Diários" },
  { type: "economia", label: "Economia" },
];

const TODAY = format(new Date(), "yyyy-MM-dd");

type HealthLevel = "dark-green" | "light-green" | "yellow" | "light-red" | "dark-red";

const HEALTH_COLORS = {
  light: {
    "dark-green":  { bg: "#b8ecd4", text: "#114d36" },
    "light-green": { bg: "#dbf4e7", text: "#185b43" },
    "yellow":      { bg: "#f8edc8", text: "#73580f" },
    "light-red":   { bg: "#f8d9dd", text: "#852035" },
    "dark-red":    { bg: "#efbcc5", text: "#701529" },
  },
  dark: {
    "dark-green":  { bg: "#214f3c", text: "#baf5d7" },
    "light-green": { bg: "#1a3f31", text: "#a6efca" },
    "yellow":      { bg: "#493f25", text: "#f4d98e" },
    "light-red":   { bg: "#4a2b31", text: "#f8b8c3" },
    "dark-red":    { bg: "#5a2530", text: "#ffd2da" },
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

export function DayRow({ dayBalance, filter, onPress }: DayRowProps) {
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
  const futureOpacity = isProjectionOnly ? "opacity-50" : isFuture ? "opacity-80" : "";
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
  const colors = HEALTH_COLORS[scheme === "dark" ? "dark" : "light"][healthLevel];

  const weekendDayBg = weekend
    ? scheme === "dark"
      ? "rgba(120, 100, 60, 0.25)"
      : "rgba(200, 160, 60, 0.13)"
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-lg px-4 py-3"
    >
      <View
        style={weekendDayBg ? { backgroundColor: weekendDayBg } : undefined}
        className="w-8 items-center rounded-md py-0.5"
      >
        <Text
          className={`font-mono-medium text-sm ${isToday ? "text-success" : "text-foreground"}`}
        >
          {dayNum}
        </Text>
        {isToday && (
          <View className="bg-success absolute -right-1 top-1 h-1.5 w-1.5 rounded-full" />
        )}
        <Text className="text-muted text-xs">{weekday}</Text>
      </View>

      <View className={`flex-1 gap-1 ${futureOpacity}`}>
        {visibleLines.length > 0 ? (
          visibleLines.map((cat) => (
            <View key={cat.type} className="flex-row items-center">
              <Text className="text-muted text-xs flex-1">{cat.label}</Text>
              <CurrencyText
                value={amounts[cat.type]}
                variant="small"
                sign="neutral"
              />
            </View>
          ))
        ) : (
          <View className="flex-row items-center justify-between opacity-35">
            <Text className="text-muted text-xs">Sem lançamento</Text>
            <CurrencyText value={0} variant="small" sign="neutral" />
          </View>
        )}
      </View>

      <View style={{ backgroundColor: colors.bg, minWidth: 128 }} className={`items-end rounded-md px-2.5 py-1 ${futureOpacity}`}>
        <CurrencyText
          value={dayBalance.endBalance}
          variant="small"
          sign="neutral"
          style={{ color: colors.text }}
        />
      </View>
    </Pressable>
  );
}
