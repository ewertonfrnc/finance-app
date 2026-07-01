import { useRouter } from "expo-router";
import { SearchField } from "heroui-native";
import { ArrowLeft, Check, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { TagFlag } from "@/src/features/tags/components/TagFlag";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { colorsForScheme } from "@/src/lib/designTokens";
import { useDateStore } from "@/src/stores/useDateStore";
import { useTagPickerStore } from "@/src/stores/useTagPickerStore";

export default function TagPickScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);

  const { pendingTagIds, set } = useTagPickerStore();
  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);

  const trimmed = search.trim();
  const filteredTags = trimmed
    ? tags.filter((t) => t.name.toLowerCase().includes(trimmed.toLowerCase()))
    : tags;

  function toggleTag(id: string) {
    if (pendingTagIds.includes(id)) {
      set(pendingTagIds.filter((t) => t !== id));
    } else {
      set([...pendingTagIds, id]);
    }
  }

  return (
    <Screen className="bg-background">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={c.text} />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          Escolher tag
        </Text>
        <Pressable
          onPress={() => router.push("/tags/form?mode=create")}
          hitSlop={8}
        >
          <Plus size={22} color={c.green} />
        </Pressable>
      </View>

      <SearchField value={search} onChange={setSearch} className="mx-4 mb-2">
        <SearchField.Group>
          <SearchField.SearchIcon iconProps={{ size: 14, color: c.mute }} />
          <SearchField.Input
            accessibilityLabel="Buscar tag"
            placeholder="Buscar tag..."
            autoCorrect={false}
          />
          <SearchField.ClearButton iconProps={{ size: 14, color: c.mute }} />
        </SearchField.Group>
      </SearchField>

      <Pressable
        onPress={() => set([])}
        className="flex-row items-center gap-3 px-4 py-3"
      >
        <View className="w-3 items-center">
          <View className="bg-surface-tertiary h-2 w-2 rounded-full" />
        </View>
        <Text className="text-foreground flex-1 text-sm">Sem tag</Text>
        {pendingTagIds.length === 0 && <Check size={16} color={c.green} />}
      </Pressable>

      <View className="bg-separator mx-4 mb-1 h-px" />

      <FlatList
        data={filteredTags}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const selected = pendingTagIds.includes(item.id);
          return (
            <Pressable
              onPress={() => toggleTag(item.id)}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <TagFlag color={item.color} />
              <Text className="text-foreground flex-1 text-sm font-medium">
                {item.name}
              </Text>
              {selected && <Check size={16} color={c.green} />}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => (
          <View className="bg-separator mx-4 h-px" />
        )}
        ListEmptyComponent={
          <Text className="text-muted px-4 py-4 text-sm">
            Nenhuma tag com esse nome.
          </Text>
        }
      />
    </Screen>
  );
}
