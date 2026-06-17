import { Text, View } from "react-native";

import type { MonthSummary } from "@/src/features/transactions/types";
import { usePrivacyStore } from "@/src/stores/usePrivacyStore";
import { CurrencyText } from "../ui/CurrencyText";

interface BalanceSummaryHeaderProps {
  summary: MonthSummary;
}

export function BalanceSummaryHeader({ summary }: BalanceSummaryHeaderProps) {
  const hideValues = usePrivacyStore((s) => s.hideValues);

  return (
    <View className="px-4 pt-3 pb-4">
      <View className="flex-row items-end justify-between gap-4">
        <View className="flex-1">
          <Text className="text-muted text-label mb-1 font-semibold tracking-widest uppercase">
            Saldo · hoje
          </Text>
          {hideValues ? (
            <Text className="text-accent font-mono-semibold text-balance-highlight">
              ••••
            </Text>
          ) : (
            <CurrencyText
              value={summary.currentBalance}
              variant="large"
              className={summary.currentBalance >= 0 ? "text-accent" : undefined}
            />
          )}
        </View>

        <View className="items-end">
          <Text className="text-muted text-label mb-1 font-semibold tracking-widest uppercase">
            Pico / Vale
          </Text>
          {hideValues ? (
            <Text className="text-muted font-mono-medium text-sm">••••</Text>
          ) : (
            <>
              <CurrencyText value={summary.peak} variant="small" sign="neutral" />
              <CurrencyText
                value={summary.valley}
                variant="small"
                sign="neutral"
                className="text-muted"
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
}
