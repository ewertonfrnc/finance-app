import { format, parseISO } from "date-fns";
import { Pressable, Text, View } from "react-native";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { formatWeekday } from "@/src/lib/date";
import { CurrencyText } from "../ui/CurrencyText";

interface DayRowProps {
  dayBalance: DayBalance;
  filter: TransactionType | null;
  peak: number;
  onPress: () => void;
}

const CATEGORIES: { type: TransactionType; label: string }[] = [
  { type: "entrada", label: "Entradas" },
  { type: "saida", label: "Saídas" },
  { type: "diario", label: "Diários" },
  { type: "economia", label: "Economia" },
];

const TODAY = format(new Date(), "yyyy-MM-dd");

function getBalanceColor(balance: number, peak: number): string {
  if (balance <= 0) return "text-danger";
  if (peak <= 0) return "text-foreground";
  const ratio = balance / peak;
  if (ratio >= 0.5) return "text-success";
  if (ratio >= 0.25) return "text-yellow-400";
  return "text-danger";
}

export function DayRow({ dayBalance, filter, peak, onPress }: DayRowProps) {
  const isToday = dayBalance.date === TODAY;
  const isFuture = dayBalance.date > TODAY;
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

  const balanceColor = getBalanceColor(dayBalance.endBalance, peak);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-lg px-4 py-3"
    >
      <View className="w-8 items-center">
        <Text
          className={`font-mono-medium text-sm ${isToday ? "text-success" : "text-foreground"}`}
        >
          {dayNum}
        </Text>
        <Text className="text-muted text-xs">{weekday}</Text>
      </View>

      <View className="flex-1 gap-1">
        {visibleLines.length > 0 ? (
          visibleLines.map((cat) => {
            const compact = isFuture && visibleLines.length === 1;
            return (
              <View key={cat.type} className="flex-row items-center">
                <View className="flex-1">
                  {!compact && (
                    <Text className="text-muted text-sm">{cat.label}</Text>
                  )}
                </View>
                <CurrencyText
                  value={amounts[cat.type]}
                  variant="small"
                  sign="neutral"
                />
              </View>
            );
          })
        ) : (
          <View className="flex-row items-center justify-between opacity-35">
            <Text className="text-muted text-xs">Sem lançamento</Text>
            <CurrencyText value={0} variant="small" sign="neutral" />
          </View>
        )}
      </View>

      <CurrencyText
        value={dayBalance.endBalance}
        variant="small"
        sign="neutral"
        className={balanceColor}
      />
    </Pressable>
  );
}
