import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { LoaderCircle } from "lucide-react-native";
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
import { DS_COLORS } from "@/src/lib/designTokens";
import { useOnboardingStore } from "@/src/stores/useOnboardingStore";

// This screen always uses the dark greenDeep palette regardless of device theme.
const G = DS_COLORS.light;
const BG = G.greenDeep;
const INK = "#ffffff";
const INK_MUTED = "rgba(255,255,255,0.55)";

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
    <Screen style={{ backgroundColor: BG }} className="px-6">
      <View className="flex-1 pt-10">
        <Text
          style={{ color: INK_MUTED }}
          className="mb-2 text-xs font-medium tracking-widest uppercase"
        >
          Oi, {firstName}
        </Text>

        <Text
          style={{ color: INK }}
          className="mb-10 text-2xl font-semibold leading-snug"
        >
          E aí, quanto tem na conta nesse exato momento?
        </Text>

        <Text
          style={{ color: INK_MUTED }}
          className="mb-4 text-xs font-medium tracking-widest uppercase"
        >
          Saldo Atual
        </Text>

        {/* Currency input manual para fundo escuro */}
        <Pressable onPress={() => inputRef.current?.focus()}>
          <Animated.Text
            style={[animatedStyle, { color: INK }]}
            className="font-mono-semibold text-balance-highlight"
          >
            {formatBRL(initialBalance)}
          </Animated.Text>
          <View
            style={{ backgroundColor: "rgba(255,255,255,0.30)" }}
            className="mt-2 h-0.5"
          />
          <TextInput
            ref={inputRef}
            value={String(initialBalance)}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            caretHidden
            style={{ height: 0, width: 0, opacity: 0 }}
          />
        </Pressable>

        <Text
          style={{ color: INK_MUTED }}
          className="mt-8 text-sm leading-relaxed"
        >
          Olha pra sua conta corrente do dia a dia. Aquela onde caem salários,
          sai aluguel, mercado, gasolina.
          {"\n\n"}
          Reserva, investimentos e poupança ficam de fora — esses a gente lança
          como economias depois.
          {"\n\n"}
          No vermelho? Coloca 0 e a gente lança a saída em seguida.
        </Text>

        {error && (
          <View
            style={{ backgroundColor: G.redSoftBg }}
            className="mt-5 rounded-xl px-4 py-3"
          >
            <Text style={{ color: G.redSoftText }} className="text-sm">
              {error.message}
            </Text>
          </View>
        )}
      </View>

      <View className="pb-4">
        <Button
          onPress={handleConcluir}
          isIconOnly={isPending}
          isDisabled={isPending}
          style={{ backgroundColor: INK }}
          className="h-14 rounded-4xl"
        >
          <Button.Label>
            {isPending ? (
              <Animated.View style={spinStyle}>
                <LoaderCircle color={BG} size={20} />
              </Animated.View>
            ) : (
              <Text style={{ color: BG }} className="font-semibold">
                Concluir
              </Text>
            )}
          </Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
