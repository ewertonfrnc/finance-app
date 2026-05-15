import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, Text, View } from "react-native";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { Separator } from "heroui-native";
import { DayRow } from "./DayRow";

export const DAY_FILTER_OPTIONS: {
  label: string;
  value: TransactionType | null;
}[] = [
  { label: "Todas", value: null },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
  { label: "Diários", value: "diario" },
  { label: "Economia", value: "economia" },
];

interface DayListProps {
  days: DayBalance[];
  filter: TransactionType | null;
  onDayPress: (date: string) => void;
}

const TODAY = format(new Date(), "yyyy-MM-dd");

export function DayList({ days, filter, onDayPress }: DayListProps) {
  const listRef = useRef<FlatList<DayBalance>>(null);

  const peak = useMemo(
    () => days.reduce((max, d) => Math.max(max, d.endBalance), 0),
    [days],
  );

  useEffect(() => {
    const idx = days.findIndex((d) => d.date === TODAY);
    if (idx <= 0) return;
    const id = requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: idx, animated: false, viewPosition: 0.3 });
    });
    return () => cancelAnimationFrame(id);
  }, [days]);

  const renderItem = useCallback(
    ({ item }: { item: DayBalance }) => (
      <DayRow
        dayBalance={item}
        filter={filter}
        peak={peak}
        onPress={() => onDayPress(item.date)}
      />
    ),
    [onDayPress, filter, peak],
  );

  return (
    <View className="flex-1">
      <View className="border-surface-secondary flex-row items-center border-b px-4 py-2">
        <Text className="text-muted w-8 text-center text-xs">DIA</Text>
        <View className="flex-1" />
        <Text className="text-muted text-xs">SALDO</Text>
      </View>

      <FlatList
        ref={listRef}
        data={days}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator variant="thin" />}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          });
        }}
      />
    </View>
  );
}
