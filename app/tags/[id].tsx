import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
} from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, View, useColorScheme } from "react-native";

import { colorsForScheme } from "@/src/lib/designTokens";

import { TransactionItem } from "@/src/components/transactions/TransactionItem";
import { Screen } from "@/src/components/ui/Screen";
import { TagFormModal } from "@/src/features/tags/components/TagFormModal";
import { getTagColors } from "@/src/features/tags/constants";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { useTagTransactions } from "@/src/features/tags/hooks/useTagTransactions";
import { formatBRL } from "@/src/lib/currency";
import { formatMonthHeader } from "@/src/lib/date";
import { transactionDetailHref } from "@/src/lib/transactionHref";
import { useDateStore } from "@/src/stores/useDateStore";

export default function TagDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showEdit, setShowEdit] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const accentColor = c.green;

  const { selectedYear, selectedMonth, goToPrevMonth, goToNextMonth } =
    useDateStore();

  const { data: tags = [] } = useTags(selectedYear, selectedMonth);
  const { data: transactions = [] } = useTagTransactions(
    id,
    selectedYear,
    selectedMonth,
  );

  const tag = tags.find((t) => t.id === id);
  const tagColors = tag ? getTagColors(tag.color, scheme) : null;

  return (
    <Screen className="bg-background">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={20} color={c.text} />
        </Pressable>

        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={goToPrevMonth}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={20} color={c.text} />
          </Pressable>
          <Text className="text-foreground text-month px-2 font-semibold">
            {formatMonthHeader(selectedYear, selectedMonth)}
          </Text>
          <Pressable
            onPress={goToNextMonth}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronRight size={20} color={c.text} />
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
          style={{ borderLeftColor: tagColors?.dot }}
          className="bg-surface-secondary border-separator flex-row items-center gap-3 border-y border-l-4 px-4 py-4"
        >
          <View
            style={{ backgroundColor: tagColors?.dot }}
            className="h-3 w-3 rounded-full"
          />
          <View className="flex-1">
            <Text
              className="text-foreground text-sheet-title font-bold"
              numberOfLines={1}
            >
              {tag.name}
            </Text>
            <Text
              className="text-muted text-xs"
            >
              {transactions.length} lançamento
              {transactions.length !== 1 ? "s" : ""} ·{" "}
              {formatBRL(tag.monthlyTotal)}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowEdit(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Pencil size={18} color={accentColor} />
          </Pressable>
        </View>
      )}

      <View className="bg-separator h-px" />

      {showEdit && tag && (
        <TagFormModal
          mode="edit"
          tag={tag}
          currentCount={tags.length}
          onClose={() => setShowEdit(false)}
          onDelete={() => router.back()}
        />
      )}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.occurrenceKey}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => router.push(transactionDetailHref(item))}
            showDate
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="bg-separator mx-4 h-px" />
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
