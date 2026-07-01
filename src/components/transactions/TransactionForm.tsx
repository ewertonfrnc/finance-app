import { useRouter } from "expo-router";
import { AccordionLayoutTransition, Chip, Input } from "heroui-native";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Repeat,
  Tag,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CurrencyInput } from "@/src/components/ui/CurrencyInput";
import {
  DatePickerSheet,
  type DatePickerSheetRef,
} from "@/src/components/ui/DatePickerSheet";
import { TypeSelector } from "@/src/components/ui/TypeSelector";
import { RecurrenceEndField } from "@/src/features/transactions/components/RecurrenceEndField";
import { RecurrenceSelector } from "@/src/features/transactions/components/RecurrenceSelector";
import { formatRecurrenceLabel } from "@/src/features/transactions/constants";
import type {
  FormValues,
  RecurrenceType,
  TransactionType,
} from "@/src/features/transactions/types";
import { formatBRL } from "@/src/lib/currency";
import {
  formatFullDate,
  formatIsoDate,
  formatWeekdayLong,
} from "@/src/lib/date";
import {
  categoryColorsForScheme,
  colorsForScheme,
} from "@/src/lib/designTokens";

interface TransactionFormProps {
  mode: "new" | "edit";
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  onTagPress?: () => void;
  tagSummary?: string;
  errorMessage?: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const TITLE = { new: "Novo lançamento", edit: "Editar lançamento" } as const;
const SUBMIT_LABEL = { new: "Lançar", edit: "Salvar alterações" } as const;
const TODAY = formatIsoDate(new Date());
const QUICK_AMOUNTS = [1000, 2500, 5000, 10000] as const;
const TYPE_MICROCOPY: Record<TransactionType, string> = {
  entrada: "Aumenta o saldo deste dia.",
  saida: "Reduz o saldo como gasto pontual.",
  diario: "Conta como gasto diário da rotina.",
  economia: "Reserva valor e também reduz o saldo disponível.",
};

type DetailId = "recurrence";

function DateField({ value, onPress }: { value: string; onPress: () => void }) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const isToday = value === TODAY;
  const isFuture = value > TODAY;

  return (
    <View className="gap-2">
      <Text className="text-muted text-label font-semibold tracking-widest">
        DATA
      </Text>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: isFuture ? c.greenTint : c.surface,
          borderColor: isFuture ? c.greenSoft : c.hair,
        }}
        className="rounded-control min-h-14 flex-row items-center gap-3 border px-3 py-3"
      >
        <View
          style={{
            backgroundColor: isFuture ? c.green : c.canvasBg,
            borderColor: isFuture ? c.green : c.hairStrong,
          }}
          className="h-9 w-9 items-center justify-center rounded-xl border"
        >
          <Calendar
            size={17}
            color={isFuture ? c.accentForeground : c.mute}
            strokeWidth={2.3}
          />
        </View>

        <View className="flex-1">
          <Text className="text-foreground text-base font-semibold">
            {isToday ? "Hoje" : formatFullDate(value)}
          </Text>
          <Text className="text-muted text-body-small mt-0.5">
            {formatWeekdayLong(value)}
          </Text>
        </View>

        <ChevronRight size={17} color={isFuture ? c.green : c.mute} />
      </Pressable>
    </View>
  );
}

function RecurrenceEndSummary({ endDate }: { endDate?: string }) {
  return (
    <View className="border-ds-green-soft gap-2 border-l-2 pl-3">
      <Text className="text-muted text-label font-semibold tracking-widest">
        TERMINA EM
      </Text>
      <Text className="text-muted text-base">
        {endDate ? formatFullDate(endDate) : "Sem data — repete pra sempre"}
      </Text>
    </View>
  );
}

function recurrenceSummaryText(
  recurrence: RecurrenceType,
  endDate?: string,
): string {
  if (recurrence === "none") return "Lançamento único, sem repetição.";

  const label = formatRecurrenceLabel(recurrence);
  if (endDate) {
    return `Repete ${label} até ${formatFullDate(endDate)}.`;
  }

  return `Repete ${label} sem data final.`;
}

function TagSelectionField({
  summary,
  onPress,
}: {
  summary: string;
  onPress: () => void;
}) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const hasTags = summary !== "Sem tag";

  return (
    <View className="gap-2">
      <Text className="text-muted text-label font-semibold tracking-widest">
        TAGS
      </Text>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: hasTags ? c.greenTint : c.surface,
          borderColor: hasTags ? c.greenSoft : c.hair,
        }}
        className="rounded-control min-h-14 flex-row items-center gap-3 border px-3 py-3"
      >
        <View
          style={{
            backgroundColor: hasTags ? c.green : c.canvasBg,
            borderColor: hasTags ? c.green : c.hairStrong,
          }}
          className="h-9 w-9 items-center justify-center rounded-xl border"
        >
          <Tag
            size={17}
            color={hasTags ? c.accentForeground : c.mute}
            strokeWidth={2.3}
          />
        </View>

        <View className="flex-1">
          <Text
            className={`text-base font-semibold ${hasTags ? "text-foreground" : "text-muted"}`}
            numberOfLines={1}
          >
            {summary}
          </Text>
          <Text className="text-muted text-body-small mt-0.5">
            {hasTags ? "Toque para ajustar" : "Adicionar tag"}
          </Text>
        </View>

        <ChevronRight size={17} color={hasTags ? c.green : c.mute} />
      </Pressable>
    </View>
  );
}

function AmountSection({
  value,
  type,
  onValueChange,
  autoFocus,
}: {
  value: number;
  type: TransactionType;
  onValueChange: (cents: number) => void;
  autoFocus?: boolean;
}) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const categoryColors = categoryColorsForScheme(scheme);
  const typeColors = categoryColors[type];

  return (
    <View
      style={{ backgroundColor: c.surface, borderColor: c.hair }}
      className="rounded-card gap-4 border px-4 py-4"
    >
      <View className="gap-1">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-1.5">
            <View
              style={{ backgroundColor: typeColors.dot }}
              className="h-2 w-2 rounded-full"
            />
            <Text className="text-muted text-label font-semibold tracking-widest">
              VALOR
            </Text>
          </View>

          <Pressable
            onPress={() => onValueChange(0)}
            disabled={value === 0}
            hitSlop={8}
          >
            <Text
              className={`text-body-small font-semibold ${value === 0 ? "text-faint" : "text-muted"}`}
            >
              Limpar
            </Text>
          </Pressable>
        </View>
        <CurrencyInput
          value={value}
          onValueChange={onValueChange}
          type={type}
          autoFocus={autoFocus}
        />
      </View>

      <View className="flex-row flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <Chip
            key={amount}
            onPress={() => onValueChange(value + amount)}
            style={{
              backgroundColor: typeColors.bg,
              borderColor: typeColors.dot,
              borderWidth: 1,
            }}
            variant="tertiary"
            size="lg"
            className="rounded-control min-h-10 flex-1 basis-[22%]"
          >
            <Chip.Label
              style={{ color: typeColors.ink }}
              className="text-sm font-semibold"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              +{formatBRL(amount).replace("R$", "").trim()}
            </Chip.Label>
          </Chip>
        ))}
      </View>
    </View>
  );
}

function TypeSection({
  value,
  onChange,
}: {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}) {
  const scheme = useColorScheme();
  const categoryColors = categoryColorsForScheme(scheme);
  const typeColors = categoryColors[value];
  const textOpacity = useSharedValue(1);
  const textTranslateY = useSharedValue(0);

  useEffect(() => {
    textOpacity.value = 0;
    textTranslateY.value = -6;
    textOpacity.value = withTiming(1, { duration: 160 });
    textTranslateY.value = withTiming(0, { duration: 180 });
  }, [value, textOpacity, textTranslateY]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View className="gap-2">
      <Text className="text-muted text-label font-semibold tracking-widest">
        TIPO
      </Text>
      <TypeSelector value={value} onChange={onChange} />
      <View style={{ borderColor: typeColors.dot }} className="border-l-2 pl-3">
        <Animated.Text
          style={[{ color: typeColors.ink }, animatedTextStyle]}
          className="text-body-small font-medium"
        >
          {TYPE_MICROCOPY[value]}
        </Animated.Text>
      </View>
    </View>
  );
}

function RecurrenceAdvancedSection({
  mode,
  recurrence,
  recurrenceEndDate,
  date,
  expanded,
  onToggle,
  onRecurrenceChange,
  onRecurrenceEndDateChange,
}: {
  mode: "new" | "edit";
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  date: string;
  expanded: boolean;
  onToggle: () => void;
  onRecurrenceChange: (next: RecurrenceType) => void;
  onRecurrenceEndDateChange: (date?: string) => void;
}) {
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const isRecurring = recurrence !== "none";

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-muted text-label font-semibold tracking-widest">
          AVANÇADO
        </Text>
        <Text className="text-muted text-xs opacity-65">opcional</Text>
      </View>

      <View
        style={{
          backgroundColor: isRecurring ? c.greenTint : c.surface,
          borderColor: isRecurring ? c.greenSoft : c.hair,
        }}
        className="rounded-card overflow-hidden border"
      >
        <Pressable
          onPress={onToggle}
          className="min-h-14 flex-row items-center gap-3 px-3 py-3"
        >
          <View
            style={{
              backgroundColor: isRecurring ? c.green : c.canvasBg,
              borderColor: isRecurring ? c.green : c.hairStrong,
            }}
            className="h-9 w-9 items-center justify-center rounded-xl border"
          >
            <Repeat
              size={17}
              color={isRecurring ? c.accentForeground : c.mute}
              strokeWidth={2.3}
            />
          </View>

          <View className="flex-1">
            <Text className="text-foreground text-base font-semibold">
              Repetição
            </Text>
            <Text className="text-muted text-body-small mt-0.5">
              {recurrenceSummaryText(recurrence, recurrenceEndDate)}
            </Text>
          </View>

          <ChevronRight
            size={17}
            color={isRecurring ? c.green : c.mute}
            style={{
              transform: [{ rotate: expanded ? "90deg" : "0deg" }],
            }}
          />
        </Pressable>

        {expanded ? (
          <View className="border-surface-tertiary gap-3 border-t px-3 py-3">
            {mode === "new" ? (
              <>
                <RecurrenceSelector
                  value={recurrence}
                  onChange={onRecurrenceChange}
                />
                {recurrence !== "none" ? (
                  <RecurrenceEndField
                    value={recurrenceEndDate}
                    startDate={date}
                    onChange={onRecurrenceEndDateChange}
                  />
                ) : (
                  <Text className="text-muted text-xs leading-5">
                    Use repetição para despesas fixas, parcelas, salários ou
                    reservas que entram em mais de uma data.
                  </Text>
                )}
              </>
            ) : (
              <View className="gap-3">
                <RecurrenceEndSummary endDate={recurrenceEndDate} />
                <Text className="text-muted text-xs leading-5">
                  Ao salvar ou excluir, você escolhe se a alteração vale só para
                  esta ocorrência, para as próximas ou para toda a série.
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function TransactionForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  isLoading = false,
  isDeleting = false,
  onTagPress,
  tagSummary = "Sem tag",
  errorMessage,
  header,
  children,
}: TransactionFormProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);

  const datePickerSheetRef = useRef<DatePickerSheetRef>(null);

  const [type, setType] = useState<TransactionType>(
    initialValues?.type ?? "diario",
  );
  const [amountCents, setAmountCents] = useState(
    initialValues?.amountCents ?? 0,
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [date, setDate] = useState(
    initialValues?.date ?? formatIsoDate(new Date()),
  );
  const [recurrence, setRecurrence] = useState<RecurrenceType>(
    initialValues?.recurrence ?? "none",
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<
    string | undefined
  >(initialValues?.recurrenceEndDate);
  const [expandedDetail, setExpandedDetail] = useState<DetailId | null>(null);
  const canSubmit = amountCents > 0 && description.trim().length > 0;
  const showRecurrenceDetail = mode === "new" || recurrence !== "none";

  function handleRecurrenceChange(next: RecurrenceType) {
    setRecurrence(next);
    // Sem recorrência não faz sentido manter uma data de término.
    if (next === "none") setRecurrenceEndDate(undefined);
  }

  function handleSubmit() {
    if (!canSubmit || isLoading) return;
    onSubmit({
      type,
      amountCents,
      description,
      date,
      recurrence,
      recurrenceEndDate: recurrence === "none" ? undefined : recurrenceEndDate,
    });
  }

  return (
    <KeyboardAvoidingView
      className="bg-surface flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={c.mute} />
        </Pressable>
        <View className="absolute inset-x-0 items-center" pointerEvents="none">
          <Text className="text-foreground text-sheet-title font-bold">
            {TITLE[mode]}
          </Text>
        </View>
      </View>

      <Animated.ScrollView
        layout={AccordionLayoutTransition}
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 pb-28"
      >
        {header}

        {/* Valor */}
        <AmountSection
          value={amountCents}
          onValueChange={setAmountCents}
          type={type}
          autoFocus
        />

        <TypeSection value={type} onChange={setType} />

        {/* Descrição */}
        <View className="gap-1">
          <Text className="text-muted text-label font-semibold tracking-widest">
            DESCRIÇÃO
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Onde foi parar essa grana?"
            maxLength={200}
            returnKeyType="done"
            scrollEnabled={false}
            variant="secondary"
            className="text-input border-surface-tertiary min-h-11 rounded-none border-x-0 border-t-0 border-b-2 bg-transparent px-0 py-2 font-medium"
          />
          <Text className="text-muted self-end text-xs">
            {description.length}/200
          </Text>
        </View>

        {onTagPress ? (
          <TagSelectionField summary={tagSummary} onPress={onTagPress} />
        ) : null}

        <DateField
          value={date}
          onPress={() => datePickerSheetRef.current?.open()}
        />

        {showRecurrenceDetail ? (
          <RecurrenceAdvancedSection
            mode={mode}
            recurrence={recurrence}
            recurrenceEndDate={recurrenceEndDate}
            date={date}
            expanded={expandedDetail === "recurrence"}
            onToggle={() =>
              setExpandedDetail((current) =>
                current === "recurrence" ? null : "recurrence",
              )
            }
            onRecurrenceChange={handleRecurrenceChange}
            onRecurrenceEndDateChange={setRecurrenceEndDate}
          />
        ) : null}

        {children}

        {errorMessage ? (
          <View className="bg-danger/10 rounded-xl px-4 py-3">
            <Text className="text-danger text-sm">{errorMessage}</Text>
          </View>
        ) : null}
      </Animated.ScrollView>

      {/* Footer */}
      <View className="gap-3 px-4 pt-4" style={{ paddingBottom: bottom || 16 }}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
          className={`items-center rounded-full py-4 ${
            canSubmit && !isLoading ? "bg-foreground" : "bg-surface-tertiary"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              canSubmit && !isLoading ? "text-background" : "text-muted"
            }`}
          >
            {isLoading ? "Aguarde..." : SUBMIT_LABEL[mode]}
          </Text>
        </Pressable>

        {mode === "edit" && onDelete && (
          <Pressable
            onPress={onDelete}
            disabled={isDeleting}
            className="items-center py-2"
          >
            <Text className="text-danger text-base font-medium">
              {isDeleting ? "Excluindo..." : "Excluir lançamento"}
            </Text>
          </Pressable>
        )}
      </View>

      <DatePickerSheet
        ref={datePickerSheetRef}
        value={date}
        title="Selecionar data"
        description="Escolha a data em que este lançamento entra no saldo."
        summaryLabel="Data do lançamento"
        onConfirm={setDate}
      />
    </KeyboardAvoidingView>
  );
}
