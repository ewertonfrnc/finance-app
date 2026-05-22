import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, Search } from "lucide-react-native";

import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { Screen } from "@/src/components/ui/Screen";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { TagFormModal } from "@/src/features/tags/components/TagFormModal";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { useDateStore } from "@/src/stores/useDateStore";
import type { TagWithTotal } from "@/src/features/tags/types";

interface TagRowProps {
  tag: TagWithTotal;
  onPress: () => void;
}

function TagRow({ tag, onPress }: TagRowProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-3 gap-3">
      <View
        style={{ backgroundColor: tag.color }}
        className="w-3 h-3 rounded-full"
      />
      <View className="flex-1">
        <Text className="text-foreground text-base font-medium" numberOfLines={1}>
          {tag.name}
        </Text>
        <Text className="text-muted text-xs mt-0.5">
          {tag.transactionCount} lançamento{tag.transactionCount !== 1 ? "s" : ""}
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
        <Text className="text-muted text-base text-center">
          Nenhuma tag encontrada
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      <Text className="text-foreground text-lg font-semibold text-center">
        Organize seus lançamentos
      </Text>
      <Text className="text-muted text-sm text-center">
        Crie tags para agrupar e visualizar seus lançamentos por categoria.
      </Text>
      <Pressable
        className="bg-foreground rounded-xl px-6 py-3 mt-2"
        onPress={onCreatePress}
      >
        <Text className="text-background font-semibold text-sm">
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

      <View className="px-4 pb-2 gap-2">
        <View className="flex-row items-center bg-surface-secondary rounded-xl px-3 gap-2">
          <Search size={16} color={iconColor} />
          <TextInput
            className="flex-1 text-foreground py-2.5 text-sm"
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
            <View className="h-px bg-surface-secondary mx-4" />
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
