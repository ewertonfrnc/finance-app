import { format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Chip, Separator, useToast } from "heroui-native";
import { ListFilter, Plus, ReceiptText } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { useHorizontalSwipe } from "@/src/components/gestures/useHorizontalSwipe";
import { DayNavigator } from "@/src/components/navigation/DayNavigator";
import { TransactionItem } from "@/src/components/transactions/TransactionItem";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { useBalanceQuery } from "@/src/features/saldos/hooks/useBalanceQuery";
import { useDayTransactions } from "@/src/features/transactions/hooks/useDayTransactions";
import type { TransactionType } from "@/src/features/transactions/types";
import { formatBRL } from "@/src/lib/currency";
import { formatDayHeader, nextDay, prevDay } from "@/src/lib/date";
import { colorsForScheme } from "@/src/lib/designTokens";
import { TRANSACTION_TYPE_LABEL } from "@/src/lib/transactionTypeVisuals";
import { transactionDetailHref } from "@/src/lib/transactionHref";

const TODAY = format(new Date(), "yyyy-MM-dd");

function DailyProjectionCard({
  date,
  amount,
  onAdjustPress,
}: {
  date: string;
  amount: number;
  onAdjustPress: () => void;
}) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const dayLabel = format(parseISO(date), "dd/MM");

  return (
    <View
      style={{ backgroundColor: c.surface, borderColor: c.hair }}
      className="mx-4 mt-3 mb-2 gap-2 rounded-xl border px-4 py-3"
    >
      <View className="flex-row items-center gap-2">
        <Text
          style={{ color: c.green }}
          className="flex-1 text-sm font-semibold"
        >
          Diário previsto
        </Text>
        <View
          style={{
            backgroundColor: c.greenTint,
            borderWidth: 1,
            borderColor: c.hairStrong,
          }}
          className="rounded px-1.5 py-0.5"
        >
          <Text
            style={{ color: c.green }}
            className="text-xs font-semibold tracking-wide"
          >
            PREVISÃO
          </Text>
        </View>
        <CurrencyText
          value={amount}
          variant="small"
          sign="negative"
          style={{ color: c.green }}
        />
      </View>

      <View className="gap-1.5">
        <View className="flex-row gap-1.5">
          <Text style={{ color: c.green }} className="text-xs leading-5">
            •
          </Text>
          <Text style={{ color: c.green }} className="flex-1 text-xs leading-5">
            No dia <Text className="font-semibold">{dayLabel}</Text> será
            descontado este previsto{" "}
            <Text className="font-semibold">somado</Text> ao que você lançar.
          </Text>
        </View>
        <View className="flex-row gap-1.5">
          <Text style={{ color: c.green }} className="text-xs leading-5">
            •
          </Text>
          <Text style={{ color: c.green }} className="flex-1 text-xs leading-5">
            Quando o dia chegar, o previsto{" "}
            <Text className="font-semibold">zera à meia-noite</Text> — fica só o
            que foi lançado.
          </Text>
        </View>
        <View className="flex-row gap-1.5">
          <Text style={{ color: c.green }} className="text-xs leading-5">
            •
          </Text>
          <Text style={{ color: c.green }} className="flex-1 text-xs leading-5">
            Vem da sua previsão mensal de diários.{" "}
            <Pressable onPress={onAdjustPress} hitSlop={8}>
              <Text
                style={{ color: c.green }}
                className="text-xs font-semibold underline"
              >
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

function TransactionListHeader({
  date,
  filteredCount,
  totalCount,
  selectedType,
  isFuture,
  projectedDaily,
  onAdjustProjectionPress,
}: {
  date: string;
  filteredCount: number;
  totalCount: number;
  selectedType: TransactionType | null;
  isFuture: boolean;
  projectedDaily: number;
  onAdjustProjectionPress: () => void;
}) {
  const countLabel =
    selectedType === null ? `${totalCount}` : `${filteredCount}/${totalCount}`;

  return (
    <View>
      {isFuture && projectedDaily > 0 ? (
        <DailyProjectionCard
          date={date}
          amount={projectedDaily}
          onAdjustPress={onAdjustProjectionPress}
        />
      ) : null}

      <View className="flex-row items-baseline justify-between px-4 pt-4 pb-2">
        <Text className="text-muted text-label font-semibold tracking-[2px]">
          LANÇAMENTOS
        </Text>
        <Text className="text-muted text-body-small font-mono">
          {countLabel}
        </Text>
      </View>
    </View>
  );
}

function DayEmptyState({
  hasFilter,
  selectedType,
  onAddPress,
  onClearFilter,
}: {
  hasFilter: boolean;
  selectedType: TransactionType | null;
  onAddPress: () => void;
  onClearFilter: () => void;
}) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const title = hasFilter
    ? "Nada neste filtro"
    : "Nenhum lançamento neste dia";
  const description = hasFilter
    ? `${TRANSACTION_TYPE_LABEL[selectedType ?? "entrada"]} não apareceu nesse dia. Veja todos os lançamentos ou escolha outro tipo.`
    : "Quando você registrar uma entrada, saída, diário ou economia nessa data, ela aparece aqui.";
  const Icon = hasFilter ? ListFilter : ReceiptText;

  return (
    <View className="flex-1 items-center justify-center px-8 py-14">
      <View
        style={{ backgroundColor: c.surface, borderColor: c.hair }}
        className="mb-5 h-14 w-14 items-center justify-center rounded-2xl border"
      >
        <Icon size={24} color={c.green} strokeWidth={2.2} />
      </View>

      <Text className="text-foreground text-center text-lg font-bold">
        {title}
      </Text>
      <Text className="text-muted mt-2 max-w-80 text-center text-sm leading-5">
        {description}
      </Text>

      <View className="mt-6 flex-row items-center gap-3">
        {hasFilter ? (
          <Pressable
            onPress={onClearFilter}
            className="bg-surface-secondary border-separator rounded-xl border px-4 py-3"
          >
            <Text className="text-foreground text-sm font-semibold">
              Ver todos
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onAddPress}
          style={{ backgroundColor: c.greenTint, borderColor: c.hairStrong }}
          className="flex-row items-center gap-2 rounded-xl border px-4 py-3"
        >
          <Plus size={16} color={c.green} strokeWidth={2.4} />
          <Text
            style={{ color: c.green }}
            className="text-sm font-semibold"
          >
            Novo lançamento
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<TransactionType | null>(
    null,
  );
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
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

  function navigateToDay(targetDate: string, direction: "prev" | "next") {
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
    <Screen className="bg-background">
      <DayNavigator
        date={date}
        onBack={goBack}
        onPrev={goToPrevDay}
        onNext={goToNextDay}
        onAdd={openNewTransaction}
      />

      {/* Saldo fim do dia — DS: header trajectory bg = surface */}
      <View className="bg-surface-secondary border-separator flex-row items-start justify-between border-t px-4 py-4">
        {/* Ontem */}
        <View className="items-start">
          <Text
            style={{ color: c.faint }}
            className="text-label mb-1 font-mono uppercase"
          >
            ONTEM · {formatDayHeader(prevDate)}
          </Text>
          <Text
            style={{ color: c.faint }}
            className="text-body-small font-mono"
          >
            {yesterdayBalance !== null ? formatBRL(yesterdayBalance) : "—"}
          </Text>
        </View>

        {/* Hoje */}
        <View className="items-center">
          <Text className="text-muted text-label mb-1 font-semibold tracking-wide uppercase">
            {isFuture ? "SALDO · PREVISTO" : "SALDO · FIM DO DIA"}
          </Text>
          {todayBalance !== null ? (
            <CurrencyText
              value={todayBalance}
              variant="regular"
              numberOfLines={1}
              adjustsFontSizeToFit
              className={todayBalance >= 0 ? "text-accent" : undefined}
            />
          ) : (
            <Text className="text-accent font-mono-semibold text-balance-highlight">
              —
            </Text>
          )}
        </View>

        {/* Amanhã */}
        <View className="items-end">
          <Text
            style={{ color: c.faint }}
            className="text-label mb-1 font-mono uppercase"
          >
            AMANHÃ · {formatDayHeader(nextDate)}
          </Text>
          <Text
            style={{ color: c.faint }}
            className="text-body-small font-mono"
          >
            {tomorrowBalance !== null ? formatBRL(tomorrowBalance) : "—"}
          </Text>
        </View>
      </View>

      <View className="border-separator mx-4 border-b border-dashed" />

      {/* Resumo de fluxo — DS: entradas=greenMid, saídas=danger, líquido=sign-based */}
      <View className="bg-surface-secondary flex-row items-start justify-between px-4 py-4">
        <View className="flex-1">
          <Text className="text-muted text-label mb-1 font-semibold tracking-widest">
            ENTRADAS
          </Text>
          <CurrencyText
            value={income}
            variant="small"
            sign="positive"
            className="text-accent"
          />
        </View>
        <View className="flex-1 items-center">
          <Text className="text-muted text-label mb-1 font-semibold tracking-widest">
            SAÍDAS
          </Text>
          <CurrencyText value={expenses} variant="small" sign="negative" />
        </View>
        <View className="flex-1 items-end">
          <Text className="text-muted text-label mb-1 font-semibold tracking-widest">
            LÍQUIDO
          </Text>
          <CurrencyText value={net} variant="small" />
        </View>
      </View>

      <View className="bg-separator mx-4 h-px" />

      {/* Filtro */}
      <View className="border-separator flex-row items-center gap-3 border-b px-4 py-3">
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
                variant={selectedType === opt.value ? "primary" : "secondary"}
                color={selectedType === opt.value ? "accent" : "default"}
                size="md"
                onPress={() => {
                  if (isTransitioning) return;
                  setSelectedType(opt.value);
                }}
              >
                {opt.label}
              </Chip>
            ))}
          </ScrollView>
        </GestureDetector>
      </View>

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
              <TransactionListHeader
                date={date}
                filteredCount={filtered.length}
                totalCount={transactions.length}
                selectedType={selectedType}
                isFuture={isFuture}
                projectedDaily={projectedDaily}
                onAdjustProjectionPress={() => {
                  toast.show({
                    placement: "top",
                    duration: 3500,
                    label: "Em breve",
                    description:
                      "A tela de ajuste do diário será adicionada em breve.",
                  });
                }}
              />
            }
            ListEmptyComponent={
              <DayEmptyState
                hasFilter={selectedType !== null && transactions.length > 0}
                selectedType={selectedType}
                onAddPress={openNewTransaction}
                onClearFilter={() => setSelectedType(null)}
              />
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
            ItemSeparatorComponent={() => <Separator />}
            contentContainerClassName="flex-grow pb-8"
          />
        </Animated.View>
      </GestureDetector>
    </Screen>
  );
}
