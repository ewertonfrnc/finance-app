import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function MenuScreen() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.replace("/(onboarding)");
  }

  return (
    <Screen className="px-6 pb-4">
      <View className="flex-1" />

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center gap-3 py-4"
      >
        <LogOut size={18} color="#D64E45" strokeWidth={2} />
        <Text className="text-danger text-base font-medium">Sair da conta</Text>
      </Pressable>
    </Screen>
  );
}
