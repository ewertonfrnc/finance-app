import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { DayList } from "@/src/components/balance/DayList";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { Screen } from "@/src/components/ui/Screen";
import { useDailyBalances } from "@/src/features/saldos/hooks/useDailyBalances";
import { usePrefetchAdjacentBalances } from "@/src/features/saldos/hooks/usePrefetchAdjacentBalances";
import { useTabIndicator } from "@/src/features/saldos/hooks/useTabIndicator";
import { DAY_FILTER_OPTIONS } from "@/src/features/transactions/constants";
import { useDateStore } from "@/src/stores/useDateStore";
import { usePrivacyStore } from "@/src/stores/usePrivacyStore";

function useMonthFade(resetKey: string) {
  const opacity = useSharedValue(1);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setBlocked(true);
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 120 }, () => {
      scheduleOnRN(setBlocked, false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const pointerEvents: "none" | "auto" = blocked ? "none" : "auto";
  return { style, pointerEvents, blocked };
}

export default function SaldosScreen() {
  const {
    selectedYear,
    selectedMonth,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useDateStore();
  const { data: dailyBalances, isFetching, isPlaceholder } = useDailyBalances(
    selectedYear,
    selectedMonth,
  );
  usePrefetchAdjacentBalances(selectedYear, selectedMonth);
  const router = useRouter();
  const {
    activeIndex: filterIndex,
    indicatorStyle,
    selectTab,
    onTabLayout,
  } = useTabIndicator();
  const filter = DAY_FILTER_OPTIONS[filterIndex];

  const { hideValues, toggleHideValues } = usePrivacyStore();

  const {
    style: fadeStyle,
    pointerEvents,
    blocked,
  } = useMonthFade(`${selectedYear}-${selectedMonth}`);

  const handleDayPress = useCallback(
    (date: string) => {
      router.push(`/day/${date}`);
    },
    [router],
  );

  const handleDayLongPress = useCallback(
    (date: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({ pathname: "/transaction/new", params: { date } });
    },
    [router],
  );

  return (
    <Screen>
      <MonthNavigator
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        onCalendarPress={goToCurrentMonth}
        disabled={blocked}
        isHidden={hideValues}
        onToggleHide={toggleHideValues}
      />
      <View className="border-surface-secondary flex-row justify-between border-b px-4 pt-2">
        <Animated.View
          style={indicatorStyle}
          className="bg-accent absolute bottom-0 left-0 h-0.5"
        />
        {DAY_FILTER_OPTIONS.map((opt, index) => (
          <Pressable
            key={opt.label}
            onPress={() => selectTab(index)}
            className="items-center pb-1"
            onLayout={(e) => onTabLayout(index, e)}
          >
            <Text
              className={`text-sm font-medium ${filterIndex === index ? "text-accent" : "text-muted"}`}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Animated.View
        className="flex-1"
        style={fadeStyle}
        pointerEvents={pointerEvents}
      >
        <DayList
          days={dailyBalances}
          filter={filter.value}
          onDayPress={handleDayPress}
          onDayLongPress={handleDayLongPress}
          isFetching={isFetching}
          isPlaceholder={isPlaceholder}
        />
      </Animated.View>
    </Screen>
  );
}
