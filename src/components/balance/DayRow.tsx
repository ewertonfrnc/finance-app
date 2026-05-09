import { format, parseISO } from "date-fns";
import { Pressable, Text, View } from "react-native";

import type { DayBalance } from "@/src/features/transactions/types";
import { formatWeekday } from "@/src/lib/date";
import { CurrencyText } from "../ui/CurrencyText";

interface DayRowProps {
  dayBalance: DayBalance;
  isSelected: boolean;
  onPress: () => void;
}

const TODAY = format(new Date(), "yyyy-MM-dd");

export function DayRow({ dayBalance, isSelected, onPress }: DayRowProps) {
  const isToday = dayBalance.date === TODAY;
  const isFuture = dayBalance.date > TODAY;
  const dayNum = format(parseISO(dayBalance.date), "dd");
  const weekday = formatWeekday(dayBalance.date);

  return (
    <Pressable
      onPress={onPress}
      style={{ opacity: isFuture ? 0.35 : 1 }}
      className={`flex-row items-center px-4 py-3 ${isSelected ? "bg-surface" : ""}`}
    >
      <View className="w-7 items-center">
        <Text
          className={`font-mono-medium text-sm ${isToday ? "text-success" : "text-foreground"}`}
        >
          {dayNum}
        </Text>
        <Text className="text-muted text-xs">{weekday}</Text>
      </View>

      <CurrencyText value={dayBalance.endBalance} variant="small" />
    </Pressable>
  );
}
