import { formatDayHeader, formatWeekdayLong } from "@/src/lib/date";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react-native";
import { Text, View, useColorScheme } from "react-native";

import { IconButton } from "../ui/IconButton";

interface DayNavigatorProps {
  date: string; // "2026-05-05"
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  onAdd: () => void;
}

export function DayNavigator({
  date,
  onBack,
  onPrev,
  onNext,
  onAdd,
}: DayNavigatorProps) {
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";
  const accentColor = scheme === "dark" ? "#5ab87a" : "#1e3d2b";

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <IconButton Icon={ArrowLeft} color={mutedColor} onPress={onBack} />

      <View className="flex-row items-center gap-1">
        <IconButton Icon={ChevronLeft} color={mutedColor} onPress={onPrev} />

        <View className="items-center px-2">
          <Text className="text-foreground text-month font-semibold">
            {formatDayHeader(date)}
          </Text>
          <Text className="text-muted text-body-small">
            {formatWeekdayLong(date)}
          </Text>
        </View>

        <IconButton Icon={ChevronRight} color={mutedColor} onPress={onNext} />
      </View>

      <IconButton
        Icon={Plus}
        color={accentColor}
        size={22}
        strokeWidth={2.5}
        onPress={onAdd}
      />
    </View>
  );
}
