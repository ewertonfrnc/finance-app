import { useRouter } from "expo-router";
import { useCallback } from "react";

import { BalanceSummaryHeader } from "@/src/components/balance/BalanceSummaryHeader";
import { DayList } from "@/src/components/balance/DayList";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { Screen } from "@/src/components/ui/Screen";
import { useDailyBalances } from "@/src/features/saldos/hooks/useDailyBalances";
import { useMonthSummary } from "@/src/features/saldos/hooks/useMonthSummary";
import { useDateStore } from "@/src/stores/useDateStore";

export default function SaldosScreen() {
  const { selectedYear, selectedMonth } = useDateStore();
  const { data: dailyBalances } = useDailyBalances(selectedYear, selectedMonth);
  const { data: summary } = useMonthSummary(selectedYear, selectedMonth);
  const router = useRouter();

  const handleDayPress = useCallback(
    (date: string) => {
      router.push(`/day/${date}`);
    },
    [router],
  );

  return (
    <Screen>
      <MonthNavigator />
      <BalanceSummaryHeader summary={summary} />

      <DayList days={dailyBalances} onDayPress={handleDayPress} />
    </Screen>
  );
}
