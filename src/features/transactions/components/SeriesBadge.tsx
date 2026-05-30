import { Repeat } from "lucide-react-native";
import { Text, View } from "react-native";

import { formatRecurrenceLabel } from "@/src/features/transactions/constants";
import type { RecurrenceType } from "@/src/features/transactions/types";
import { formatFullDate } from "@/src/lib/date";

interface SeriesBadgeProps {
  recurrence: RecurrenceType;
  endDate?: string;
}

/**
 * Badge verde exibido no topo da edição quando a transação faz parte de uma série
 * recorrente. Dá o contexto ("é recorrente, termina em X") antes do usuário decidir
 * salvar/excluir e cair no ScopeSheet.
 */
export function SeriesBadge({ recurrence, endDate }: SeriesBadgeProps) {
  const label = formatRecurrenceLabel(recurrence);

  return (
    <View className="border-ds-hair-strong bg-ds-green-tint flex-row items-start gap-2 rounded-xl border px-3 py-2.5">
      <Repeat size={15} className="text-ds-green mt-0.5" />
      <View className="flex-1">
        <Text className="text-ds-green text-xs font-semibold">
          Lançamento recorrente{label ? ` · ${label}` : ""}
        </Text>
        <Text className="text-muted mt-0.5 text-xs">
          {endDate
            ? `A série termina em ${formatFullDate(endDate)}. Ao salvar ou excluir você escolhe o alcance.`
            : "Ao salvar ou excluir você escolhe o alcance."}
        </Text>
      </View>
    </View>
  );
}
