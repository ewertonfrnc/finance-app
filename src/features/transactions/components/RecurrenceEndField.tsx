import { ChevronRight, X } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";

import {
  DatePickerSheet,
  type DatePickerSheetRef,
} from "@/src/components/ui/DatePickerSheet";
import { formatFullDate } from "@/src/lib/date";

interface RecurrenceEndFieldProps {
  /** Data da última ocorrência ("YYYY-MM-DD") ou indefinido = repete pra sempre. */
  value?: string;
  /** Data de início da série — vira o mínimo e a base do calendário. */
  startDate: string;
  onChange: (date?: string) => void;
}

export function RecurrenceEndField({
  value,
  startDate,
  onChange,
}: RecurrenceEndFieldProps) {
  const sheetRef = useRef<DatePickerSheetRef>(null);

  return (
    <View className="gap-2 border-l-2 border-success/30 pl-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-muted text-xs font-semibold tracking-widest">
          TERMINA EM
        </Text>
        <Text className="text-muted text-xs">opcional</Text>
      </View>

      <Pressable
        onPress={() => sheetRef.current?.open()}
        className="flex-row items-center justify-between py-0.5"
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
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onChange(undefined);
            }}
            hitSlop={10}
          >
            <X size={18} className="text-muted" />
          </Pressable>
        ) : (
          <ChevronRight size={16} className="text-muted" />
        )}
      </Pressable>

      {value ? (
        <Text className="text-muted text-xs">
          Última ocorrência nesta data. Útil pra parcelamento ou empréstimo.
        </Text>
      ) : null}

      <DatePickerSheet
        ref={sheetRef}
        value={value}
        minDate={startDate}
        title="Data da última ocorrência"
        description="A série lança nesta data pela última vez e depois para. Ideal pra parcela de cartão ou empréstimo."
        summaryLabel="Última ocorrência em"
        onConfirm={onChange}
      />
    </View>
  );
}
