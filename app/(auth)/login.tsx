import { useRouter } from "expo-router";
import { Eye, EyeOff, LoaderCircle } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Animated from "react-native-reanimated";

import { Screen } from "@/src/components/ui/Screen";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { colorsForScheme } from "@/src/lib/designTokens";
import { loginSchema } from "@/src/features/auth/schemas";
import { useSpinAnimation } from "@/src/lib/animations";
import { Button } from "heroui-native";

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);
  const muteColor = colors.mute;
  const { mutate: login, isPending, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const parseResult = loginSchema.safeParse({ email, password });
  const isValid = parseResult.success;

  const invalidFields =
    submitted && !parseResult.success
      ? new Set(parseResult.error.issues.map((i) => i.path[0]))
      : new Set();

  const emailError = invalidFields.has("email") ? "E-mail inválido" : null;
  const passwordError = invalidFields.has("password")
    ? password.length === 0
      ? "Informe sua senha"
      : "Mínimo 8 caracteres"
    : null;

  function handleSubmit() {
    setSubmitted(true);
    if (!isValid || isPending) return;
    login(
      { email: email.trim().toLowerCase(), password },
      { onSuccess: () => router.replace("/(tabs)") },
    );
  }

  const spinStyle = useSpinAnimation(isPending);

  return (
    <Screen className="bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 32 }}
        >
          {/* Header */}
          <View className="mb-10">
            <Text className="text-accent text-label mb-2 font-semibold tracking-widest uppercase">
              Bem-vindo de volta
            </Text>
            <Text className="text-foreground text-heading font-bold">
              Entra na sua conta.
            </Text>
          </View>

          {/* Campos */}
          <View className="gap-8">
            <View className="gap-2">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                E-mail
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={muteColor}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                className={`text-foreground text-input border-b-2 py-2 font-medium ${
                  emailError ? "border-danger" : "border-surface-tertiary"
                }`}
              />
              {emailError && (
                <Text className="text-danger text-xs">{emailError}</Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                Senha
              </Text>
              <View
                className={`flex-row items-center border-b-2 ${
                  passwordError ? "border-danger" : "border-surface-tertiary"
                }`}
              >
                <TextInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Sua senha"
                  placeholderTextColor={muteColor}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  className="text-foreground text-input flex-1 py-2 font-medium"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={muteColor} />
                  ) : (
                    <Eye size={18} color={muteColor} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text className="text-danger text-xs">{passwordError}</Text>
              )}
            </View>
          </View>

          {error && (
            <View className="bg-danger/10 mt-8 rounded-xl px-4 py-3">
              <Text className="text-danger text-sm">{error.message}</Text>
            </View>
          )}
        </ScrollView>

        {/* Rodapé */}
        <View className="gap-3 px-6 pb-4">
          <Button
            onPress={handleSubmit}
            isIconOnly={isPending}
            isDisabled={isPending}
            className="bg-ds-canvas-bg h-14 rounded-4xl"
          >
            <Button.Label>
              {isPending ? (
                <Animated.View style={spinStyle}>
                  <LoaderCircle color={colors.text} size={20} />
                </Animated.View>
              ) : (
                <Text className="text-foreground font-semibold">Entrar</Text>
              )}
            </Button.Label>
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Button.Label className="text-muted text-sm">
              Esqueceu a senha?
            </Button.Label>
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.replace("/(onboarding)")}
          >
            <Button.Label className="text-muted text-sm">
              Não tem conta?{" "}
              <Text className="text-link font-medium underline">
                Criar conta
              </Text>
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
