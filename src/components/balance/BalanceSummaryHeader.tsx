import { Text, View } from "react-native";

import type { MonthSummary } from "@/src/features/transactions/types";
import { CurrencyText } from "../ui/CurrencyText";

interface BalanceSummaryHeaderProps {
  summary: MonthSummary;
}

export function BalanceSummaryHeader({ summary }: BalanceSummaryHeaderProps) {
  return (
    <View className="px-4 pt-2 pb-4">
      <Text className="text-muted text-xs font-medium uppercase mb-1">Saldo atual</Text>
      <CurrencyText value={summary.currentBalance} variant="large" />
      <View className="flex-row gap-6 mt-2">
        <View>
          <Text className="text-muted text-xs mb-0.5">Pico</Text>
          <CurrencyText value={summary.peak} variant="small" />
        </View>
        <View>
          <Text className="text-muted text-xs mb-0.5">Vale</Text>
          <CurrencyText value={summary.valley} variant="small" />
        </View>
      </View>
    </View>
  );
}
