import { formatDayHeader, formatWeekdayLong } from "@/src/lib/date";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react-native";
import { Text, View, useColorScheme } from "react-native";

import { colorsForScheme } from "@/src/lib/designTokens";
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
  const colors = colorsForScheme(scheme);
  const navColor = colors.text;
  const accentColor = colors.green;

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <IconButton Icon={ArrowLeft} color={navColor} onPress={onBack} />

      <View className="flex-row items-center gap-1">
        <IconButton Icon={ChevronLeft} color={navColor} onPress={onPrev} />

        <View className="items-center px-2">
          <Text className="text-foreground text-month font-semibold">
            {formatDayHeader(date)}
          </Text>
          <Text className="text-muted text-body-small">
            {formatWeekdayLong(date)}
          </Text>
        </View>

        <IconButton Icon={ChevronRight} color={navColor} onPress={onNext} />
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
