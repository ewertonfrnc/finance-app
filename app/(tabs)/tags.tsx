import { Text, View } from "react-native";

export default function TagsScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground text-lg font-semibold">Tags</Text>
      </View>
    </View>
  );
}
