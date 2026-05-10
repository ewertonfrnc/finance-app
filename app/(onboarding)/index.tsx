import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboardingStore } from "@/src/stores/useOnboardingStore";

export default function WelcomeScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const reset = useOnboardingStore((s) => s.reset);

  function handleCalcular() {
    reset();
    router.push("/(onboarding)/comida");
  }

  function handleJaSei() {
    reset();
    router.push("/(onboarding)/cadastro");
  }

  return (
    <View className="bg-background flex-1 px-6" style={{ paddingTop: top }}>
      <View className="flex-1 justify-center">
        <View className="mb-8 flex-row items-center gap-2">
          <View className="bg-success h-2.5 w-2.5 rounded-full" />
          <Text className="text-foreground text-xs font-medium tracking-widest uppercase">
            diário
          </Text>
        </View>

        <Text className="text-foreground mb-5 text-4xl leading-tight font-semibold">
          O quanto{"\n"}você pode{"\n"}gastar hoje?
        </Text>

        <Text className="text-muted text-base leading-relaxed">
          Sem categorias intermináveis. Sem planilha.{"\n"}Um número simples por
          dia, e o saldo do{"\n"}mês cuidando de você.
        </Text>
      </View>

      <View style={{ paddingBottom: bottom + 16 }} className="gap-3">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-foreground items-center rounded-xl py-4"
          onPress={handleCalcular}
        >
          <Text className="text-background text-base font-semibold">
            Calcular meu diário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-surface-secondary items-center rounded-xl py-4"
          onPress={handleJaSei}
        >
          <Text className="text-foreground text-base font-semibold">
            Já sei meu diário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center py-2"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-muted text-sm underline">
            Já tenho cadastro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
