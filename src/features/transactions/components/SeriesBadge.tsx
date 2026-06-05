import { Text, View } from "react-native";

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
  const endText = endDate ? ` Termina em ${formatFullDate(endDate)}.` : "";

  return (
    <View className="bg-ds-green-tint rounded-card flex-row items-start gap-3 px-4 py-4">
      <Text className="text-ds-green text-body-small flex-1 font-medium">
        <Text className="font-bold">Lançamento recorrente</Text>
        {endText} Ao salvar você escolhe se vale só pra este, pros próximos ou
        pra série inteira.
      </Text>
    </View>
  );
}
