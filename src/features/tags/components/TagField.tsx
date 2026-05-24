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
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#9ca3af";
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
    <View className="gap-2">
      <View className="gap-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-muted text-xs font-semibold tracking-widest">
            TAG
          </Text>
          <Text className="text-muted text-[10px]">opcional</Text>
        </View>

        <Pressable
          onPress={openPicker}
          className="flex-row items-center gap-2"
        >
          <View className="flex-1 flex-row flex-wrap gap-1">
            {selectedTags.length === 0 ? (
              <Text className="text-muted text-sm">Sem tag</Text>
            ) : (
              selectedTags.map((t) => (
                <View
                  key={t.id}
                  style={{ backgroundColor: t.color + "33" }}
                  className="flex-row items-center gap-1 rounded-full px-2 py-0.5"
                >
                  <View
                    style={{ backgroundColor: t.color }}
                    className="h-1.5 w-1.5 rounded-full"
                  />
                  <Text className="text-foreground text-[10px] font-medium">
                    {t.name}
                  </Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleTag(t.id);
                    }}
                    hitSlop={4}
                  >
                    <X size={10} color={mutedColor} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
          <ChevronRight size={16} color={mutedColor} />
        </Pressable>
      </View>

      {frequentes.length > 0 && (
        <View className="gap-2">
          <Text className="text-muted text-[10px] font-semibold tracking-widest">
            FREQUENTES
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-2">
              {frequentes.map((t) => {
                const selected = selectedTagIds.includes(t.id);
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => toggleTag(t.id)}
                    style={{
                      backgroundColor: t.color + (selected ? "55" : "22"),
                      borderWidth: selected ? 1.5 : 1,
                      borderColor: selected ? t.color : t.color + "44",
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
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
