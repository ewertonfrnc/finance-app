import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Tabs } from "heroui-native";
import { useCallback, useEffect, useState } from "react";
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
import { DAY_FILTER_OPTIONS } from "@/src/features/transactions/constants";
import { useDateStore } from "@/src/stores/useDateStore";
import { usePrivacyStore } from "@/src/stores/usePrivacyStore";

const ALL_FILTER_VALUE = "todas";

function getFilterTabValue(index: number) {
  return DAY_FILTER_OPTIONS[index]?.value ?? ALL_FILTER_VALUE;
}

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
  const {
    data: dailyBalances,
    isFetching,
    isPlaceholder,
  } = useDailyBalances(selectedYear, selectedMonth);
  usePrefetchAdjacentBalances(selectedYear, selectedMonth);
  const router = useRouter();
  const [filterTabValue, setFilterTabValue] = useState(() =>
    getFilterTabValue(0),
  );
  const filter =
    DAY_FILTER_OPTIONS.find(
      (opt) => (opt.value ?? ALL_FILTER_VALUE) === filterTabValue,
    ) ?? DAY_FILTER_OPTIONS[0];

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
    <Screen className="bg-background">
      <MonthNavigator
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        onCalendarPress={goToCurrentMonth}
        disabled={blocked}
        isHidden={hideValues}
        onToggleHide={toggleHideValues}
      />

      {/* <BalanceSummaryHeader summary={monthSummary} /> */}

      <Tabs
        value={filterTabValue}
        onValueChange={setFilterTabValue}
        variant="secondary"
        className="border-separator border-b px-4 pt-2"
      >
        <Tabs.List className="w-full justify-between border-b-0">
          <Tabs.Indicator className="border-accent" />
          {DAY_FILTER_OPTIONS.map((opt, index) => (
            <Tabs.Trigger
              key={opt.label}
              value={getFilterTabValue(index)}
              className="px-0 pt-0 pb-1"
            >
              <Tabs.Label className="text-sm font-medium">
                {opt.label}
              </Tabs.Label>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>

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
