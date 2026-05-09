import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import type { DayBalance } from "@/src/features/transactions/types";
import { DayRow } from "./DayRow";

interface DayListProps {
  days: DayBalance[];
  selectedDate: string | null;
  onDayPress: (date: string) => void;
}

export function DayList({ days, selectedDate, onDayPress }: DayListProps) {
  const renderItem = useCallback(
    ({ item }: { item: DayBalance }) => (
      <DayRow
        dayBalance={item}
        isSelected={selectedDate === item.date}
        onPress={() => onDayPress(item.date)}
      />
    ),
    [selectedDate, onDayPress],
  );

  return (
    <FlatList
      data={days}
      keyExtractor={(item) => item.date}
      renderItem={renderItem}
      ItemSeparatorComponent={() => (
        <View
          style={{ height: StyleSheet.hairlineWidth }}
          className="bg-border mx-4"
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
