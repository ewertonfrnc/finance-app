import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { DayList } from "@/src/components/balance/DayList";
import { useHorizontalSwipe } from "@/src/components/gestures/useHorizontalSwipe";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { Screen } from "@/src/components/ui/Screen";
import { useDailyBalances } from "@/src/features/saldos/hooks/useDailyBalances";
import { usePrefetchAdjacentBalances } from "@/src/features/saldos/hooks/usePrefetchAdjacentBalances";
import { useTabIndicator } from "@/src/features/saldos/hooks/useTabIndicator";
import { DAY_FILTER_OPTIONS } from "@/src/features/transactions/constants";
import { useDateStore } from "@/src/stores/useDateStore";

export default function SaldosScreen() {
  const {
    selectedYear,
    selectedMonth,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useDateStore();
  const { data: dailyBalances } = useDailyBalances(selectedYear, selectedMonth);
  usePrefetchAdjacentBalances(selectedYear, selectedMonth);
  const router = useRouter();
  const {
    activeIndex: filterIndex,
    indicatorStyle,
    selectTab,
    onTabLayout,
  } = useTabIndicator();
  const filter = DAY_FILTER_OPTIONS[filterIndex];

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

  const handleDayPress = useCallback(
    (date: string) => {
      if (isTransitioning) return;
      router.push(`/day/${date}`);
    },
    [isTransitioning, router],
  );

  const handleDayLongPress = useCallback(
    (date: string) => {
      if (isTransitioning) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({ pathname: "/transaction/new", params: { date } });
    },
    [isTransitioning, router],
  );

  return (
    <Screen>
      <MonthNavigator
        onPrev={() => startTransition(goToPrevMonth, "prev")}
        onNext={() => startTransition(goToNextMonth, "next")}
        onCalendarPress={goToCurrentMonth}
        disabled={isTransitioning}
      />
      <View className="border-surface-secondary flex-row justify-between border-b px-4 pt-2">
        <Animated.View
          style={indicatorStyle}
          className="bg-foreground absolute bottom-0 left-0 h-0.5"
        />
        {DAY_FILTER_OPTIONS.map((opt, index) => (
          <Pressable
            key={opt.label}
            onPress={() => selectTab(index)}
            className="items-center pb-1"
            onLayout={(e) => onTabLayout(index, e)}
          >
            <Text
              className={`text-sm font-medium ${filterIndex === index ? "text-foreground" : "text-muted"}`}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          className="flex-1"
          style={animatedContentStyle}
          pointerEvents={pointerEvents}
        >
          <DayList
            days={dailyBalances}
            filter={filter.value}
            onDayPress={handleDayPress}
            onDayLongPress={handleDayLongPress}
            isTransitioning={isTransitioning}
          />
        </Animated.View>
      </GestureDetector>
    </Screen>
  );
}
