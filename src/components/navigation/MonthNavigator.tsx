import { formatMonthHeader } from "@/src/lib/date";
import { useDateStore } from "@/src/stores/useDateStore";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { Pressable, Text, View, useColorScheme } from "react-native";

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
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";

  const handlePrev = onPrev ?? goToPrevMonth;
  const handleNext = onNext ?? goToNextMonth;

  if (onCalendarPress) {
    return (
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={onCalendarPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Calendar size={18} color={mutedColor} />
        </Pressable>

        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={handlePrev}
            disabled={disabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={20} color={mutedColor} />
          </Pressable>
          <Text className="text-foreground text-month px-2 font-semibold">
            {formatMonthHeader(selectedYear, selectedMonth)}
          </Text>
          <Pressable
            onPress={handleNext}
            disabled={disabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronRight size={20} color={mutedColor} />
          </Pressable>
        </View>

        {onToggleHide ? (
          <Pressable
            onPress={onToggleHide}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isHidden ? (
              <EyeOff size={18} color={mutedColor} />
            ) : (
              <Eye size={18} color={mutedColor} />
            )}
          </Pressable>
        ) : (
          <View style={{ width: 18 }} />
        )}
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Pressable
        onPress={handlePrev}
        disabled={disabled}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronLeft size={20} color={mutedColor} />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <Calendar size={16} color={mutedColor} />
        <Text className="text-foreground text-month font-semibold">
          {formatMonthHeader(selectedYear, selectedMonth)}
        </Text>
      </View>

      <Pressable
        onPress={handleNext}
        disabled={disabled}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronRight size={20} color={mutedColor} />
      </Pressable>
    </View>
  );
}
