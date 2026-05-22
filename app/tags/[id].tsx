import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
} from "lucide-react-native";
import { FlatList, Pressable, Text, View, useColorScheme } from "react-native";

import { TransactionItem } from "@/src/components/transactions/TransactionItem";
import { Screen } from "@/src/components/ui/Screen";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { useTagTransactions } from "@/src/features/tags/hooks/useTagTransactions";
import { formatMonthHeader } from "@/src/lib/date";
import { useDateStore } from "@/src/stores/useDateStore";

export default function TagDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";
  const accentColor = scheme === "dark" ? "#5ab87a" : "#1e3d2b";

  const { selectedYear, selectedMonth, goToPrevMonth, goToNextMonth } =
    useDateStore();

  const { data: tags = [] } = useTags(selectedYear, selectedMonth);
  const { data: transactions = [] } = useTagTransactions(
    id,
    selectedYear,
    selectedMonth,
  );

  const tag = tags.find((t) => t.id === id);

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={20} color={mutedColor} />
        </Pressable>

        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={goToPrevMonth}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={20} color={mutedColor} />
          </Pressable>
          <Text className="text-foreground px-2 text-base font-semibold">
            {formatMonthHeader(selectedYear, selectedMonth)}
          </Text>
          <Pressable
            onPress={goToNextMonth}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronRight size={20} color={mutedColor} />
          </Pressable>
        </View>

        <Pressable
          onPress={() =>
            router.push({ pathname: "/transaction/new", params: { tagId: id } })
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Plus size={22} color={accentColor} strokeWidth={2.5} />
        </Pressable>
      </View>

      {tag && (
        <View
          style={{ backgroundColor: tag.color + "22" }}
          className="flex-row items-center gap-3 px-4 py-4"
        >
          <View
            style={{ backgroundColor: tag.color }}
            className="h-3 w-3 rounded-full"
          />
          <Text
            className="text-foreground flex-1 text-lg font-semibold"
            numberOfLines={1}
          >
            {tag.name}
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/tags/form",
                params: { mode: "edit", id },
              })
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Pencil size={18} color={mutedColor} />
          </Pressable>
        </View>
      )}

      <View className="bg-surface-secondary h-px" />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => router.push(`/transaction/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="bg-surface-secondary mx-4 h-px" />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Text className="text-muted text-center text-base">
              Nenhum lançamento com esta tag neste mês
            </Text>
          </View>
        )}
        contentContainerClassName="pb-8"
      />
    </Screen>
  );
}
