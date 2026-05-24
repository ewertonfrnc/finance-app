import { format } from "date-fns";
import { useCallback, useEffect, useRef } from "react";
import { FlatList, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import type {
  DayBalance,
  TransactionType,
} from "@/src/features/transactions/types";
import { Separator } from "heroui-native";
import { DayRow } from "./DayRow";

interface DayListProps {
  days: DayBalance[];
  filter: TransactionType | null;
  onDayPress: (date: string) => void;
  onDayLongPress?: (date: string) => void;
  isFetching?: boolean;
}

const TODAY = format(new Date(), "yyyy-MM-dd");

function LoadingBar() {
  const { width } = useWindowDimensions();
  const barWidth = Math.round(width * 0.35);
  const tx = useSharedValue(-barWidth);

  useEffect(() => {
    tx.value = withRepeat(withTiming(width, { duration: 900 }), -1, false);
    return () => cancelAnimation(tx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  return (
    <View style={{ height: 2, overflow: "hidden" }}>
      <Animated.View
        className="bg-success h-full"
        style={[{ width: barWidth }, style]}
      />
    </View>
  );
}

export function DayList({
  days,
  filter,
  onDayPress,
  onDayLongPress,
  isFetching = false,
}: DayListProps) {
  const listRef = useRef<FlatList<DayBalance>>(null);
  const lastScrolledMonthKey = useRef<string>("");

  // Re-anchora ao trocar de mês: dia atual quando o mês contém TODAY, topo caso contrário.
  // Refetches do mesmo mês mantêm o scroll do usuário porque monthKey não muda.
  const monthKey = days[0]?.date.slice(0, 7) ?? "";

  useEffect(() => {
    if (!monthKey) return;
    if (lastScrolledMonthKey.current === monthKey) return;
    lastScrolledMonthKey.current = monthKey;

    const idx = days.findIndex((d) => d.date === TODAY);
    const id = requestAnimationFrame(() => {
      if (idx > 0) {
        listRef.current?.scrollToIndex({
          index: idx,
          animated: false,
          viewPosition: 0.3,
        });
      } else {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const renderItem = useCallback(
    ({ item }: { item: DayBalance }) => (
      <DayRow
        dayBalance={item}
        date={item.date}
        filter={filter}
        onPress={onDayPress}
        onLongPress={onDayLongPress}
      />
    ),
    [onDayPress, onDayLongPress, filter],
  );

  return (
    <View className="flex-1">
      <View className="border-surface-secondary flex-row items-center border-b px-4 py-2">
        <Text className="text-muted w-8 text-center text-xs">DIA</Text>
        <View className="flex-1" />
        <Text className="text-muted text-xs">SALDO</Text>
      </View>

      {isFetching && <LoadingBar />}

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
