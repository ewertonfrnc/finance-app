import { Text, View } from "react-native";

import type { MonthSummary } from "@/src/features/transactions/types";
import { CurrencyText } from "../ui/CurrencyText";

interface BalanceSummaryHeaderProps {
  summary: MonthSummary;
}

export function BalanceSummaryHeader({ summary }: BalanceSummaryHeaderProps) {
  return (
    <View className="px-4 pt-2 pb-4">
      <Text className="text-muted mb-1 text-xs font-medium uppercase">
        Saldo atual
      </Text>
      <CurrencyText value={summary.currentBalance} variant="large" />
      <View className="mt-2 flex-row gap-6">
        <View>
          <Text className="text-muted mb-0.5 text-xs">Pico</Text>
          <CurrencyText value={summary.peak} variant="small" />
        </View>
        <View>
          <Text className="text-muted mb-0.5 text-xs">Vale</Text>
          <CurrencyText value={summary.valley} variant="small" />
        </View>
      </View>
    </View>
  );
}
