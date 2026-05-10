import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

import { formatIsoDate } from "@/src/lib/date";

interface DateFieldProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
}

function toDate(iso: string): Date {
  if (!iso) return new Date();
  const parsed = parseISO(iso);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function toDisplay(iso: string): string {
  return format(toDate(iso), "dd/MM/yyyy", { locale: ptBR });
}

export function DateField({ value, onChange }: DateFieldProps) {
  const [isIosPickerOpen, setIsIosPickerOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(() => toDate(value));

  function commitDate(nextDate: Date) {
    onChange(formatIsoDate(nextDate));
  }

  function openPicker() {
    const selectedDate = toDate(value);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        value: selectedDate,
        onChange: (event, nextDate) => {
          if (event.type === "set" && nextDate) {
            commitDate(nextDate);
          }
        },
      });
      return;
    }

    // iOS: inicializa o draft com o valor atual antes de abrir
    setDraftDate(selectedDate);
    setIsIosPickerOpen(true);
  }

  return (
    <View>
      <Pressable
        onPress={openPicker}
        className="border-surface-tertiary flex-row items-center justify-between border-b-2 pb-2"
      >
        <Text className="font-mono-medium text-foreground text-xl">
          {toDisplay(value)}
        </Text>
        <Calendar size={18} className="text-success" />
      </Pressable>

      <Modal
        visible={isIosPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsIosPickerOpen(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <Pressable
            className="flex-1"
            onPress={() => setIsIosPickerOpen(false)}
          />
          <View className="bg-background gap-3 rounded-t-3xl px-4 pt-4 pb-6">
            <View className="flex-row items-center justify-between">
              <Pressable onPress={() => setIsIosPickerOpen(false)} hitSlop={8}>
                <Text className="text-muted text-base font-medium">
                  Cancelar
                </Text>
              </Pressable>
              <Text className="text-foreground text-base font-semibold">
                Selecionar data
              </Text>
              <Pressable
                onPress={() => {
                  commitDate(draftDate);
                  setIsIosPickerOpen(false);
                }}
                hitSlop={8}
              >
                <Text className="text-success text-base font-semibold">
                  Confirmar
                </Text>
              </Pressable>
            </View>

            <DateTimePicker
              mode="date"
              display="spinner"
              value={draftDate}
              onChange={(_event, nextDate) => {
                if (nextDate) {
                  setDraftDate(nextDate);
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
