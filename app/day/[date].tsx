import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="text-foreground text-lg font-semibold">
          Detalhe do Dia
        </Text>
        <Text className="text-muted">{date}</Text>
      </View>
    </View>
  );
}
