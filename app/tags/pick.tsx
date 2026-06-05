import { useRouter } from "expo-router";
import { ArrowLeft, Check, Plus, Search, Tag, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { TagFlag } from "@/src/features/tags/components/TagFlag";
import { TagFormModal } from "@/src/features/tags/components/TagFormModal";
import { useTags } from "@/src/features/tags/hooks/useTags";
import type { TagWithTotal } from "@/src/features/tags/types";
import { colorsForScheme, DS_SHADOWS } from "@/src/lib/designTokens";
import { useDateStore } from "@/src/stores/useDateStore";
import { useTagPickerStore } from "@/src/stores/useTagPickerStore";

interface HeaderProps {
  onBack: () => void;
}

function Header({ onBack }: HeaderProps) {
  return (
    <View className="bg-background border-separator flex-row items-center gap-4 border-b px-4 py-4">
      <Pressable onPress={onBack} hitSlop={8}>
        <ArrowLeft size={22} className="text-foreground" />
      </Pressable>

      <View className="min-w-0 flex-1">
        <Text className="text-foreground text-sheet-title font-bold">Tags</Text>
      </View>

      <Pressable onPress={onBack} hitSlop={8}>
        <Text className="text-ds-green text-base font-bold">Pronto</Text>
      </Pressable>
    </View>
  );
}

interface SelectionCardProps {
  selectedTags: TagWithTotal[];
  selectedCount: number;
  onCreatePress: () => void;
  onRemoveTag: (id: string) => void;
}

interface SelectedTagChipProps {
  tag: TagWithTotal;
  onPress: () => void;
}

function SelectedTagChip({ tag, onPress }: SelectedTagChipProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      style={{
        backgroundColor: `${tag.color}33`,
        borderColor: `${tag.color}44`,
        borderWidth: 1,
      }}
      className="min-h-7 max-w-full flex-row items-center gap-1 rounded-full px-2 py-0.5"
    >
      <View
        style={{ backgroundColor: tag.color }}
        className="h-1.5 w-1.5 rounded-full"
      />
      <Text
        className="text-foreground min-w-0 shrink text-xs font-bold"
        numberOfLines={1}
      >
        {tag.name}
      </Text>
      <X size={10} color={colors.mute} />
    </Pressable>
  );
}

function SelectionCard({
  selectedTags,
  selectedCount,
  onCreatePress,
  onRemoveTag,
}: SelectionCardProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View
      className="rounded-card-lg border-separator bg-background border px-5 py-5"
      style={[DS_SHADOWS.summary, { borderColor: colors.hair }]}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1 pt-1">
          <Text className="text-ds-green text-label font-bold tracking-[2px]">
            SELEÇÃO
          </Text>
          <Text className="text-muted text-body-small mt-1 font-medium">
            {selectedCount === 0
              ? "Nenhuma tag marcada"
              : `${selectedCount} ${
                  selectedCount === 1 ? "tag marcada" : "tags marcadas"
                }`}
          </Text>
        </View>

        <Pressable
          onPress={onCreatePress}
          accessibilityRole="button"
          accessibilityLabel="Adicionar tag"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="bg-accent h-9 w-9 items-center justify-center rounded-full"
        >
          <Plus size={19} color={colors.bg} strokeWidth={2.4} />
        </Pressable>
      </View>

      <View className="bg-separator my-5 h-px" />

      <View className="min-h-8 flex-row flex-wrap items-center gap-2">
        {selectedTags.length === 0 ? (
          <View className="bg-ds-green-tint rounded-full px-3 py-2">
            <Text className="text-ds-green text-body-small font-bold">
              Sem tag
            </Text>
          </View>
        ) : (
          selectedTags.map((tag) => (
            <SelectedTagChip
              key={tag.id}
              tag={tag}
              onPress={() => onRemoveTag(tag.id)}
            />
          ))
        )}
      </View>
    </View>
  );
}

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

function SearchInput({ value, onChangeText }: SearchInputProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View
      className="rounded-control border-separator bg-background flex-row items-center gap-3 border px-4"
      style={{ borderColor: colors.hair }}
    >
      <Search size={18} color={colors.mute} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Filtrar tags"
        placeholderTextColor={colors.mute}
        className="text-foreground text-transaction flex-1 py-3.5"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText("")} hitSlop={4}>
          <X size={16} color={colors.mute} />
        </Pressable>
      ) : null}
    </View>
  );
}

interface ListHeaderProps {
  count: number;
}

function ListHeader({ count }: ListHeaderProps) {
  return (
    <View className="flex-row items-baseline gap-3 px-1">
      <Text className="text-muted text-label font-bold tracking-[2px]">
        DISPONÍVEIS
      </Text>
      <Text className="text-faint text-body-small font-bold">{count}</Text>
    </View>
  );
}

interface EmptyStateProps {
  hasSearch: boolean;
  onCreatePress: () => void;
}

function EmptyState({ hasSearch, onCreatePress }: EmptyStateProps) {
  if (hasSearch) {
    return (
      <View className="min-h-52 items-center justify-center px-8">
        <Text className="text-muted text-center text-base">
          Nenhuma tag encontrada
        </Text>
      </View>
    );
  }

  return (
    <View className="min-h-72 items-center justify-center gap-4 px-8">
      <View className="bg-ds-green-tint rounded-control h-12 w-12 items-center justify-center">
        <Tag size={22} className="text-ds-green" />
      </View>
      <Text className="text-foreground text-sheet-title text-center font-bold">
        Organize este lançamento
      </Text>
      <Text className="text-muted text-center text-sm">
        Crie tags para agrupar seus lançamentos por contexto.
      </Text>
      <Pressable
        className="bg-foreground mt-1 rounded-xl px-6 py-3"
        onPress={onCreatePress}
      >
        <Text className="text-background text-sm font-semibold">Criar tag</Text>
      </Pressable>
    </View>
  );
}

interface TagRowProps {
  tag: TagWithTotal;
  selected: boolean;
  isLast: boolean;
  onPress: () => void;
}

function TagRow({ tag, selected, isLast, onPress }: TagRowProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <Pressable
      onPress={onPress}
      className={`min-h-16 flex-row items-center gap-3 px-4 py-2.5 ${
        isLast ? "" : "border-separator border-b"
      }`}
    >
      <View className="bg-surface rounded-control h-9 w-9 items-center justify-center">
        <TagFlag color={tag.color} />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="text-foreground text-input font-bold"
          numberOfLines={1}
        >
          {tag.name}
        </Text>
      </View>
      {selected ? (
        <View className="bg-ds-green h-7 w-7 items-center justify-center rounded-full">
          <Check size={16} color={colors.bg} strokeWidth={2.8} />
        </View>
      ) : (
        <View
          className="h-7 w-7 rounded-full border"
          style={{ borderColor: colors.hairStrong }}
        />
      )}
    </Pressable>
  );
}

interface NoTagRowProps {
  selected: boolean;
  isLast: boolean;
  onPress: () => void;
}

function NoTagRow({ selected, isLast, onPress }: NoTagRowProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <Pressable
      onPress={onPress}
      className={`min-h-16 flex-row items-center gap-3 px-4 py-2.5 ${
        isLast ? "" : "border-separator border-b"
      }`}
    >
      <View className="bg-surface rounded-control h-9 w-9 items-center justify-center">
        <View className="bg-surface-tertiary h-2.5 w-2.5 rounded-full" />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="text-foreground text-input font-bold"
          numberOfLines={1}
        >
          Sem tag
        </Text>
      </View>
      {selected ? (
        <View className="bg-ds-green h-7 w-7 items-center justify-center rounded-full">
          <Check size={16} color={colors.bg} strokeWidth={2.8} />
        </View>
      ) : null}
    </Pressable>
  );
}

export default function TagPickScreen() {
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"create" | null>(null);
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  const { pendingTagIds, set } = useTagPickerStore();
  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);

  const selectedTags = useMemo(
    () => tags.filter((tag) => pendingTagIds.includes(tag.id)),
    [tags, pendingTagIds],
  );

  const filteredTags = useMemo(() => {
    const q = search.trim().toLowerCase();
    const ordered = [...tags].sort(
      (a, b) => b.transactionCount - a.transactionCount,
    );
    if (!q) return ordered;
    return ordered.filter((tag) => tag.name.toLowerCase().includes(q));
  }, [tags, search]);

  function toggleTag(id: string) {
    if (pendingTagIds.includes(id)) {
      set(pendingTagIds.filter((tagId) => tagId !== id));
    } else {
      set([...pendingTagIds, id]);
    }
  }

  return (
    <Screen className="bg-ds-surface">
      <Header onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 px-4 pt-5 pb-10"
      >
        <SelectionCard
          selectedTags={selectedTags}
          selectedCount={pendingTagIds.length}
          onCreatePress={() => setFormMode("create")}
          onRemoveTag={toggleTag}
        />

        <SearchInput value={search} onChangeText={setSearch} />

        <ListHeader count={filteredTags.length} />

        {filteredTags.length === 0 ? (
          <EmptyState
            hasSearch={search.trim().length > 0}
            onCreatePress={() => setFormMode("create")}
          />
        ) : (
          <View
            className="rounded-card-lg border-separator bg-background mb-8 overflow-hidden border"
            style={{ borderColor: colors.hair }}
          >
            <NoTagRow
              selected={pendingTagIds.length === 0}
              isLast={filteredTags.length === 0}
              onPress={() => set([])}
            />
            {filteredTags.map((item, index) => (
              <TagRow
                key={item.id}
                tag={item}
                selected={pendingTagIds.includes(item.id)}
                isLast={index === filteredTags.length - 1}
                onPress={() => toggleTag(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {formMode !== null ? (
        <TagFormModal
          mode={formMode}
          currentCount={tags.length}
          onClose={() => setFormMode(null)}
        />
      ) : null}
    </Screen>
  );
}
