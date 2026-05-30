import { Repeat } from "lucide-react-native";
import { Pressable, ScrollView, Text } from "react-native";

import type { RecurrenceType } from "@/src/features/transactions/types";

interface RecurrenceSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
}

const OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "Não repete" },
  { value: "daily", label: "Todo dia" },
  { value: "weekly", label: "Toda semana" },
  { value: "monthly", label: "Todo mês" },
  { value: "yearly", label: "Todo ano" },
];

export function RecurrenceSelector({
  value,
  onChange,
}: RecurrenceSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-2 pr-4"
    >
      {OPTIONS.map((option) => {
        const active = value === option.value;
        const showIcon = option.value !== "none";

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-2 ${
              active
                ? "bg-success/15 border border-success/40"
                : "bg-surface-secondary border border-transparent"
            }`}
          >
            {showIcon && (
              <Repeat
                size={13}
                className={active ? "text-success" : "text-muted"}
              />
            )}
            <Text
              className={`text-sm font-semibold ${
                active ? "text-success" : "text-foreground"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
