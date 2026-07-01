import { colorsForScheme } from "@/src/lib/designTokens";
import { formatMonthHeader } from "@/src/lib/date";
import { useDateStore } from "@/src/stores/useDateStore";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { Text, View, useColorScheme } from "react-native";

import { IconButton } from "../ui/IconButton";

interface MonthNavigatorProps {
  onPrev?: () => void;
  onNext?: () => void;
  disabled?: boolean;
  onCalendarPress?: () => void;
  isHidden?: boolean;
  onToggleHide?: () => void;
}

export function MonthNavigator({
  onPrev,
  onNext,
  disabled = false,
  onCalendarPress,
  isHidden = false,
  onToggleHide,
}: MonthNavigatorProps) {
  const { selectedYear, selectedMonth, goToPrevMonth, goToNextMonth } =
    useDateStore();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);
  const accentColor = colors.green;
  const navColor = colors.text;

  const handlePrev = onPrev ?? goToPrevMonth;
  const handleNext = onNext ?? goToNextMonth;

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {onCalendarPress ? (
        <IconButton
          Icon={Calendar}
          color={accentColor}
          size={18}
          onPress={onCalendarPress}
        />
      ) : (
        <View style={{ width: 18 }} />
      )}

      <View className="flex-row items-center gap-1">
        <IconButton
          Icon={ChevronLeft}
          color={navColor}
          onPress={handlePrev}
          disabled={disabled}
        />
        <Text className="text-foreground text-month px-2 font-semibold">
          {formatMonthHeader(selectedYear, selectedMonth)}
        </Text>
        <IconButton
          Icon={ChevronRight}
          color={navColor}
          onPress={handleNext}
          disabled={disabled}
        />
      </View>

      {onToggleHide ? (
        <IconButton
          Icon={isHidden ? EyeOff : Eye}
          color={accentColor}
          size={18}
          onPress={onToggleHide}
        />
      ) : (
        <View style={{ width: 18 }} />
      )}
    </View>
  );
}
