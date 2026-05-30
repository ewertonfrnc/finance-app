import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { useOnboardingStore } from "@/src/stores/useOnboardingStore";
import { Button } from "heroui-native";

export default function WelcomeScreen() {
  const router = useRouter();
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
    <Screen className="bg-background flex-1 px-6">
      <View className="flex-1 justify-center">
        <View className="mb-8 flex-row items-center gap-2">
          <View className="bg-success h-2.5 w-2.5 rounded-full" />
          <Text className="text-foreground text-step font-semibold tracking-widest uppercase">
            diário
          </Text>
        </View>

        <Text className="text-foreground text-hero mb-5 font-bold">
          O quanto{"\n"}você pode{"\n"}gastar hoje?
        </Text>

        <Text className="text-muted text-[15px] leading-relaxed">
          Sem categorias intermináveis. Sem planilha.{"\n"}Um número simples por
          dia, e o saldo do{"\n"}mês cuidando de você.
        </Text>
      </View>

      <View className="gap-3">
        <Button
          onPress={handleCalcular}
          className="bg-foreground h-14 rounded-4xl"
        >
          <Button.Label className="text-background text-base font-semibold">
            Calcular meu diário
          </Button.Label>
        </Button>

        <Button
          variant="secondary"
          onPress={handleJaSei}
          className="h-14 rounded-4xl"
        >
          <Button.Label className="text-foreground text-base font-semibold">
            Já sei meu diário
          </Button.Label>
        </Button>

        <Button
          variant="ghost"
          onPress={() => router.push("/(auth)/login")}
          className="h-14 rounded-4xl"
        >
          <Button.Label className="text-muted text-sm underline">
            Já tenho cadastro
          </Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
