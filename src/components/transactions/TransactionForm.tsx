import { format } from "date-fns";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  List,
  Repeat,
  Trash2,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  type ColorSchemeName,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { CurrencyInput } from "@/src/components/ui/CurrencyInput";
import {
  DatePickerSheet,
  type DatePickerSheetRef,
} from "@/src/components/ui/DatePickerSheet";
import { TypeSelector } from "@/src/components/ui/TypeSelector";
import type {
  FormValues,
  RecurrenceType,
  TransactionType,
} from "@/src/features/transactions/types";
import { renderSheetBackdrop } from "@/src/components/ui/SheetBackdrop";
import { RECURRENCE_LABELS } from "@/src/features/transactions/constants";
import { colorsForScheme, DS_SHADOWS } from "@/src/lib/designTokens";
import { formatFullDate } from "@/src/lib/date";

interface TransactionFormProps {
  mode: "new" | "edit";
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  tagField?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const TITLE = { new: "Nova transação", edit: "Editar transação" } as const;
const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "Não repete" },
  { value: "monthly", label: RECURRENCE_LABELS.monthly },
  { value: "weekly", label: RECURRENCE_LABELS.weekly },
  { value: "daily", label: RECURRENCE_LABELS.daily },
  { value: "yearly", label: RECURRENCE_LABELS.yearly },
];

function getRecurrenceLabel(recurrence: RecurrenceType) {
  return (
    RECURRENCE_OPTIONS.find((option) => option.value === recurrence)?.label ??
    "Não repete"
  );
}

function RowIcon({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <View
      className={`rounded-control h-11 w-11 items-center justify-center ${
        tone === "danger" ? "bg-danger/10" : "bg-ds-green-tint"
      }`}
    >
      {children}
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View className="gap-3">
      <Text className="text-muted text-label font-bold tracking-[2px]">
        {title}
      </Text>
      <View
        className="rounded-card-lg border-separator bg-background overflow-hidden border"
        style={[DS_SHADOWS.summary, { borderColor: colors.hair }]}
      >
        {children}
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  muted = false,
  isLast = false,
  onPress,
  showChevron = true,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  muted?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
  tone?: "default" | "danger";
}) {
  const content = (
    <View
      className={`min-h-20 flex-row items-center gap-4 px-4 py-3 ${
        isLast ? "" : "border-separator border-b"
      }`}
    >
      <RowIcon tone={tone}>{icon}</RowIcon>
      <View className="min-w-0 flex-1">
        <Text
          className={`text-label font-bold tracking-[2px] ${
            tone === "danger" ? "text-danger" : "text-muted"
          }`}
        >
          {label}
        </Text>
        {typeof value === "string" ? (
          <Text
            className={`text-input mt-0.5 font-bold ${
              tone === "danger"
                ? "text-danger"
                : muted
                  ? "text-faint"
                  : "text-foreground"
            }`}
            numberOfLines={1}
          >
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
      {onPress && showChevron ? (
        <ChevronRight
          size={18}
          className={tone === "danger" ? "text-danger" : "text-muted"}
        />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      {content}
    </Pressable>
  );
}

function ValueHero({
  amountCents,
  type,
  onAmountChange,
  onTypeChange,
  scheme,
}: {
  amountCents: number;
  type: TransactionType;
  onAmountChange: (value: number) => void;
  onTypeChange: (type: TransactionType) => void;
  scheme: ColorSchemeName;
}) {
  const colors = colorsForScheme(scheme);

  return (
    <View
      className="rounded-card-lg border-separator bg-background border px-5 py-5"
      style={[DS_SHADOWS.summary, { borderColor: colors.hair }]}
    >
      <View>
        <View className="min-w-0 flex-1">
          <Text className="text-muted text-label font-bold tracking-[2px]">
            VALOR
          </Text>
          <View className="mt-2">
            <CurrencyInput
              value={amountCents}
              onValueChange={onAmountChange}
              type={type}
              showUnderline={false}
            />
          </View>
        </View>
      </View>

      <View className="bg-separator my-5 h-px" />

      <TypeSelector value={type} onChange={onTypeChange} />
    </View>
  );
}

function DateRow({
  value,
  onChange,
  isLast,
}: {
  value: string;
  onChange: (date: string) => void;
  isLast?: boolean;
}) {
  const sheetRef = useRef<DatePickerSheetRef>(null);

  return (
    <>
      <DetailRow
        icon={<Calendar size={20} className="text-ds-green" />}
        label="DATA"
        value={formatFullDate(value)}
        isLast={isLast}
        onPress={() => sheetRef.current?.open()}
      />
      <DatePickerSheet
        ref={sheetRef}
        value={value}
        title="Selecionar data"
        description="Escolha a data em que este lançamento entra no saldo."
        summaryLabel="Data do lançamento"
        onConfirm={onChange}
      />
    </>
  );
}

function RecurrenceRow({
  value,
  onChange,
  readOnly,
  isLast,
}: {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
  readOnly?: boolean;
  isLast?: boolean;
}) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <DetailRow
        icon={<Repeat size={20} className="text-ds-green" />}
        label="REPETE"
        value={getRecurrenceLabel(value)}
        isLast={isLast}
        onPress={readOnly ? undefined : () => sheetRef.current?.present()}
      />
      {readOnly ? null : (
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={["42%"]}
          enablePanDownToClose
          backdropComponent={renderSheetBackdrop}
          bottomInset={bottom}
        >
          <BottomSheetView className="px-5 pt-1 pb-6">
            <Text className="text-foreground text-sheet-title mb-4 font-bold">
              Repetição
            </Text>
            <View className="gap-2">
              {RECURRENCE_OPTIONS.map((option) => {
                const active = value === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      sheetRef.current?.dismiss();
                    }}
                    className={`rounded-2xl border px-4 py-3 ${
                      active
                        ? "border-ds-green-soft bg-ds-green-tint"
                        : "border-separator bg-background"
                    }`}
                  >
                    <Text
                      className={`text-base font-bold ${
                        active ? "text-ds-green" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </>
  );
}

function RecurrenceEndRow({
  value,
  startDate,
  onChange,
  readOnly,
  isLast,
}: {
  value?: string;
  startDate: string;
  onChange: (date?: string) => void;
  readOnly?: boolean;
  isLast?: boolean;
}) {
  const sheetRef = useRef<DatePickerSheetRef>(null);

  return (
    <>
      <DetailRow
        icon={<Calendar size={20} className="text-ds-green" />}
        label="TERMINA EM"
        value={value ? formatFullDate(value) : "Sem data — repete sempre"}
        muted={!value}
        isLast={isLast}
        onPress={readOnly ? undefined : () => sheetRef.current?.open()}
      />
      {readOnly ? null : (
        <DatePickerSheet
          ref={sheetRef}
          value={value}
          minDate={startDate}
          title="Data da última ocorrência"
          description="A série lança nesta data pela última vez e depois para. Ideal pra parcela de cartão ou empréstimo."
          summaryLabel="Última ocorrência em"
          onConfirm={onChange}
        />
      )}
    </>
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
  header,
  children,
}: TransactionFormProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const scheme = useColorScheme();
  const descriptionRef = useRef<TextInput>(null);

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
    initialValues?.date ?? format(new Date(), "yyyy-MM-dd"),
  );
  const [recurrence, setRecurrence] = useState<RecurrenceType>(
    initialValues?.recurrence ?? "none",
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<
    string | undefined
  >(initialValues?.recurrenceEndDate);

  const canSubmit = amountCents > 0 && description.trim().length > 0;

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
    <KeyboardAvoidingView className="bg-ds-surface flex-1" behavior="padding">
      <View className="bg-background border-separator flex-row items-center gap-4 border-b px-4 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>
        <Text className="text-foreground text-sheet-title flex-1 font-bold">
          {TITLE[mode]}
        </Text>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
          hitSlop={8}
        >
          <Text
            className={`text-base font-bold ${
              canSubmit && !isLoading ? "text-ds-green" : "text-muted"
            }`}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 pt-5"
        contentContainerStyle={{ paddingBottom: bottom + 32 }}
      >
        <ValueHero
          amountCents={amountCents}
          type={type}
          onAmountChange={setAmountCents}
          onTypeChange={setType}
          scheme={scheme}
        />

        {header}
        {children}

        <Section title="DETALHES">
          <DetailRow
            icon={<List size={20} className="text-ds-green" />}
            label="DESCRIÇÃO"
            value={
              <TextInput
                ref={descriptionRef}
                value={description}
                onChangeText={setDescription}
                placeholder="Onde foi parar essa grana?"
                placeholderTextColor={colorsForScheme(scheme).faint}
                maxLength={200}
                multiline
                numberOfLines={2}
                returnKeyType="done"
                scrollEnabled={false}
                textAlignVertical="top"
                className="text-foreground text-input mt-0.5 min-h-8 p-0 font-bold"
              />
            }
            onPress={() => descriptionRef.current?.focus()}
            showChevron={false}
          />

          <DateRow value={date} onChange={setDate} />

          {tagField}
        </Section>

        <Section title="RECORRÊNCIA">
          <RecurrenceRow
            value={recurrence}
            onChange={handleRecurrenceChange}
            readOnly={mode === "edit"}
            isLast={recurrence === "none"}
          />
          {recurrence !== "none" ? (
            <RecurrenceEndRow
              value={recurrenceEndDate}
              startDate={date}
              onChange={setRecurrenceEndDate}
              readOnly={mode === "edit"}
              isLast
            />
          ) : null}
        </Section>

        {mode === "edit" && onDelete ? (
          <Section title="ZONA DE RISCO">
            <DetailRow
              icon={<Trash2 size={20} className="text-danger" />}
              label="ZONA DE RISCO"
              value={isDeleting ? "Excluindo..." : "Excluir transação"}
              tone="danger"
              isLast
              onPress={isDeleting ? undefined : onDelete}
            />
          </Section>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
