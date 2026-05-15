import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { DAY_FILTER_OPTIONS, DayList } from "@/src/components/balance/DayList";
import { useHorizontalSwipe } from "@/src/components/gestures/useHorizontalSwipe";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { Screen } from "@/src/components/ui/Screen";
import { useDailyBalances } from "@/src/features/saldos/hooks/useDailyBalances";
import { useMonthSummary } from "@/src/features/saldos/hooks/useMonthSummary";
import { SPRING } from "@/src/lib/animations";
import { useDateStore } from "@/src/stores/useDateStore";

export default function SaldosScreen() {
  const { selectedYear, selectedMonth, goToPrevMonth, goToNextMonth } =
    useDateStore();
  const { data: dailyBalances } = useDailyBalances(selectedYear, selectedMonth);
  const { data: summary } = useMonthSummary(selectedYear, selectedMonth);
  const router = useRouter();
  const [filterIndex, setFilterIndex] = useState(0);
  const filter = DAY_FILTER_OPTIONS[filterIndex];

  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  const tabInitialized = useRef(false);
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  function selectFilter(index: number) {
    setFilterIndex(index);
    const layout = tabLayouts.current[index];
    if (!layout) return;
    indicatorX.value = withSpring(layout.x, SPRING);
    indicatorW.value = withSpring(layout.width, SPRING);
  }

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
      {/* <BalanceSummaryHeader summary={summary} /> */}

      <View className="border-surface-secondary flex-row justify-between border-b px-4 pt-2">
        <Animated.View
          style={indicatorStyle}
          className="bg-foreground absolute bottom-0 left-0 h-0.5"
        />
        {DAY_FILTER_OPTIONS.map((opt, index) => (
          <Pressable
            key={opt.label}
            onPress={() => selectFilter(index)}
            className="items-center pb-1"
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              tabLayouts.current[index] = { x, width };
              if (!tabInitialized.current && index === filterIndex) {
                indicatorX.value = x;
                indicatorW.value = width;
                tabInitialized.current = true;
              }
            }}
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
          />
        </Animated.View>
      </GestureDetector>
    </Screen>
  );
}
