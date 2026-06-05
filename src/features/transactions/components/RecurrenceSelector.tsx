import { Repeat } from "lucide-react-native";
import { Pressable, ScrollView, Text } from "react-native";

import type { RecurrenceType } from "@/src/features/transactions/types";

interface RecurrenceSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
}

const OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "Não repete" },
  { value: "monthly", label: "Todo mês" },
  { value: "weekly", label: "Toda semana" },
  { value: "daily", label: "Todo dia" },
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
            className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
              active
                ? "bg-ds-green-tint border border-ds-hair-strong"
                : "bg-surface border border-surface-tertiary"
            }`}
          >
            {showIcon && (
              <Repeat
                size={12}
                className={active ? "text-ds-green" : "text-muted/70"}
              />
            )}
            <Text
              className={`text-xs font-medium ${
                active ? "text-ds-green" : "text-muted"
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
