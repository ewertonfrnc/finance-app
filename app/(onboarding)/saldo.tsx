import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Screen } from "@/src/components/ui/Screen";
import { useRegister } from "@/src/features/auth/hooks/useRegister";
import { useSpinAnimation } from "@/src/lib/animations";
import { formatBRL } from "@/src/lib/currency";
import { useOnboardingStore } from "@/src/stores/useOnboardingStore";
import { Button } from "heroui-native";
import { LoaderCircle } from "lucide-react-native";

export default function SaldoScreen() {
  const router = useRouter();

  const { name, email, password, categories, daysPerMonth, reset } =
    useOnboardingStore();
  const { mutate: register, isPending, error } = useRegister();

  const [initialBalance, setInitialBalance] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const opacity = useSharedValue(0.35);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const spinStyle = useSpinAnimation(isPending);

  useEffect(() => {
    opacity.value = withTiming(initialBalance === 0 ? 0.35 : 1, {
      duration: 200,
    });
  }, [initialBalance, opacity]);

  const firstName = name.split(" ")[0];

  function handleChangeText(text: string) {
    const digits = text.replace(/\D/g, "");
    setInitialBalance(digits ? parseInt(digits, 10) : 0);
  }

  function handleConcluir() {
    const registerPayload = {
      name,
      email,
      password,
      initialBalance,
      daysPerMonth,
      categories,
    };

    register(registerPayload, {
      onSuccess: () => {
        reset();
        router.replace("/(tabs)");
      },
    });
  }

  return (
    <Screen className="bg-accent px-6">
      <View className="flex-1 pt-10">
        <Text className="text-accent-foreground/60 mb-2 text-xs font-medium tracking-widest uppercase">
          Oi, {firstName}
        </Text>

        <Text className="text-accent-foreground mb-10 text-2xl leading-snug font-semibold">
          E aí, quanto tem na conta nesse exato momento?
        </Text>

        <Text className="text-accent-foreground/60 mb-4 text-xs font-medium tracking-widest uppercase">
          Saldo Atual
        </Text>

        {/* Currency input manual para fundo escuro */}
        <Pressable onPress={() => inputRef.current?.focus()}>
          <Animated.Text
            style={animatedStyle}
            className="text-accent-foreground font-mono-medium text-5xl"
          >
            {formatBRL(initialBalance)}
          </Animated.Text>
          <View className="bg-accent-foreground/30 mt-2 h-0.5" />
          <TextInput
            ref={inputRef}
            value={String(initialBalance)}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            caretHidden
            style={{ height: 0, width: 0, opacity: 0 }}
          />
        </Pressable>

        <Text className="text-accent-foreground mt-8 text-sm leading-relaxed">
          Olha pra sua conta corrente do dia a dia. Aquela onde caem salários,
          sai aluguel, mercado, gasolina.
          {"\n\n"}
          Reserva, investimentos e poupança ficam de fora — esses a gente lança
          como economias depois.
          {"\n\n"}
          No vermelho? Coloca 0 e a gente lança a saída em seguida.
        </Text>

        {error && (
          <View className="bg-danger/20 mt-5 rounded-xl px-4 py-3">
            <Text className="text-danger text-sm">{error.message}</Text>
          </View>
        )}
      </View>

      <View className="pb-4">
        <Button
          onPress={handleConcluir}
          isIconOnly={isPending}
          isDisabled={isPending}
          className="bg-accent-foreground h-14 rounded-4xl"
        >
          <Button.Label>
            {isPending ? (
              <Animated.View style={spinStyle}>
                <LoaderCircle color="#000" size={20} />
              </Animated.View>
            ) : (
              <Text className="text-foreground font-semibold">Concluir</Text>
            )}
          </Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
