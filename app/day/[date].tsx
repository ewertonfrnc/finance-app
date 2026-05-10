import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import { TransactionItem } from "@/src/components/transactions/TransactionItem";
import { Chip } from "@/src/components/ui/Chip";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { DayNavigator } from "@/src/components/navigation/DayNavigator";
import { useDayTransactions } from "@/src/features/transactions/hooks/useDayTransactions";
import type { TransactionType } from "@/src/features/transactions/types";
import { nextDay, prevDay } from "@/src/lib/date";

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
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null);

  const [year, month, day] = date.split("-").map(Number);
  const { data: transactions = [] } = useDayTransactions(year, month, day);

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
        onPrev={() => router.replace(`/day/${prevDay(date)}`)}
        onNext={() => router.replace(`/day/${nextDay(date)}`)}
        onAdd={() => router.push("/transaction/new")}
      />

      <View className="h-px bg-surface-secondary mx-4" />

      {/* Resumo de fluxo */}
      <View className="flex-row px-4 py-4">
        <View className="flex-1">
          <Text className="text-muted text-xs mb-1">ENTRADAS</Text>
          <CurrencyText value={income} variant="small" sign="positive" />
        </View>
        <View className="flex-1 items-center">
          <Text className="text-muted text-xs mb-1">SAÍDAS</Text>
          <CurrencyText value={expenses} variant="small" sign="negative" />
        </View>
        <View className="flex-1 items-end">
          <Text className="text-muted text-xs mb-1">LÍQUIDO</Text>
          <CurrencyText value={net} variant="small" />
        </View>
      </View>

      <View className="h-px bg-surface-secondary mx-4" />

      {/* Filtro */}
      <View className="flex-row items-center px-4 py-3 gap-3">
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
        <Text className="text-muted text-sm shrink-0">
          {filtered.length} lançamento{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View className="h-px bg-surface-secondary mx-4" />

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
          <View className="h-px bg-surface-secondary mx-4" />
        )}
        contentContainerClassName="pb-8"
      />
    </Screen>
  );
}
