import { Calendar } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";

import {
  DatePickerSheet,
  type DatePickerSheetRef,
} from "@/src/components/ui/DatePickerSheet";
import { formatFullDate } from "@/src/lib/date";
import { colorsForScheme } from "@/src/lib/designTokens";

interface DateFieldProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
}

export function DateField({ value, onChange }: DateFieldProps) {
  const sheetRef = useRef<DatePickerSheetRef>(null);
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View>
      <Pressable
        onPress={() => sheetRef.current?.open()}
        className="border-surface-tertiary flex-row items-center justify-between border-b-2 pb-2"
      >
        <Text className="font-mono-medium text-foreground text-input">
          {formatFullDate(value)}
        </Text>
        <Calendar size={18} color={colors.green} />
      </Pressable>

      <DatePickerSheet
        ref={sheetRef}
        value={value}
        title="Selecionar data"
        description="Escolha a data em que este lançamento entra no saldo."
        summaryLabel="Data do lançamento"
        onConfirm={onChange}
      />
    </View>
  );
}
