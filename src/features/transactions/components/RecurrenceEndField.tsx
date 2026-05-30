import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Calendar,
  type CalendarTheme,
  fromDateId,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { addMonths, addYears, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { renderSheetBackdrop } from "@/src/components/ui/SheetBackdrop";
import { capitalize, formatFullDate } from "@/src/lib/date";

interface RecurrenceEndFieldProps {
  /** Data da última ocorrência ("YYYY-MM-DD") ou indefinido = repete pra sempre. */
  value?: string;
  /** Data de início da série — vira o mínimo e a base dos atalhos. */
  startDate: string;
  onChange: (date?: string) => void;
}

/** Paleta resolvida em JS — o tema do flash-calendar não aceita className. */
const PALETTE = {
  light: {
    sheet: "#FFFFFF",
    text: "#1A2620",
    muted: "#6B7280",
    disabled: "#C2CBC5",
    activeBg: "#1E3D2B",
    activeFg: "#FFFFFF",
  },
  dark: {
    sheet: "#1E2A24",
    text: "#E8EDE9",
    muted: "#8A9B92",
    disabled: "#4A554E",
    activeBg: "#5AB87A",
    activeFg: "#0F1A14",
  },
} as const;

function monthLabel(monthId: string): string {
  return capitalize(format(fromDateId(monthId), "MMMM yyyy", { locale: ptBR }));
}

export function RecurrenceEndField({
  value,
  startDate,
  onChange,
}: RecurrenceEndFieldProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = useMemo(
    () => PALETTE[scheme === "dark" ? "dark" : "light"],
    [scheme],
  );

  // Estado provisório enquanto o sheet está aberto — só vira definitivo no Confirmar.
  const [draft, setDraft] = useState<string | undefined>(value);
  const [visibleMonthId, setVisibleMonthId] = useState(value ?? startDate);

  const shortcuts = useMemo(() => {
    const base = parseISO(startDate);
    return [
      { label: "Em 6 meses", date: toDateId(addMonths(base, 6)) },
      { label: "Em 1 ano", date: toDateId(addYears(base, 1)) },
    ];
  }, [startDate]);

  const calendarTheme = useMemo<CalendarTheme>(
    () => ({
      itemWeekName: { content: { color: colors.muted, fontSize: 12 } },
      itemDay: {
        base: () => ({ content: { color: colors.text } }),
        today: () => ({
          container: { borderWidth: 1, borderColor: colors.activeBg },
          content: { color: colors.text },
        }),
        active: () => ({
          container: { backgroundColor: colors.activeBg },
          content: { color: colors.activeFg, fontWeight: "600" },
        }),
        disabled: () => ({ content: { color: colors.disabled } }),
      },
    }),
    [colors],
  );

  function openSheet() {
    setDraft(value);
    setVisibleMonthId(value ?? startDate);
    sheetRef.current?.present();
  }

  function selectShortcut(date: string) {
    setDraft(date);
    setVisibleMonthId(date);
  }

  function confirm() {
    onChange(draft);
    sheetRef.current?.dismiss();
  }

  function shiftMonth(delta: number) {
    setVisibleMonthId((current) =>
      toDateId(addMonths(fromDateId(current), delta)),
    );
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-muted text-xs font-semibold tracking-widest">
          TERMINA EM
        </Text>
        <Text className="text-muted text-xs">opcional</Text>
      </View>

      <Pressable
        onPress={openSheet}
        className="border-surface-tertiary flex-row items-center justify-between border-b-2 pb-2"
      >
        {value ? (
          <Text className="font-mono-medium text-foreground text-xl">
            {formatFullDate(value)}
          </Text>
        ) : (
          <Text className="text-muted text-base">
            Sem data — repete pra sempre
          </Text>
        )}

        {value ? (
          <Pressable onPress={() => onChange(undefined)} hitSlop={10}>
            <X size={18} className="text-muted" />
          </Pressable>
        ) : (
          <CalendarDays size={18} className="text-success" />
        )}
      </Pressable>

      {value ? (
        <Text className="text-muted text-xs">
          Última ocorrência nesta data. Útil pra parcelamento ou empréstimo.
        </Text>
      ) : null}

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderSheetBackdrop}
        bottomInset={bottom}
        backgroundStyle={{ backgroundColor: colors.sheet }}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
      >
        <BottomSheetView className="px-5 pt-1 pb-6">
          <Text className="text-foreground text-lg font-semibold">
            Data da última ocorrência
          </Text>
          <Text className="text-muted mt-1 text-sm">
            A série lança nesta data pela última vez e depois para. Ideal pra
            parcela de cartão ou empréstimo.
          </Text>

          {/* Atalhos relativos à data de início */}
          <View className="mt-4 flex-row gap-2">
            {shortcuts.map((shortcut) => {
              const active = draft === shortcut.date;
              return (
                <Pressable
                  key={shortcut.label}
                  onPress={() => selectShortcut(shortcut.date)}
                  className={`flex-row items-center gap-2 rounded-full px-3.5 py-2 ${
                    active
                      ? "bg-success/15 border border-success/40"
                      : "bg-surface-secondary border border-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      active ? "text-success" : "text-foreground"
                    }`}
                  >
                    {shortcut.label}
                  </Text>
                  <Text className="font-mono text-muted text-xs">
                    {formatFullDate(shortcut.date)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Cabeçalho do mês com navegação */}
          <View className="mt-5 mb-1 flex-row items-center justify-between px-1">
            <Pressable onPress={() => shiftMonth(-1)} hitSlop={10}>
              <ChevronLeft size={22} className="text-muted" />
            </Pressable>
            <Text className="text-foreground text-base font-semibold">
              {monthLabel(visibleMonthId)}
            </Text>
            <Pressable onPress={() => shiftMonth(1)} hitSlop={10}>
              <ChevronRight size={22} className="text-muted" />
            </Pressable>
          </View>

          <Calendar
            calendarMonthId={visibleMonthId}
            calendarMinDateId={startDate}
            calendarFirstDayOfWeek="sunday"
            calendarMonthHeaderHeight={0}
            calendarDayHeight={42}
            calendarRowVerticalSpacing={4}
            calendarRowHorizontalSpacing={2}
            calendarFormatLocale="pt-BR"
            getCalendarWeekDayFormat={(date) =>
              format(date, "EEEEE", { locale: ptBR }).toUpperCase()
            }
            calendarActiveDateRanges={
              draft ? [{ startId: draft, endId: draft }] : []
            }
            onCalendarDayPress={(dateId) => setDraft(dateId)}
            theme={calendarTheme}
          />

          {/* Resumo da seleção */}
          <View className="border-surface-tertiary mt-4 flex-row items-center justify-between rounded-2xl border px-4 py-3">
            <Text className="text-muted text-sm">Última ocorrência em</Text>
            <Text className="font-mono-medium text-foreground text-base">
              {draft ? formatFullDate(draft) : "—"}
            </Text>
          </View>

          {/* Ações */}
          <View className="mt-4 flex-row gap-3">
            <Pressable
              onPress={() => sheetRef.current?.dismiss()}
              className="border-surface-tertiary flex-1 items-center rounded-full border py-3.5"
            >
              <Text className="text-foreground text-base font-semibold">
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={confirm}
              disabled={!draft}
              className={`flex-1 items-center rounded-full py-3.5 ${
                draft ? "bg-foreground" : "bg-surface-tertiary"
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  draft ? "text-background" : "text-muted"
                }`}
              >
                Confirmar
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
