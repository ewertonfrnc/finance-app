import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import { TransactionItem } from "@/src/components/transactions/TransactionItem";
import { Chip } from "@/src/components/ui/Chip";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { DayNavigator } from "@/src/components/navigation/DayNavigator";
import { useBalanceQuery } from "@/src/features/saldos/hooks/useBalanceQuery";
import { useDayTransactions } from "@/src/features/transactions/hooks/useDayTransactions";
import type { TransactionType } from "@/src/features/transactions/types";
import { formatDayHeader, nextDay, prevDay } from "@/src/lib/date";

const FILTER_OPTIONS: { label: string; value: TransactionType | null }[] = [
  { label: "Todas", value: null },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
  { label: "Diários", value: "diario" },
  { label: "Economia", value: "economia" },
];

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<TransactionType | null>(
    null,
  );

  const [year, month, day] = date.split("-").map(Number);

  const prevDate = prevDay(date);
  const nextDate = nextDay(date);
  const [prevYear, prevMonth] = prevDate.split("-").map(Number);
  const [nextYear, nextMonth] = nextDate.split("-").map(Number);

  const { data: transactions = [] } = useDayTransactions(year, month, day);
  const { data: prevMonthBalance = [] } = useBalanceQuery(prevYear, prevMonth);
  const { data: currMonthBalance = [] } = useBalanceQuery(year, month);
  const { data: nextMonthBalance = [] } = useBalanceQuery(nextYear, nextMonth);

  const yesterdayBalance =
    prevMonthBalance.find((d) => d.date === prevDate)?.endBalance ?? null;
  const todayBalance =
    currMonthBalance.find((d) => d.date === date)?.endBalance ?? null;
  const tomorrowBalance =
    nextMonthBalance.find((d) => d.date === nextDate)?.endBalance ?? null;

  const filtered = useMemo(
    () =>
      selectedType
        ? transactions.filter((tx) => tx.type === selectedType)
        : transactions,
    [transactions, selectedType],
  );

  const income = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "entrada")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions],
  );

  const expenses = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type !== "entrada")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions],
  );

  const net = income - expenses;

  return (
    <Screen>
      <DayNavigator
        date={date}
        onBack={() => router.back()}
        onPrev={() => router.replace(`/day/${prevDate}`)}
        onNext={() => router.replace(`/day/${nextDate}`)}
        onAdd={() => router.push(`/transaction/new?date=${date}`)}
      />

      {/* Saldo fim do dia */}
      <View className="flex-row justify-between px-4 py-4">
        <View className="items-center">
          <Text className="text-muted mb-1 text-xs">
            Ontem · {formatDayHeader(prevDate)}
          </Text>
          {yesterdayBalance !== null ? (
            <CurrencyText value={yesterdayBalance} variant="small" />
          ) : (
            <Text className="text-muted font-mono text-sm">—</Text>
          )}
        </View>

        <View className="items-center">
          <Text className="text-muted mb-1 text-xs tracking-widest uppercase">
            Saldo · Fim do dia
          </Text>
          {todayBalance !== null ? (
            <CurrencyText value={todayBalance} variant="large" />
          ) : (
            <Text className="text-muted font-mono-medium text-2xl">—</Text>
          )}
        </View>

        <View className="items-center">
          <Text className="text-muted mb-1 text-xs">
            Amanhã · {formatDayHeader(nextDate)}
          </Text>
          {tomorrowBalance !== null ? (
            <CurrencyText value={tomorrowBalance} variant="small" />
          ) : (
            <Text className="text-muted font-mono text-sm">—</Text>
          )}
        </View>
      </View>

      <View className="bg-surface-secondary mx-4 h-px" />

      {/* Resumo de fluxo */}
      <View className="flex-row px-4 py-4">
        <View className="flex-1">
          <Text className="text-muted mb-1 text-xs">ENTRADAS</Text>
          <CurrencyText value={income} variant="small" sign="positive" />
        </View>
        <View className="flex-1 items-center">
          <Text className="text-muted mb-1 text-xs">SAÍDAS</Text>
          <CurrencyText value={expenses} variant="small" sign="negative" />
        </View>
        <View className="flex-1 items-end">
          <Text className="text-muted mb-1 text-xs">LÍQUIDO</Text>
          <CurrencyText value={net} variant="small" />
        </View>
      </View>

      <View className="bg-surface-secondary mx-4 h-px" />

      {/* Filtro */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {FILTER_OPTIONS.map((opt) => (
            <Chip
              key={opt.label}
              label={opt.label}
              selected={selectedType === opt.value}
              onPress={() => setSelectedType(opt.value)}
            />
          ))}
        </ScrollView>
        <Text className="text-muted shrink-0 text-sm">
          {filtered.length} lançamento{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View className="bg-surface-secondary mx-4 h-px" />

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(tx) => tx.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => router.push(`/transaction/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="bg-surface-secondary mx-4 h-px" />
        )}
        contentContainerClassName="pb-8"
      />
    </Screen>
  );
}
