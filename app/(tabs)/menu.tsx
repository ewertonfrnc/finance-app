import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Pressable, Text, View, useColorScheme } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { colorsForScheme } from "@/src/lib/designTokens";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function MenuScreen() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);

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
        <LogOut size={18} color={c.red} strokeWidth={2} />
        <Text className="text-danger text-base font-medium">Sair da conta</Text>
      </Pressable>
    </Screen>
  );
}
