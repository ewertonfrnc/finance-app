import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { TagFlag } from "@/src/features/tags/components/TagFlag";
import { TagFormModal } from "@/src/features/tags/components/TagFormModal";
import { getTagColors } from "@/src/features/tags/constants";
import { useTags } from "@/src/features/tags/hooks/useTags";
import type { TagWithTotal } from "@/src/features/tags/types";
import { colorsForScheme } from "@/src/lib/designTokens";
import { useDateStore } from "@/src/stores/useDateStore";
import { useFocusEffect, useRouter } from "expo-router";
import { SearchField, useToast } from "heroui-native";
import { ArrowUpDown, Plus } from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface TagRowProps {
  tag: TagWithTotal;
  maxMonthlyTotal: number;
  trackColor: string;
  scheme: ReturnType<typeof useColorScheme>;
  animationDelayMs: number;
  animationKey: number;
  onPress: (tagId: string) => void;
}

const TagRow = memo(function TagRow({
  tag,
  maxMonthlyTotal,
  trackColor,
  scheme,
  animationDelayMs,
  animationKey,
  onPress,
}: TagRowProps) {
  const tagColors = getTagColors(tag.color, scheme);
  const hasTotal = tag.monthlyTotal > 0 && maxMonthlyTotal > 0;
  const progress = hasTotal
    ? Math.max(8, Math.round((tag.monthlyTotal / maxMonthlyTotal) * 100))
    : 0;
  const fillProgress = useSharedValue(0);

  useEffect(() => {
    fillProgress.value = 0;

    if (hasTotal) {
      fillProgress.value = withDelay(
        animationDelayMs,
        withTiming(progress, { duration: 520 }),
      );
    }
  }, [animationDelayMs, animationKey, fillProgress, hasTotal, progress]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${fillProgress.value}%`,
  }));

  return (
    <Pressable
      onPress={() => onPress(tag.id)}
      className="flex-row items-center gap-3 px-4 py-3.5"
    >
      <View style={{ opacity: hasTotal ? 1 : 0.45 }}>
        <TagFlag color={tag.color} />
      </View>
      <View className="flex-1 gap-2">
        <Text
          className={`${hasTotal ? "text-foreground" : "text-muted"} text-transaction font-semibold`}
          numberOfLines={1}
        >
          {tag.name}
        </Text>
        <View
          style={{ backgroundColor: trackColor }}
          className="h-1 overflow-hidden rounded-full"
        >
          <Animated.View
            style={[
              { backgroundColor: tagColors.dot, opacity: hasTotal ? 1 : 0 },
              animatedBarStyle,
            ]}
            className="h-full rounded-full"
          />
        </View>
      </View>
      <CurrencyText
        value={tag.monthlyTotal}
        sign="neutral"
        variant="small"
        className={hasTotal ? "" : "text-muted"}
      />
    </Pressable>
  );
});

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
      <Text className="text-foreground text-sheet-title text-center font-bold">
        Organize seus lançamentos
      </Text>
      <Text className="text-muted text-center text-sm">
        Crie tags para agrupar e visualizar seus lançamentos por categoria.
      </Text>
      <Pressable
        className="bg-ds-canvas-bg mt-2 rounded-xl px-6 py-3"
        onPress={onCreatePress}
      >
        <Text className="text-foreground text-sm font-semibold">
          Criar minha primeira tag
        </Text>
      </Pressable>
    </View>
  );
}

export default function TagsScreen() {
  const { selectedYear, selectedMonth, goToCurrentMonth } = useDateStore();
  const { data: tags = [], isLoading } = useTags(selectedYear, selectedMonth);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [barAnimationKey, setBarAnimationKey] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);
  const iconColor = colors.mute;
  const accentColor = colors.green;

  const { visibleTags, firstUnusedIndex } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = q
      ? tags.filter((t) => t.name.toLowerCase().includes(q))
      : tags;

    const used = matches.filter((t) => t.monthlyTotal > 0);
    const unused = matches.filter((t) => t.monthlyTotal <= 0);

    return {
      visibleTags: [...used, ...unused],
      firstUnusedIndex: unused.length > 0 ? used.length : -1,
    };
  }, [tags, search]);
  const summary = useMemo(() => {
    let total = 0;
    let activeTags = 0;
    let maxMonthlyTotal = 0;
    let topTag: TagWithTotal | null = null;

    for (const tag of tags) {
      total += tag.monthlyTotal;
      if (tag.monthlyTotal <= 0) continue;
      activeTags += 1;
      if (tag.monthlyTotal > maxMonthlyTotal)
        maxMonthlyTotal = tag.monthlyTotal;
      if (topTag === null || tag.monthlyTotal > topTag.monthlyTotal)
        topTag = tag;
    }

    return { activeTags, maxMonthlyTotal, topTag, total };
  }, [tags]);

  const showEmpty = visibleTags.length === 0 && !isLoading;

  useFocusEffect(
    useCallback(() => {
      setBarAnimationKey((current) => current + 1);
    }, []),
  );

  function handleSortPress() {
    toast.show({
      placement: "top",
      duration: 3500,
      label: "Em breve",
      description: "A ordenacao de tags sera adicionada em breve.",
    });
  }

  function openCreate() {
    setFormMode("create");
  }

  const handleOpenTag = useCallback(
    (tagId: string) => router.push(`/tags/${tagId}`),
    [router],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: TagWithTotal; index: number }) => (
      <>
        {index === firstUnusedIndex ? (
          <View className="px-4 pt-4 pb-1">
            <Text className="text-muted text-label font-semibold tracking-widest">
              SEM USO NESTE MÊS
            </Text>
          </View>
        ) : null}
        <TagRow
          tag={item}
          maxMonthlyTotal={summary.maxMonthlyTotal}
          trackColor={colors.hair}
          scheme={scheme}
          animationDelayMs={Math.min(index * 24, 180)}
          animationKey={barAnimationKey}
          onPress={handleOpenTag}
        />
      </>
    ),
    [
      firstUnusedIndex,
      summary.maxMonthlyTotal,
      colors.hair,
      scheme,
      barAnimationKey,
      handleOpenTag,
    ],
  );

  return (
    <Screen className="bg-background">
      <MonthNavigator onCalendarPress={goToCurrentMonth} />

      <View className="gap-3 px-4 pb-2">
        <View className="flex-row items-center justify-between pt-1">
          <View className="flex-row items-baseline gap-2">
            <Text className="text-foreground text-label font-semibold tracking-[2px]">
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
              <Plus size={18} color={accentColor} />
            </Pressable>
            <Pressable
              onPress={handleSortPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowUpDown size={18} color={iconColor} />
            </Pressable>
          </View>
        </View>

        <View
          style={{ backgroundColor: colors.surface, borderColor: colors.hair }}
          className="rounded-2xl border px-4 py-4"
        >
          <Text className="text-muted text-label font-semibold tracking-widest">
            CATEGORIZADO NO MÊS
          </Text>
          <View className="mt-3 flex-row items-end justify-between gap-5">
            <View className="flex-1">
              <CurrencyText
                value={summary.total}
                sign="neutral"
                variant="large"
                className="text-foreground"
              />
              <Text className="text-muted mt-2 text-xs">
                {summary.activeTags === 1
                  ? "1 tag com movimento"
                  : `${summary.activeTags} tags com movimento`}
              </Text>
            </View>

            <View className="min-w-28 items-end pb-0.5">
              <Text className="text-muted text-label font-semibold tracking-widest">
                TOP TAG
              </Text>
              <Text
                className="text-foreground mt-2 max-w-32 text-right text-sm font-semibold"
                numberOfLines={1}
              >
                {summary.topTag?.name ?? "Sem uso"}
              </Text>
              {summary.topTag ? (
                <CurrencyText
                  value={summary.topTag.monthlyTotal}
                  sign="neutral"
                  variant="small"
                  className="mt-0.5"
                />
              ) : null}
            </View>
          </View>
        </View>

        <SearchField value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon iconProps={{ color: iconColor }} />
            <SearchField.Input
              placeholder="Filtrar tags"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <SearchField.ClearButton iconProps={{ color: iconColor }} />
          </SearchField.Group>
        </SearchField>
      </View>

      {showEmpty ? (
        <EmptyState
          hasSearch={search.trim().length > 0}
          onCreatePress={openCreate}
        />
      ) : (
        <FlatList
          data={visibleTags}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View className="bg-separator mx-4 h-px" />
          )}
          contentContainerClassName="pb-28"
        />
      )}

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
