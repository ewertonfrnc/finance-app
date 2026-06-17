import { useRouter } from "expo-router";
import { ChevronLeft, Lock, Mail } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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
import { colorsForScheme, DS_COLORS } from "@/src/lib/designTokens";
import { forgotPasswordSchema } from "@/src/features/auth/schemas";
import { useForgotPassword } from "@/src/features/auth/hooks/useForgotPassword";
import { Button } from "heroui-native";

type Status = "idle" | "sent";
const SUCCESS_COLORS = DS_COLORS.dark;
const SUCCESS_BUTTON = DS_COLORS.light.bg;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(47);

  const inputRef = useRef<TextInput>(null);
  const {
    mutate: sendForgotPassword,
    isPending,
    error: sendError,
  } = useForgotPassword();

  const parseResult = forgotPasswordSchema.safeParse({ email });
  const isValid = parseResult.success;
  const emailError =
    submitted && !isValid ? "Informe um e-mail válido" : null;

  useEffect(() => {
    if (status !== "sent" || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const canResend = countdown === 0;

  function handleSend() {
    setSubmitted(true);
    if (!isValid || isPending) return;
    sendForgotPassword(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          setStatus("sent");
          setCountdown(47);
        },
      },
    );
  }

  function handleResend() {
    if (!canResend || isPending) return;
    sendForgotPassword(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => setCountdown(47),
      },
    );
  }

  function handleChangeEmail() {
    setStatus("idle");
    setEmail("");
    setSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  if (status === "sent") {
    return (
      <Screen style={{ backgroundColor: SUCCESS_COLORS.greenDeep }}>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{
              paddingTop: 64,
              paddingBottom: 32,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Ícone */}
            <View
              className="mb-8 h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: SUCCESS_COLORS.greenTint }}
            >
              <Mail size={26} color={SUCCESS_COLORS.text} strokeWidth={1.6} />
            </View>

            {/* Heading */}
            <Text
              className="mb-4 font-bold"
              style={{ color: SUCCESS_COLORS.text, fontSize: 32, lineHeight: 38 }}
            >
              {"Dá uma olhada\nno seu e-mail."}
            </Text>

            {/* Descrição */}
            <Text
              style={{
                color: SUCCESS_COLORS.mute,
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              Mandamos um link de redefinição pra
            </Text>
            <Text
              style={{
                color: SUCCESS_COLORS.text,
                fontSize: 15,
                fontWeight: "600",
                marginBottom: 24,
              }}
            >
              {email}
            </Text>

            {/* Info box */}
            <View
              className="rounded-2xl border px-4 py-4"
              style={{
                backgroundColor: SUCCESS_COLORS.greenTint,
                borderColor: SUCCESS_COLORS.hairStrong,
              }}
            >
              <View className="flex-row items-start gap-3">
                <Text style={{ color: SUCCESS_COLORS.mute, marginTop: 1 }}>
                  •
                </Text>
                <Text
                  style={{ color: SUCCESS_COLORS.mute, fontSize: 14, flex: 1 }}
                >
                  O link expira em{" "}
                  <Text style={{ color: SUCCESS_COLORS.text, fontWeight: "600" }}>
                    15 minutos
                  </Text>
                  . Não achou? Verifique a caixa de spam.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Rodapé */}
          <View className="gap-3 px-6 pb-8">
            <TouchableOpacity
              onPress={handleResend}
              disabled={!canResend}
              className="h-14 items-center justify-center rounded-4xl"
              style={{
                borderWidth: 1.5,
                borderColor: canResend
                  ? SUCCESS_BUTTON
                  : SUCCESS_COLORS.hairStrong,
              }}
              activeOpacity={0.75}
            >
              <Text
                style={{
                  color: canResend ? SUCCESS_BUTTON : SUCCESS_COLORS.faint,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {canResend ? "Reenviar link" : `Reenviar em ${countdown}s`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleChangeEmail}
              className="h-12 items-center justify-center"
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: SUCCESS_COLORS.text,
                  fontSize: 14,
                  textDecorationLine: "underline",
                }}
              >
                Mudar o e-mail
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Screen>
    );
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
          {/* Voltar */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-8"
            hitSlop={12}
            activeOpacity={0.7}
          >
            <ChevronLeft size={22} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          {/* Ícone */}
          <View
            className="mb-6 h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.greenTint }}
          >
            <Lock size={24} color={colors.green} strokeWidth={1.8} />
          </View>

          {/* Heading */}
          <Text
            className="text-foreground mb-3 font-bold"
            style={{ fontSize: 32, lineHeight: 38 }}
          >
            {"Esqueceu\na senha?"}
          </Text>
          <Text className="text-muted mb-8" style={{ fontSize: 15 }}>
            Sem estresse. Manda seu e-mail que a gente te envia um link pra
            criar uma senha nova.
          </Text>

          {/* Campo */}
          <View className="gap-2">
            <Text className="text-muted text-label font-semibold tracking-widest uppercase">
              E-mail
            </Text>
            <TextInput
              ref={inputRef}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (submitted) setSubmitted(false);
              }}
              placeholder="voce@email.com"
              placeholderTextColor={colors.mute}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={handleSend}
              className={`text-foreground text-input border-b-2 py-2 font-medium ${
                emailError ? "border-danger" : "border-surface-tertiary"
              }`}
            />
            {emailError && (
              <Text className="text-danger text-xs">{emailError}</Text>
            )}
          </View>

          {sendError && (
            <View className="bg-danger/10 mt-6 rounded-xl px-4 py-3">
              <Text className="text-danger text-sm">
                Não foi possível conectar. Tente novamente.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Rodapé */}
        <View className="gap-3 px-6 pb-4">
          <Button
            onPress={handleSend}
            isDisabled={!isValid || isPending}
            className={`h-14 rounded-4xl ${isValid ? "bg-ds-canvas-bg" : "bg-surface-tertiary"}`}
          >
            <Button.Label>
              <Text
                className={`font-semibold ${isValid ? "text-foreground" : "text-muted"}`}
              >
                Enviar link
              </Text>
            </Button.Label>
          </Button>

          <Button variant="ghost" onPress={() => router.back()}>
            <Button.Label className="text-link text-sm underline">
              Voltar pro login
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
