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

  // Re-anchora ao trocar de mês: dia atual quando o mês contém TODAY, topo caso contrário.
  // Refetches do mesmo mês mantêm o scroll do usuário porque monthKey não muda.
  const monthKey = days[0]?.date.slice(0, 7) ?? "";

  useEffect(() => {
    if (!monthKey) return;
    const idx = days.findIndex((d) => d.date === TODAY);
    const id = requestAnimationFrame(() => {
      if (idx > 0) {
        listRef.current?.scrollToIndex({
          index: idx,
          animated: true,
          viewPosition: 0.3,
        });
      } else {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

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
