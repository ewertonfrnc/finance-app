import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/src/stores/useAuthStore";

export default function MenuScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.replace("/(onboarding)");
  }

  return (
    <View
      className="bg-background flex-1 px-6"
      style={{ paddingTop: top, paddingBottom: bottom + 16 }}
    >
      <View className="flex-1" />

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center gap-3 py-4"
      >
        <LogOut size={18} color="#D64E45" strokeWidth={2} />
        <Text className="text-danger text-base font-medium">Sair da conta</Text>
      </Pressable>
    </View>
  );
}
