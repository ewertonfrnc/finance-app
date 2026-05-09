import { formatMonthHeader } from "@/src/lib/date";
import { useDateStore } from "@/src/stores/useDateStore";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View, useColorScheme } from "react-native";

export function MonthNavigator() {
  const { selectedYear, selectedMonth, goToPrevMonth, goToNextMonth } =
    useDateStore();
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Pressable
        onPress={goToPrevMonth}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronLeft size={20} color={mutedColor} />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <Calendar size={16} color={mutedColor} />
        <Text className="text-foreground text-base font-semibold">
          {formatMonthHeader(selectedYear, selectedMonth)}
        </Text>
      </View>

      <Pressable
        onPress={goToNextMonth}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronRight size={20} color={mutedColor} />
      </Pressable>
    </View>
  );
}
