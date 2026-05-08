import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 p-6">
        <Text className="text-2xl font-semibold">Hello, world!</Text>
      </View>
    </SafeAreaView>
  );
}
