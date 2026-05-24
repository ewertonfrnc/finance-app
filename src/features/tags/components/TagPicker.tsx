import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Check, ChevronRight, Plus, Search, X } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { useDateStore } from "@/src/stores/useDateStore";
import { useTags } from "../hooks/useTags";

interface TagPickerProps {
  selectedTagIds: string[];
  onChangeTagIds: (tagIds: string[]) => void;
}

const FREQUENTES_COUNT = 4;

export function TagPicker({ selectedTagIds, onChangeTagIds }: TagPickerProps) {
  const [search, setSearch] = useState("");
  const sheetRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#9ca3af";

  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);

  const snapPoints = useMemo(() => ["62%"], []);

  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));
  const frequentes = useMemo(
    () =>
      [...tags]
        .sort((a, b) => b.transactionCount - a.transactionCount)
        .slice(0, FREQUENTES_COUNT),
    [tags],
  );
  const filteredTags = search.trim()
    ? tags.filter((t) =>
        t.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : tags;

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  function openSheet() {
    sheetRef.current?.present();
  }

  function toggleTag(id: string) {
    if (selectedTagIds.includes(id)) {
      onChangeTagIds(selectedTagIds.filter((t) => t !== id));
    } else {
      onChangeTagIds([...selectedTagIds, id]);
    }
  }

  function clearTags() {
    onChangeTagIds([]);
    sheetRef.current?.dismiss();
    setSearch("");
  }

  function handleCreateNew() {
    sheetRef.current?.dismiss();
    setSearch("");
    router.push("/tags/form?mode=create");
  }

  return (
    <>
      {/* ── Field ── */}
      <View className="gap-2">
        {/* Label + value stacked */}
        <View className="gap-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-muted text-xs font-semibold tracking-widest">
              TAG
            </Text>
            <Text className="text-muted text-[10px]">opcional</Text>
          </View>

          <Pressable
            onPress={openSheet}
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

        {/* Frequentes */}
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
                <Pressable onPress={openSheet} hitSlop={8}>
                  <Text className="text-muted text-xs">Ver todas</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {/* ── Bottom sheet ── */}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        onDismiss={() => setSearch("")}
      >
        <BottomSheetView className="flex-1 pt-2 pb-6">
          <Text className="text-foreground mb-4 px-6 text-lg font-semibold">
            Escolher tag
          </Text>

          <View className="bg-surface-secondary mx-6 mb-3 flex-row items-center gap-2 rounded-xl px-3 py-2">
            <Search size={14} color={mutedColor} />
            <BottomSheetTextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar tag..."
              placeholderTextColor={mutedColor}
              className="text-foreground flex-1 text-sm"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={4}>
                <X size={14} color={mutedColor} />
              </Pressable>
            )}
          </View>

          <BottomSheetScrollView
            style={{ maxHeight: 240 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredTags.length === 0 ? (
              <Text className="text-muted px-6 py-4 text-sm">
                Nenhuma tag com esse nome.
              </Text>
            ) : (
              filteredTags.map((t) => {
                const selected = selectedTagIds.includes(t.id);
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => toggleTag(t.id)}
                    className="flex-row items-center gap-3 px-6 py-3"
                  >
                    <View
                      style={{ backgroundColor: t.color }}
                      className="h-2.5 w-2.5 rounded-full"
                    />
                    <Text className="text-foreground flex-1 text-sm font-medium">
                      {t.name}
                    </Text>
                    {selected && <Check size={16} color="#22c55e" />}
                  </Pressable>
                );
              })
            )}
          </BottomSheetScrollView>

          <View className="mt-4 flex-row items-center gap-3 border-t border-gray-100 px-6 pt-4">
            <Pressable
              onPress={clearTags}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-gray-200 py-3"
            >
              <Text className="text-foreground text-sm font-medium">
                Sem tag
              </Text>
              {selectedTagIds.length === 0 && (
                <Check size={14} color="#22c55e" />
              )}
            </Pressable>
            <Pressable
              onPress={handleCreateNew}
              className="bg-surface-secondary flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-3"
            >
              <Plus size={14} color={mutedColor} />
              <Text className="text-foreground text-sm font-medium">
                Criar nova
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
