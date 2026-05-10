import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { loginSchema } from "@/src/features/auth/schemas";

export default function LoginScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
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

  return (
    <KeyboardAvoidingView className="bg-background flex-1" behavior="padding">
      <ScrollView
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: top + 40, paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="mb-10">
          <Text className="text-muted mb-2 text-xs font-medium tracking-widest uppercase">
            Bem-vindo de volta
          </Text>
          <Text className="text-foreground text-2xl font-semibold">
            Entra na sua conta.
          </Text>
        </View>

        {/* Campos */}
        <View className="gap-8">
          <View className="gap-2">
            <Text className="text-muted text-xs font-semibold tracking-widest uppercase">
              E-mail
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              className={`text-foreground border-b-2 py-2 text-base ${
                emailError ? "border-danger" : "border-surface-tertiary"
              }`}
            />
            {emailError && (
              <Text className="text-danger text-xs">{emailError}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-muted text-xs font-semibold tracking-widest uppercase">
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
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                className="text-foreground flex-1 py-2 text-base"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#9ca3af" />
                ) : (
                  <Eye size={18} color="#9ca3af" />
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
      <View className="gap-3 px-6" style={{ paddingBottom: bottom + 16 }}>
        <Pressable
          onPress={handleSubmit}
          disabled={isPending}
          className={`items-center rounded-xl py-4 ${
            (!submitted || isValid) && !isPending
              ? "bg-foreground"
              : "bg-surface-tertiary"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              (!submitted || isValid) && !isPending
                ? "text-background"
                : "text-muted"
            }`}
          >
            {isPending ? "Entrando..." : "Entrar"}
          </Text>
        </Pressable>

        <Pressable
          className="items-center py-2"
          onPress={() => router.replace("/(onboarding)")}
        >
          <Text className="text-muted text-sm">
            Não tem conta?{" "}
            <Text className="text-foreground font-medium underline">
              Criar conta
            </Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
