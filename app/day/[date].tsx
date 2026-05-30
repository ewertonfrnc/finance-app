import { format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useToast } from "heroui-native";

import { useHorizontalSwipe } from "@/src/components/gestures/useHorizontalSwipe";
import { DayNavigator } from "@/src/components/navigation/DayNavigator";
import { TransactionItem } from "@/src/components/transactions/TransactionItem";
import { Chip } from "@/src/components/ui/Chip";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { useBalanceQuery } from "@/src/features/saldos/hooks/useBalanceQuery";
import { useDayTransactions } from "@/src/features/transactions/hooks/useDayTransactions";
import type { TransactionType } from "@/src/features/transactions/types";
import { formatDayHeader, nextDay, prevDay } from "@/src/lib/date";
import { transactionDetailHref } from "@/src/lib/transactionHref";

const TODAY = format(new Date(), "yyyy-MM-dd");

const PROJECTION_CARD_COLORS = {
  light: { bg: "#dbf4e7", title: "#185b43", badge: "#b8ecd4", badgeText: "#114d36", bullet: "#2d6b4e" },
  dark:  { bg: "#1a3f31", title: "#a6efca", badge: "#214f3c", badgeText: "#baf5d7", bullet: "#7edcb0" },
} as const;

function DailyProjectionCard({ date, amount, onAdjustPress }: {
  date: string;
  amount: number;
  onAdjustPress: () => void;
}) {
  const scheme = useColorScheme();
  const c = PROJECTION_CARD_COLORS[scheme === "dark" ? "dark" : "light"];
  const dayLabel = format(parseISO(date), "dd/MM");

  return (
    <View style={{ backgroundColor: c.bg }} className="mx-4 mb-2 mt-3 rounded-xl px-4 py-3 gap-2">
      <View className="flex-row items-center gap-2">
        <Text style={{ color: c.title }} className="flex-1 font-medium text-sm">
          Diário previsto
        </Text>
        <View style={{ backgroundColor: c.badge }} className="rounded px-1.5 py-0.5">
          <Text style={{ color: c.badgeText }} className="text-xs font-medium tracking-wide">
            PREVISÃO
          </Text>
        </View>
        <CurrencyText value={amount} variant="small" sign="negative" style={{ color: c.title }} />
      </View>

      <View className="gap-1.5">
        <View className="flex-row gap-1.5">
          <Text style={{ color: c.bullet }} className="text-xs leading-5">•</Text>
          <Text style={{ color: c.bullet }} className="flex-1 text-xs leading-5">
            No dia <Text className="font-semibold">{dayLabel}</Text> será descontado este previsto{" "}
            <Text className="font-semibold">somado</Text> ao que você lançar.
          </Text>
        </View>
        <View className="flex-row gap-1.5">
          <Text style={{ color: c.bullet }} className="text-xs leading-5">•</Text>
          <Text style={{ color: c.bullet }} className="flex-1 text-xs leading-5">
            Quando o dia chegar, o previsto{" "}
            <Text className="font-semibold">zera à meia-noite</Text> — fica só o que foi lançado.
          </Text>
        </View>
        <View className="flex-row gap-1.5">
          <Text style={{ color: c.bullet }} className="text-xs leading-5">•</Text>
          <Text style={{ color: c.bullet }} className="flex-1 text-xs leading-5">
            Vem da sua previsão mensal de diários.{" "}
            <Pressable onPress={onAdjustPress} hitSlop={8}>
              <Text style={{ color: c.title }} className="text-xs font-semibold underline">
                Toque para ajustar.
              </Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </View>
  );
}

const FILTER_OPTIONS: { label: string; value: TransactionType | null }[] = [
  { label: "Todas", value: null },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
  { label: "Diários", value: "diario" },
  { label: "Economia", value: "economia" },
];

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<TransactionType | null>(
    null,
  );
  const filterScrollGesture = Gesture.Native();

  const [year, month, day] = date.split("-").map(Number);

  const prevDate = prevDay(date);
  const nextDate = nextDay(date);
  const [prevYear, prevMonth] = prevDate.split("-").map(Number);
  const [nextYear, nextMonth] = nextDate.split("-").map(Number);

  const { data: transactions = [] } = useDayTransactions(year, month, day);
  const { data: prevMonthBalance = [] } = useBalanceQuery(prevYear, prevMonth);
  const { data: currMonthBalance = [] } = useBalanceQuery(year, month);
  const { data: nextMonthBalance = [] } = useBalanceQuery(nextYear, nextMonth);

  const isFuture = date > TODAY;
  const dayBalance = currMonthBalance.find((d) => d.date === date);
  const projectedDaily = dayBalance?.dailyProjected ?? 0;

  const yesterdayBalance =
    prevMonthBalance.find((d) => d.date === prevDate)?.endBalance ?? null;
  const todayBalance = dayBalance?.endBalance ?? null;
  const tomorrowBalance =
    nextMonthBalance.find((d) => d.date === nextDate)?.endBalance ?? null;

  const filtered = useMemo(
    () =>
      selectedType
        ? transactions.filter((tx) => tx.type === selectedType)
        : transactions,
    [transactions, selectedType],
  );

  const income = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "entrada")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions],
  );

  const expenses = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type !== "entrada")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions],
  );

  const net = income - expenses;

  const {
    animatedContentStyle,
    isTransitioning,
    pointerEvents,
    startTransition,
    swipeGesture,
  } = useHorizontalSwipe({
    resetKey: date,
    onSwipePrev: () => router.replace(`/day/${prevDate}`),
    onSwipeNext: () => router.replace(`/day/${nextDate}`),
    externalGestureToFail: filterScrollGesture,
  });

  function navigateToDay(
    targetDate: string,
    direction: "prev" | "next",
  ) {
    startTransition(() => router.replace(`/day/${targetDate}`), direction);
  }

  function goBack() {
    if (isTransitioning) return;
    router.back();
  }

  function goToPrevDay() {
    navigateToDay(prevDate, "prev");
  }

  function goToNextDay() {
    navigateToDay(nextDate, "next");
  }

  function openNewTransaction() {
    if (isTransitioning) return;
    router.push({ pathname: "/transaction/new", params: { date } });
  }

  return (
    <Screen>
      <DayNavigator
        date={date}
        onBack={goBack}
        onPrev={goToPrevDay}
        onNext={goToNextDay}
        onAdd={openNewTransaction}
      />

      {/* Saldo fim do dia */}
      <View className="flex-row justify-between px-4 py-4">
        <View className="items-center">
          <Text className="text-muted mb-1 text-xs">
            Ontem · {formatDayHeader(prevDate)}
          </Text>
          {yesterdayBalance !== null ? (
            <CurrencyText value={yesterdayBalance} variant="small" />
          ) : (
            <Text className="text-muted font-mono text-sm">—</Text>
          )}
        </View>

        <View className="items-center">
          <Text className="text-muted mb-1 text-xs tracking-widest uppercase">
            Saldo · Fim do dia
          </Text>
          {todayBalance !== null ? (
            <CurrencyText value={todayBalance} variant="large" />
          ) : (
            <Text className="text-muted font-mono-medium text-2xl">—</Text>
          )}
        </View>

        <View className="items-center">
          <Text className="text-muted mb-1 text-xs">
            Amanhã · {formatDayHeader(nextDate)}
          </Text>
          {tomorrowBalance !== null ? (
            <CurrencyText value={tomorrowBalance} variant="small" />
          ) : (
            <Text className="text-muted font-mono text-sm">—</Text>
          )}
        </View>
      </View>

      <View className="bg-surface-secondary mx-4 h-px" />

      {/* Resumo de fluxo */}
      <View className="flex-row px-4 py-4">
        <View className="flex-1">
          <Text className="text-muted mb-1 text-xs">ENTRADAS</Text>
          <CurrencyText value={income} variant="small" sign="positive" />
        </View>
        <View className="flex-1 items-center">
          <Text className="text-muted mb-1 text-xs">SAÍDAS</Text>
          <CurrencyText value={expenses} variant="small" sign="negative" />
        </View>
        <View className="flex-1 items-end">
          <Text className="text-muted mb-1 text-xs">LÍQUIDO</Text>
          <CurrencyText value={net} variant="small" />
        </View>
      </View>

      <View className="bg-surface-secondary mx-4 h-px" />

      {/* Filtro */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        {/* Prioriza o scroll local dos chips para não disparar a troca de dia por engano. */}
        <GestureDetector gesture={filterScrollGesture}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {FILTER_OPTIONS.map((opt) => (
              <Chip
                key={opt.label}
                label={opt.label}
                selected={selectedType === opt.value}
                onPress={() => {
                  if (isTransitioning) return;
                  setSelectedType(opt.value);
                }}
              />
            ))}
          </ScrollView>
        </GestureDetector>
        <Text className="text-muted shrink-0 text-sm">
          {filtered.length} lançamento{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View className="bg-surface-secondary mx-4 h-px" />

      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          className="flex-1"
          style={animatedContentStyle}
          pointerEvents={pointerEvents}
        >
          {/* Lista */}
          <FlatList
            data={filtered}
            keyExtractor={(tx) => tx.occurrenceKey}
            ListHeaderComponent={
              isFuture && projectedDaily > 0 ? (
                <DailyProjectionCard
                  date={date}
                  amount={projectedDaily}
                  onAdjustPress={() => {
                    toast.show({
                      placement: "top",
                      duration: 3500,
                      label: "Em breve",
                      description: "A tela de ajuste do diário será adicionada em breve.",
                    });
                  }}
                />
              ) : null
            }
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                onPress={() => {
                  if (isTransitioning) return;
                  router.push(transactionDetailHref(item));
                }}
              />
            )}
            ItemSeparatorComponent={() => (
              <View className="bg-surface-secondary mx-4 h-px" />
            )}
            contentContainerClassName="pb-8"
          />
        </Animated.View>
      </GestureDetector>
    </Screen>
  );
}
