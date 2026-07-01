import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Eye, EyeOff } from "lucide-react-native";
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

import { Screen } from "@/src/components/ui/Screen";
import { registerSchema } from "@/src/features/auth/schemas";
import { colorsForScheme } from "@/src/lib/designTokens";
import { useOnboardingStore } from "@/src/stores/useOnboardingStore";

export default function CadastroScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const setCredentials = useOnboardingStore((s) => s.setCredentials);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const parseResult = registerSchema.safeParse({ name, email, password });
  const isValid = parseResult.success;

  const invalidFields =
    submitted && !parseResult.success
      ? new Set(parseResult.error.issues.map((i) => i.path[0]))
      : new Set();

  const nameError = invalidFields.has("name") ? "Informe seu nome" : null;
  const emailError = invalidFields.has("email") ? "E-mail inválido" : null;
  const passwordError = invalidFields.has("password")
    ? password.length === 0
      ? "Crie uma senha"
      : password.length > 72
        ? "Senha muito longa"
        : "Mínimo 8 caracteres"
    : null;

  function handleSubmit() {
    setSubmitted(true);
    if (!isValid) return;
    setCredentials(name.trim(), email.trim().toLowerCase(), password);
    router.push("/(onboarding)/saldo");
  }

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
              Crie sua conta
            </Text>
            <Text className="text-foreground text-heading mb-3 font-bold">
              Pra salvar tudo no seu nome.
            </Text>
            <Text className="text-muted text-sm leading-relaxed">
              Depois de criar sua conta, a gente pede o saldo atual — aí seu
              diário tá pronto.
            </Text>
          </View>

          {/* Campos */}
          <View className="gap-8">
            <View className="gap-2">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                Nome
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome aqui"
                placeholderTextColor={c.faint}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                className={`text-foreground text-input border-b-2 py-2 font-medium ${
                  nameError ? "border-danger" : "border-surface-tertiary"
                }`}
              />
              {nameError && (
                <Text className="text-danger text-xs">{nameError}</Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                E-mail
              </Text>
              <TextInput
                ref={emailRef}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={c.faint}
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
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={c.faint}
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
                    <EyeOff size={18} color={c.faint} />
                  ) : (
                    <Eye size={18} color={c.faint} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text className="text-danger text-xs">{passwordError}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Rodapé */}
        <View className="gap-3 px-6 pb-4">
          <Button
            onPress={handleSubmit}
            isDisabled={!isValid && submitted}
            className="bg-ds-canvas-bg h-14 rounded-4xl"
          >
            <Button.Label className="text-foreground text-base font-semibold">
              Cadastrar
            </Button.Label>
          </Button>

          <Button variant="ghost" onPress={() => router.push("/(auth)/login")}>
            <Button.Label className="text-muted text-sm">
              Já tem cadastro?{" "}
              <Text className="text-link font-medium underline">Entrar</Text>
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
