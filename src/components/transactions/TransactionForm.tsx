import { subDays } from "date-fns";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Repeat,
  Tag,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { Accordion, AccordionLayoutTransition } from "heroui-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CurrencyInput } from "@/src/components/ui/CurrencyInput";
import { DateField } from "@/src/components/ui/DateField";
import { TypeSelector } from "@/src/components/ui/TypeSelector";
import { RecurrenceEndField } from "@/src/features/transactions/components/RecurrenceEndField";
import { RecurrenceSelector } from "@/src/features/transactions/components/RecurrenceSelector";
import { formatRecurrenceLabel } from "@/src/features/transactions/constants";
import type {
  FormValues,
  RecurrenceType,
  TransactionType,
} from "@/src/features/transactions/types";
import { formatFullDate, formatIsoDate } from "@/src/lib/date";
import { CATEGORY_COLORS, colorsForScheme } from "@/src/lib/designTokens";

interface TransactionFormProps {
  mode: "new" | "edit";
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  tagField?: React.ReactNode;
  tagSummary?: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const TITLE = { new: "Novo lançamento", edit: "Editar lançamento" } as const;
const SUBMIT_LABEL = { new: "Lançar", edit: "Salvar alterações" } as const;

type DetailId = "tag" | "date" | "recurrence";

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
}

interface DatePreset {
  label: string;
  value: string;
}

interface DatePresetButtonProps {
  label: string;
  active: boolean;
  accentColor: string;
  onPress: () => void;
}

function DetailRow({
  label,
  value,
  icon: Icon,
  iconColor,
}: DetailRowProps) {
  return (
    <View className="min-h-9 flex-1 flex-row items-center gap-3">
      <Icon size={16} color={iconColor} />
      <Text className="text-muted text-label flex-1 font-semibold tracking-widest opacity-80">
        {label}
      </Text>
      <Text
        className="text-muted max-w-[48%] text-right text-sm font-medium opacity-75"
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function DetailSeparator() {
  return <View className="bg-surface-tertiary ml-7 h-px opacity-45" />;
}

function DetailIndicator({ color }: { color: string }) {
  return (
    <Accordion.Indicator
      iconProps={{ size: 16, color }}
      animation={{ rotation: { value: [-90, 0] } }}
    />
  );
}

function DatePresetButton({
  label,
  active,
  accentColor,
  onPress,
}: DatePresetButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="border-surface-tertiary rounded-full border px-3 py-1.5"
      style={
        active
          ? {
              backgroundColor: `${accentColor}22`,
              borderColor: accentColor,
            }
          : undefined
      }
    >
      <Text
        className="text-muted text-xs font-medium"
        style={active ? { color: accentColor } : undefined}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function formatDateSummary(date: string, presets: DatePreset[]): string {
  return (
    presets.find((preset) => preset.value === date)?.label ??
    formatFullDate(date)
  );
}

function isDetailId(value: string): value is DetailId {
  return value === "tag" || value === "date" || value === "recurrence";
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

export function TransactionForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  isLoading = false,
  isDeleting = false,
  tagField,
  tagSummary = "Sem tag",
  header,
  children,
}: TransactionFormProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);

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
  const typeAccentColor = CATEGORY_COLORS[type].dot;
  const datePresets = useMemo<DatePreset[]>(() => {
    const now = new Date();
    return [
      { label: "Hoje", value: formatIsoDate(now) },
      { label: "Ontem", value: formatIsoDate(subDays(now, 1)) },
      { label: "Anteontem", value: formatIsoDate(subDays(now, 2)) },
    ];
  }, []);
  const recurrenceSummary =
    formatRecurrenceLabel(recurrence) || "Não repete";
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
    <KeyboardAvoidingView className="bg-surface flex-1" behavior="padding">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>
        <Text className="text-foreground text-sheet-title font-bold">
          {TITLE[mode]}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <X size={22} className="text-foreground" />
        </Pressable>
      </View>

      <Animated.ScrollView
        layout={AccordionLayoutTransition}
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 pb-8"
      >
        {header}

        {/* Tipo */}
        <View className="gap-2">
          <Text className="text-muted text-label font-semibold tracking-widest">
            TIPO
          </Text>
          <TypeSelector value={type} onChange={setType} />
        </View>

        {/* Valor */}
        <View className="gap-2">
          <View className="flex-row items-center gap-1.5">
            <View
              style={{ backgroundColor: CATEGORY_COLORS[type].dot }}
              className="h-2 w-2 rounded-full"
            />
            <Text className="text-muted text-label font-semibold tracking-widest">
              VALOR
            </Text>
          </View>
          <CurrencyInput
            value={amountCents}
            onValueChange={setAmountCents}
            type={type}
          />
        </View>

        {/* Descrição */}
        <View className="gap-1">
          <Text className="text-muted text-label font-semibold tracking-widest">
            DESCRIÇÃO
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Onde foi parar essa grana?"
            placeholderTextColor="#9ca3af"
            maxLength={200}
            returnKeyType="done"
            className="text-foreground border-surface-tertiary text-input border-b-2 py-2 font-medium"
          />
          <Text className="text-muted self-end text-xs">
            {description.length}/200
          </Text>
        </View>

        <Accordion
          selectionMode="single"
          value={expandedDetail ?? undefined}
          onValueChange={(value: string | string[] | undefined) => {
            if (typeof value === "string" && isDetailId(value)) {
              setExpandedDetail(value);
              return;
            }
            setExpandedDetail(null);
          }}
          hideSeparator
          animation={{
            layout: { value: AccordionLayoutTransition },
          }}
        >
          <View className="flex-row items-center justify-between pb-1.5">
            <Text className="text-muted text-label font-semibold tracking-widest opacity-80">
              DETALHES
            </Text>
            <Text className="text-muted text-xs opacity-65">opcional</Text>
          </View>
          <View className="bg-surface-tertiary h-px opacity-45" />

          {tagField ? (
            <Accordion.Item value="tag">
              <Accordion.Trigger className="min-h-11 px-0 py-2">
                <DetailRow
                  label="TAG"
                  value={tagSummary}
                  icon={Tag}
                  iconColor={c.mute}
                />
                <DetailIndicator color={c.mute} />
              </Accordion.Trigger>
              <Accordion.Content className="px-0 pb-0">
                <View className="py-2.5 pl-7">
                  {tagField}
                </View>
              </Accordion.Content>
              <DetailSeparator />
            </Accordion.Item>
          ) : null}

          <Accordion.Item value="date">
            <Accordion.Trigger className="min-h-11 px-0 py-2">
              <DetailRow
                label="DATA"
                value={formatDateSummary(date, datePresets)}
                icon={Calendar}
                iconColor={c.mute}
              />
              <DetailIndicator color={c.mute} />
            </Accordion.Trigger>
            <Accordion.Content className="px-0 pb-0">
              <View className="gap-2.5 py-2.5 pl-7">
                <DateField value={date} onChange={setDate} />
                <View className="flex-row flex-wrap gap-2">
                  {datePresets.map((preset) => (
                    <DatePresetButton
                      key={preset.value}
                      label={preset.label}
                      active={date === preset.value}
                      accentColor={typeAccentColor}
                      onPress={() => setDate(preset.value)}
                    />
                  ))}
                </View>
              </View>
            </Accordion.Content>
            {showRecurrenceDetail ? <DetailSeparator /> : null}
          </Accordion.Item>

          {showRecurrenceDetail && (
            <Accordion.Item value="recurrence">
              <Accordion.Trigger className="min-h-11 px-0 py-2">
                <DetailRow
                  label="RECORRÊNCIA"
                  value={recurrenceSummary}
                  icon={Repeat}
                  iconColor={c.mute}
                />
                <DetailIndicator color={c.mute} />
              </Accordion.Trigger>
              <Accordion.Content className="px-0 pb-0">
                {mode === "new" ? (
                  <View className="gap-2.5 py-2.5 pl-7">
                    <RecurrenceSelector
                      value={recurrence}
                      onChange={handleRecurrenceChange}
                    />
                    {recurrence !== "none" && (
                      <RecurrenceEndField
                        value={recurrenceEndDate}
                        startDate={date}
                        onChange={setRecurrenceEndDate}
                      />
                    )}
                  </View>
                ) : (
                  <View className="py-2.5 pl-7">
                    <RecurrenceEndSummary endDate={recurrenceEndDate} />
                  </View>
                )}
              </Accordion.Content>
            </Accordion.Item>
          )}
        </Accordion>

        {children}
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
    </KeyboardAvoidingView>
  );
}
