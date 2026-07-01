import { Chip } from "heroui-native";
import { ScrollView } from "react-native";

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

        return (
          <Chip
            key={option.value}
            onPress={() => onChange(option.value)}
            variant={active ? "soft" : "secondary"}
            color={active ? "accent" : "default"}
            size="md"
          >
            <Chip.Label className="text-xs font-medium">
              {option.label}
            </Chip.Label>
          </Chip>
        );
      })}
    </ScrollView>
  );
}
