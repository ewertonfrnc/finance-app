import { Redirect, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { LoaderCircle } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
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

// This screen always uses the deep green palette regardless of device theme.
const G = DS_COLORS.dark;
const BUTTON = DS_COLORS.light.bg;
const BG = G.greenDeep;
const INK = G.text;
const INK_MUTED = G.mute;

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

  const hasCredentials = Boolean(name && email && password);
  const firstName = name.trim().split(/\s+/)[0];
  const rawBalanceValue = initialBalance === 0 ? "" : String(initialBalance);

  function handleChangeText(text: string) {
    const digits = text.replace(/\D/g, "");
    setInitialBalance(digits ? parseInt(digits, 10) : 0);
  }

  function handleConcluir() {
    if (!hasCredentials || isPending) return;

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

  if (!hasCredentials) {
    return <Redirect href="/(onboarding)/cadastro" />;
  }

  return (
    <Screen style={{ backgroundColor: BG }} className="px-6">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 pt-10">
          <Text
            style={{ color: G.green }}
            className="mb-2 text-xs font-medium tracking-widest uppercase"
          >
            Oi, {firstName}
          </Text>

          <Text
            style={{ color: INK }}
            className="mb-10 text-2xl leading-snug font-semibold"
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
            <View style={{ backgroundColor: G.green }} className="mt-2 h-0.5" />
            <TextInput
              ref={inputRef}
              value={rawBalanceValue}
              onChangeText={handleChangeText}
              keyboardType="number-pad"
              caretHidden
              selection={{
                start: rawBalanceValue.length,
                end: rawBalanceValue.length,
              }}
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
            Reserva, investimentos e poupança ficam de fora — esses a gente
            lança como economias depois.
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
            style={{ backgroundColor: BUTTON }}
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
      </KeyboardAvoidingView>
    </Screen>
  );
}
