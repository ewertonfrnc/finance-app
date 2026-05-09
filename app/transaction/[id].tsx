import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="text-foreground text-lg font-semibold">
          Editar Transação
        </Text>
        <Text className="text-muted">{id}</Text>
      </View>
    </View>
  );
}
