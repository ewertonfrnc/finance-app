import { useRouter } from "expo-router";
import { ChevronRight, X } from "lucide-react-native";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { colorsForScheme } from "@/src/lib/designTokens";
import { useDateStore } from "@/src/stores/useDateStore";
import { useTagPickerStore } from "@/src/stores/useTagPickerStore";
import { useTags } from "../hooks/useTags";

interface TagFieldProps {
  selectedTagIds: string[];
  onChangeTagIds: (tagIds: string[]) => void;
}

const FREQUENTES_COUNT = 4;

export function TagField({ selectedTagIds, onChangeTagIds }: TagFieldProps) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const router = useRouter();

  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);

  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));
  const frequentes = useMemo(
    () =>
      [...tags]
        .sort((a, b) => b.transactionCount - a.transactionCount)
        .slice(0, FREQUENTES_COUNT),
    [tags],
  );

  function toggleTag(id: string) {
    if (selectedTagIds.includes(id)) {
      onChangeTagIds(selectedTagIds.filter((t) => t !== id));
    } else {
      onChangeTagIds([...selectedTagIds, id]);
    }
  }

  function openPicker() {
    useTagPickerStore.getState().set(selectedTagIds);
    router.push("/tags/pick");
  }

  return (
    <View className="gap-3">
      <View className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted text-xs font-semibold tracking-widest">
            TAG
          </Text>
          <Text className="text-muted text-[10px]">opcional</Text>
        </View>

        <Pressable
          onPress={openPicker}
          className="border-surface-tertiary min-h-8 flex-row items-center gap-2 border-b-2 pb-2"
        >
          <View className="min-h-7 flex-1 flex-row flex-wrap items-center gap-1">
            {selectedTags.length === 0 ? (
              <View className="min-h-7 justify-center">
                <Text className="text-muted text-sm">Sem tag</Text>
              </View>
            ) : (
              selectedTags.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleTag(t.id);
                  }}
                  hitSlop={4}
                  style={{
                    backgroundColor: t.color + "33",
                    borderColor: t.color + "44",
                    borderWidth: 1,
                  }}
                  className="min-h-7 flex-row items-center gap-1 rounded-full px-2 py-0.5"
                >
                  <View
                    style={{ backgroundColor: t.color }}
                    className="h-1.5 w-1.5 rounded-full"
                  />
                  <Text className="text-foreground text-[10px] font-medium">
                    {t.name}
                  </Text>
                  <X size={10} color={c.mute} />
                </Pressable>
              ))
            )}
          </View>
          <ChevronRight size={16} color={c.mute} />
        </Pressable>
      </View>

      {frequentes.length > 0 && (
        <View className="gap-1.5">
          <Text className="text-muted text-[10px] font-semibold tracking-widest">
            FREQUENTES
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-row items-center gap-2 pr-4"
          >
            {frequentes.map((t) => {
              const selected = selectedTagIds.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => toggleTag(t.id)}
                  style={{
                    backgroundColor: c.bg,
                    borderWidth: 1,
                    borderColor: selected ? t.color : c.hair,
                  }}
                  className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
                >
                  <View
                    style={{ backgroundColor: t.color }}
                    className="h-1.5 w-1.5 rounded-full"
                  />
                  <Text className="text-foreground text-xs font-medium">
                    {t.name}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable onPress={openPicker} hitSlop={8}>
              <Text className="text-muted text-xs">Ver todas</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
