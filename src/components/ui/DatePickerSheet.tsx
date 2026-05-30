import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Calendar,
  type CalendarTheme,
  fromDateId,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { capitalize, formatFullDate, formatIsoDate } from "@/src/lib/date";
import { DATE_PICKER_COLORS, schemeKey } from "@/src/lib/designTokens";
import { PrimaryButton } from "./PrimaryButton";
import { renderSheetBackdrop } from "./SheetBackdrop";

export interface DatePickerSheetRef {
  open: () => void;
}

interface DatePickerSheetProps {
  value?: string;
  minDate?: string;
  title: string;
  description: string;
  summaryLabel: string;
  onConfirm: (date: string) => void;
}

function monthLabel(monthId: string): string {
  return capitalize(format(fromDateId(monthId), "MMMM yyyy", { locale: ptBR }));
}

function fallbackDate(value?: string, minDate?: string): string {
  return value ?? minDate ?? formatIsoDate(new Date());
}

export const DatePickerSheet = forwardRef<
  DatePickerSheetRef,
  DatePickerSheetProps
>(function DatePickerSheet(
  { value, minDate, title, description, summaryLabel, onConfirm },
  ref,
) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = useMemo(() => DATE_PICKER_COLORS[schemeKey(scheme)], [scheme]);

  // Estado provisório enquanto o sheet está aberto — só vira definitivo no Confirmar.
  const [draft, setDraft] = useState(() => fallbackDate(value, minDate));
  const [visibleMonthId, setVisibleMonthId] = useState(() =>
    fallbackDate(value, minDate),
  );

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

  useImperativeHandle(ref, () => ({
    open() {
      const initialDate = fallbackDate(value, minDate);
      setDraft(initialDate);
      setVisibleMonthId(initialDate);
      sheetRef.current?.present();
    },
  }));

  function confirm() {
    onConfirm(draft);
    sheetRef.current?.dismiss();
  }

  function shiftMonth(delta: number) {
    setVisibleMonthId((current) =>
      toDateId(addMonths(fromDateId(current), delta)),
    );
  }

  return (
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
        <Text className="text-foreground text-sheet-title font-bold">
          {title}
        </Text>
        <Text className="text-muted mt-1 text-sm">{description}</Text>

        {/* Cabeçalho do mês com navegação */}
        <View className="mt-5 mb-1 flex-row items-center justify-between px-1">
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={10}>
            <ChevronLeft size={22} className="text-muted" />
          </Pressable>
          <Text className="text-foreground text-month font-semibold">
            {monthLabel(visibleMonthId)}
          </Text>
          <Pressable onPress={() => shiftMonth(1)} hitSlop={10}>
            <ChevronRight size={22} className="text-muted" />
          </Pressable>
        </View>

        <Calendar
          calendarMonthId={visibleMonthId}
          calendarMinDateId={minDate}
          calendarFirstDayOfWeek="sunday"
          calendarMonthHeaderHeight={0}
          calendarDayHeight={42}
          calendarRowVerticalSpacing={4}
          calendarRowHorizontalSpacing={2}
          calendarFormatLocale="pt-BR"
          getCalendarWeekDayFormat={(date) =>
            format(date, "EEEEE", { locale: ptBR }).toUpperCase()
          }
          calendarActiveDateRanges={[{ startId: draft, endId: draft }]}
          onCalendarDayPress={(dateId) => setDraft(dateId)}
          theme={calendarTheme}
        />

        {/* Resumo da seleção */}
        <View
          style={{
            backgroundColor: colors.summaryBg,
            borderColor: colors.summaryBorder,
          }}
          className="mt-4 flex-row items-center justify-between rounded-2xl border px-4 py-3"
        >
          <Text className="text-muted text-sm">{summaryLabel}</Text>
          <Text className="font-mono-medium text-foreground text-base">
            {formatFullDate(draft)}
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
          <PrimaryButton
            label="Confirmar"
            onPress={confirm}
            className="h-auto flex-1 py-3.5"
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
