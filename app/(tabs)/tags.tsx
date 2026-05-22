import { useRouter } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { TagFormModal } from "@/src/features/tags/components/TagFormModal";
import { useTags } from "@/src/features/tags/hooks/useTags";
import type { TagWithTotal } from "@/src/features/tags/types";
import { useDateStore } from "@/src/stores/useDateStore";

interface TagRowProps {
  tag: TagWithTotal;
  onPress: () => void;
}

function TagRow({ tag, onPress }: TagRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3"
    >
      <View
        style={{ backgroundColor: tag.color }}
        className="h-3 w-3 rounded-full"
      />
      <View className="flex-1">
        <Text
          className="text-foreground text-base font-medium"
          numberOfLines={1}
        >
          {tag.name}
        </Text>
        <Text className="text-muted mt-0.5 text-xs">
          {tag.transactionCount} lançamento
          {tag.transactionCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <CurrencyText value={tag.monthlyTotal} sign="neutral" variant="small" />
    </Pressable>
  );
}

interface EmptyStateProps {
  hasSearch: boolean;
  onCreatePress: () => void;
}

function EmptyState({ hasSearch, onCreatePress }: EmptyStateProps) {
  if (hasSearch) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-muted text-center text-base">
          Nenhuma tag encontrada
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <Text className="text-foreground text-center text-lg font-semibold">
        Organize seus lançamentos
      </Text>
      <Text className="text-muted text-center text-sm">
        Crie tags para agrupar e visualizar seus lançamentos por categoria.
      </Text>
      <Pressable
        className="bg-foreground mt-2 rounded-xl px-6 py-3"
        onPress={onCreatePress}
      >
        <Text className="text-background text-sm font-semibold">
          Criar minha primeira tag
        </Text>
      </Pressable>
    </View>
  );
}

export default function TagsScreen() {
  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [], isLoading } = useTags(selectedYear, selectedMonth);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const iconColor = scheme === "dark" ? "#6b8c78" : "#7a9485";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, search]);

  const showEmpty = filtered.length === 0 && !isLoading;

  return (
    <Screen>
      <MonthNavigator />

      <View className="gap-2 px-4 pb-2">
        <View className="bg-surface-secondary flex-row items-center gap-2 rounded-xl px-3">
          <Search size={16} color={iconColor} />
          <TextInput
            className="text-foreground flex-1 py-2.5 text-sm"
            placeholder="Buscar tag..."
            placeholderTextColor={iconColor}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          <Pressable
            onPress={() => setShowCreate(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Plus size={18} color={iconColor} />
          </Pressable>
        </View>
      </View>

      {showEmpty ? (
        <EmptyState
          hasSearch={search.trim().length > 0}
          onCreatePress={() => setShowCreate(true)}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TagRow
              tag={item}
              onPress={() => router.push(`/tags/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View className="bg-surface-secondary mx-4 h-px" />
          )}
        />
      )}

      <TagFormModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        mode="create"
      />
    </Screen>
  );
}
