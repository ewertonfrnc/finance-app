import { formatDayHeader, formatWeekdayLong } from "@/src/lib/date";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";
import { Pressable, Text, View, useColorScheme } from "react-native";

interface DayNavigatorProps {
  date: string; // "2026-05-05"
  onPrev: () => void;
  onNext: () => void;
  onAdd: () => void;
}

export function DayNavigator({ date, onPrev, onNext, onAdd }: DayNavigatorProps) {
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";
  const accentColor = scheme === "dark" ? "#5ab87a" : "#1e3d2b";

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Pressable
        onPress={onPrev}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronLeft size={20} color={mutedColor} />
      </Pressable>

      <View className="flex-1 items-center">
        <Text className="text-foreground text-base font-semibold">
          {formatDayHeader(date)}
        </Text>
        <Text className="text-muted text-xs">
          {formatWeekdayLong(date)}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onNext}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronRight size={20} color={mutedColor} />
        </Pressable>

        <Pressable
          onPress={onAdd}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Plus size={22} color={accentColor} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
