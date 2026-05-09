import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NewTransactionScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-foreground text-lg font-semibold">
          Nova Transação
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-accent font-medium">Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
