import { useRouter } from "expo-router";
import { ChevronDown, ChevronRight, Plus, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { TagFlag } from "@/src/features/tags/components/TagFlag";
import { TagFormModal } from "@/src/features/tags/components/TagFormModal";
import { useTags } from "@/src/features/tags/hooks/useTags";
import type { TagWithTotal } from "@/src/features/tags/types";
import { colorsForScheme, DS_SHADOWS } from "@/src/lib/designTokens";
import { formatMonthHeader } from "@/src/lib/date";
import { useDateStore } from "@/src/stores/useDateStore";

interface TagsSummaryCardProps {
  tagCount: number;
  transactionCount: number;
  totalMarked: number;
  monthLabel: string;
  onCreatePress: () => void;
}

function TagsSummaryCard({
  tagCount,
  transactionCount,
  totalMarked,
  monthLabel,
  onCreatePress,
}: TagsSummaryCardProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View
      className="rounded-card-lg border-separator bg-surface border px-5 py-5"
      style={[
        DS_SHADOWS.summary,
        {
          borderColor: colors.hair,
        },
      ]}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1 pt-1">
          <Text className="text-ds-green text-label font-bold tracking-[2px]">
            TOTAL MARCADO
          </Text>
          <Text className="text-muted text-body-small mt-1 font-medium">
            em {monthLabel}
          </Text>
        </View>

        <CurrencyText
          value={totalMarked}
          sign="neutral"
          variant="large"
          className="text-ds-green shrink text-right"
          adjustsFontSizeToFit
          numberOfLines={1}
        />
      </View>

      <View className="bg-separator my-5 h-px" />

      <View className="flex-row items-center gap-4">
        <Text className="text-muted text-body-small flex-1 font-bold">
          {tagCount} {tagCount === 1 ? "tag" : "tags"}
        </Text>
        <Text className="text-muted text-body-small font-bold">
          {transactionCount}{" "}
          {transactionCount === 1 ? "lançamento" : "lançamentos"}
        </Text>
        <Pressable
          onPress={onCreatePress}
          accessibilityRole="button"
          accessibilityLabel="Adicionar tag"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="bg-accent h-8 w-8 items-center justify-center rounded-full"
        >
          <Plus size={18} color={colors.bg} strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

interface TagsSearchInputProps {
  value: string;
  iconColor: string;
  onChangeText: (value: string) => void;
}

function TagsSearchInput({
  value,
  iconColor,
  onChangeText,
}: TagsSearchInputProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View
      className="rounded-control border-separator bg-background flex-row items-center gap-3 border px-4"
      style={{ borderColor: colors.hair }}
    >
      <Search size={18} color={iconColor} />
      <TextInput
        className="text-foreground text-transaction flex-1 py-3.5"
        placeholder="Filtrar tags"
        placeholderTextColor={iconColor}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

interface TagsListHeaderProps {
  count: number;
  iconColor: string;
}

function TagsListHeader({ count, iconColor }: TagsListHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-1">
      <View className="flex-row items-baseline gap-3">
        <Text className="text-muted text-label font-bold tracking-[2px]">
          TODAS
        </Text>
        <Text className="text-faint text-body-small font-bold">{count}</Text>
      </View>

      <View className="flex-row items-center gap-1">
        <Text className="text-faint text-label font-bold tracking-[1px]">
          Valor
        </Text>
        <ChevronDown size={14} color={iconColor} />
      </View>
    </View>
  );
}

interface TagRowProps {
  tag: TagWithTotal;
  isLast: boolean;
  onPress: () => void;
  iconColor: string;
}

function TagRow({ tag, isLast, onPress, iconColor }: TagRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-4 px-5 py-4 ${
        isLast ? "" : "border-separator border-b"
      }`}
    >
      <View className="w-7 items-center">
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
      <CurrencyText
        value={tag.monthlyTotal}
        sign="neutral"
        variant="regular"
        className="text-right"
        numberOfLines={1}
      />
      <ChevronRight size={18} color={iconColor} />
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
      <View className="min-h-56 items-center justify-center px-8">
        <Text className="text-muted text-center text-base">
          Nenhuma tag encontrada
        </Text>
      </View>
    );
  }

  return (
    <View className="min-h-80 items-center justify-center gap-4 px-8">
      <Text className="text-foreground text-sheet-title text-center font-bold">
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
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const router = useRouter();
  const scheme = useColorScheme();
  const iconColor = colorsForScheme(scheme).mute;
  const colors = colorsForScheme(scheme);
  const monthLabel = formatMonthHeader(selectedYear, selectedMonth);

  const summary = useMemo(
    () => ({
      tagCount: tags.length,
      totalMarked: tags.reduce((sum, tag) => sum + tag.monthlyTotal, 0),
      transactionCount: tags.reduce(
        (sum, tag) => sum + (tag.transactionCount ?? 0),
        0,
      ),
    }),
    [tags],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const ordered = [...tags].sort((a, b) => b.monthlyTotal - a.monthlyTotal);
    if (!q) return ordered;
    return ordered.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, search]);

  const showEmpty = filtered.length === 0 && !isLoading;

  function openCreate() {
    setFormMode("create");
  }

  return (
    <Screen className="bg-ds-surface">
      <MonthNavigator onCalendarPress={() => router.navigate("/")} />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 px-4 pb-24">
          <TagsSummaryCard
            tagCount={summary.tagCount}
            transactionCount={summary.transactionCount}
            totalMarked={summary.totalMarked}
            monthLabel={monthLabel}
            onCreatePress={openCreate}
          />

          <TagsSearchInput
            value={search}
            iconColor={iconColor}
            onChangeText={setSearch}
          />

          <TagsListHeader count={filtered.length} iconColor={iconColor} />

          {showEmpty ? (
            <EmptyState
              hasSearch={search.trim().length > 0}
              onCreatePress={openCreate}
            />
          ) : (
            <View
              className="rounded-card-lg border-separator bg-background mb-8 overflow-hidden border"
              style={{ borderColor: colors.hair }}
            >
              {filtered.map((item, index) => (
                <TagRow
                  key={item.id}
                  tag={item}
                  isLast={index === filtered.length - 1}
                  iconColor={iconColor}
                  onPress={() => router.push(`/tags/${item.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {formMode !== null && (
        <TagFormModal
          mode={formMode}
          currentCount={tags.length}
          onClose={() => setFormMode(null)}
        />
      )}
    </Screen>
  );
}
