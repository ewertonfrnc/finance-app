import { useRouter } from "expo-router";
import { useCallback } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { BalanceSummaryHeader } from "@/src/components/balance/BalanceSummaryHeader";
import { DayList } from "@/src/components/balance/DayList";
import { useHorizontalSwipe } from "@/src/components/gestures/useHorizontalSwipe";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { Screen } from "@/src/components/ui/Screen";
import { useDailyBalances } from "@/src/features/saldos/hooks/useDailyBalances";
import { useMonthSummary } from "@/src/features/saldos/hooks/useMonthSummary";
import { useDateStore } from "@/src/stores/useDateStore";

export default function SaldosScreen() {
  const { selectedYear, selectedMonth, goToPrevMonth, goToNextMonth } =
    useDateStore();
  const { data: dailyBalances } = useDailyBalances(selectedYear, selectedMonth);
  const { data: summary } = useMonthSummary(selectedYear, selectedMonth);
  const router = useRouter();
  const {
    animatedContentStyle,
    isTransitioning,
    pointerEvents,
    startTransition,
    swipeGesture,
  } = useHorizontalSwipe({
    resetKey: `${selectedYear}-${selectedMonth}`,
    onSwipePrev: goToPrevMonth,
    onSwipeNext: goToNextMonth,
  });

  function navigateToPrevMonth() {
    startTransition(goToPrevMonth);
  }

  function navigateToNextMonth() {
    startTransition(goToNextMonth);
  }

  const handleDayPress = useCallback(
    (date: string) => {
      if (isTransitioning) return;
      router.push(`/day/${date}`);
    },
    [isTransitioning, router],
  );

  return (
    <Screen>
      <MonthNavigator
        onPrev={navigateToPrevMonth}
        onNext={navigateToNextMonth}
        disabled={isTransitioning}
      />
      <BalanceSummaryHeader summary={summary} />

      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          className="flex-1"
          style={animatedContentStyle}
          pointerEvents={pointerEvents}
        >
          <DayList days={dailyBalances} onDayPress={handleDayPress} />
        </Animated.View>
      </GestureDetector>
    </Screen>
  );
}
