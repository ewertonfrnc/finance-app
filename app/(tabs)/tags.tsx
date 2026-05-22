import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { ArrowUpDown, Plus, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";

import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { useTags } from "@/src/features/tags/hooks/useTags";
import type { TagWithTotal } from "@/src/features/tags/types";
import { useDateStore } from "@/src/stores/useDateStore";

interface TagRowProps {
  tag: TagWithTotal;
  onPress: () => void;
}

function TagFlag({ color }: { color: string }) {
  // Flag/chevron shape: straight left, pointed right — mirrors CSS polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%)
  return (
    <Svg width={12} height={16} viewBox="0 0 12 16">
      <Polygon points="0,0 9.36,0 12,8 9.36,16 0,16" fill={color} />
    </Svg>
  );
}

function TagRow({ tag, onPress }: TagRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3"
    >
      <TagFlag color={tag.color} />
      <View className="flex-1">
        <Text className="text-foreground text-base" numberOfLines={1}>
          {tag.name}
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
  const router = useRouter();
  const { toast } = useToast();
  const scheme = useColorScheme();
  const iconColor = scheme === "dark" ? "#6b8c78" : "#7a9485";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, search]);

  const showEmpty = filtered.length === 0 && !isLoading;

  function handleSortPress() {
    toast.show({
      placement: "top",
      duration: 3500,
      label: "Em breve",
      description: "A ordenacao de tags sera adicionada em breve.",
    });
  }

  function openCreate() {
    router.push({ pathname: "/tags/form", params: { mode: "create" } });
  }

  return (
    <Screen>
      <MonthNavigator onCalendarPress={() => router.navigate("/")} />

      <View className="gap-2 px-4 pb-2">
        <View className="flex-row items-center justify-between pt-1">
          <View className="flex-row items-baseline gap-2">
            <Text className="text-foreground text-xs font-semibold tracking-[2px]">
              TAGS
            </Text>
            <Text className="text-muted text-sm font-medium">
              {tags.length}
            </Text>
          </View>

          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={openCreate}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Plus size={18} color={iconColor} />
            </Pressable>
            <Pressable
              onPress={handleSortPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowUpDown size={18} color={iconColor} />
            </Pressable>
          </View>
        </View>

        <View className="bg-surface-secondary flex-row items-center gap-2 rounded-xl px-3">
          <Search size={16} color={iconColor} />
          <TextInput
            className="text-foreground flex-1 py-2.5 text-sm"
            placeholder="Filtrar tags"
            placeholderTextColor={iconColor}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </View>

      {showEmpty ? (
        <EmptyState
          hasSearch={search.trim().length > 0}
          onCreatePress={openCreate}
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
    </Screen>
  );
}
