import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { DayRow } from "./DayRow";
import { Separator } from "heroui-native";

interface DayListProps {
  days: DayBalance[];
  onDayPress: (date: string) => void;
}

const FILTER_OPTIONS: { label: string; value: TransactionType | null }[] = [
  { label: "Todas", value: null },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
  { label: "Diários", value: "diario" },
  { label: "Economia", value: "economia" },
];

export function DayList({ days, onDayPress }: DayListProps) {
  const [filterIndex, setFilterIndex] = useState(0);
  const filter = FILTER_OPTIONS[filterIndex];

  const peak = days.length > 0 ? Math.max(...days.map((d) => d.endBalance)) : 0;

  const cycleFilter = useCallback(() => {
    setFilterIndex((i) => (i + 1) % FILTER_OPTIONS.length);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: DayBalance }) => (
      <DayRow
        dayBalance={item}
        filter={filter.value}
        peak={peak}
        onPress={() => onDayPress(item.date)}
      />
    ),
    [onDayPress, filter.value, peak],
  );

  return (
    <View className="flex-1">
      <View className="border-surface-secondary flex-row items-center border-b px-4 py-2">
        <Text className="text-muted w-8 text-center text-xs">DIA</Text>
        <View className="flex-1 items-center">
          <Pressable
            onPress={cycleFilter}
            className="border-border flex-row items-center gap-1 rounded-full border px-3 py-1"
          >
            <Text className="text-foreground text-xs font-medium">
              {filter.label}
            </Text>
            <Text className="text-muted text-xs">↓</Text>
          </Pressable>
        </View>
        <Text className="text-muted text-xs">SALDO</Text>
      </View>

      <FlatList
        data={days}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator variant="thin" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
