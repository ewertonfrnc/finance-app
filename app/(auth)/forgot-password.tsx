import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
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

import { colorsForScheme } from "@/src/lib/designTokens";
import { forgotPasswordSchema } from "@/src/features/auth/schemas";
import { useForgotPassword } from "@/src/features/auth/hooks/useForgotPassword";
import { Button } from "heroui-native";

type Status = "idle" | "sent";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(47);

  const inputRef = useRef<TextInput>(null);
  const { mutate: sendForgotPassword, isPending, error: sendError } = useForgotPassword();

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
      <View className="flex-1" style={{ backgroundColor: "#062015" }}>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingTop: 64, paddingBottom: 32, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Ícone */}
            <View
              className="mb-8 h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <Mail size={26} color="rgba(255,255,255,0.75)" strokeWidth={1.6} />
            </View>

            {/* Heading */}
            <Text
              className="mb-4 font-bold"
              style={{ color: "#e8ede9", fontSize: 32, lineHeight: 38 }}
            >
              {"Dá uma olhada\nno seu e-mail."}
            </Text>

            {/* Descrição */}
            <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 4 }}>
              Mandamos um link de redefinição pra
            </Text>
            <Text
              style={{ color: "#e8ede9", fontSize: 15, fontWeight: "600", marginBottom: 24 }}
            >
              {email}
            </Text>

            {/* Info box */}
            <View
              className="rounded-2xl px-4 py-4"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <View className="flex-row items-start gap-3">
                <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 1 }}>•</Text>
                <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, flex: 1 }}>
                  O link expira em{" "}
                  <Text style={{ color: "#e8ede9", fontWeight: "600" }}>15 minutos</Text>
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
                borderColor: canResend ? "#e8ede9" : "rgba(255,255,255,0.25)",
              }}
              activeOpacity={0.75}
            >
              <Text
                style={{
                  color: canResend ? "#e8ede9" : "rgba(255,255,255,0.4)",
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
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 14,
                  textDecorationLine: "underline",
                }}
              >
                Mudar o e-mail
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
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
            <Text className="text-foreground text-xl">{"‹"}</Text>
          </TouchableOpacity>

          {/* Ícone */}
          <View
            className="mb-6 h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.greenTint }}
          >
            <Lock size={24} color={colors.green} strokeWidth={1.8} />
          </View>

          {/* Heading */}
          <Text className="text-foreground mb-3 font-bold" style={{ fontSize: 32, lineHeight: 38 }}>
            {"Esqueceu\na senha?"}
          </Text>
          <Text className="text-muted mb-8" style={{ fontSize: 15 }}>
            Sem estresse. Manda seu e-mail que a gente te envia um link pra criar uma senha nova.
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
            isDisabled={isPending || (!isValid && submitted)}
            className={`h-14 rounded-4xl ${isValid ? "bg-foreground" : "bg-surface-secondary"}`}
          >
            <Button.Label>
              <Text className={`font-semibold ${isValid ? "text-background" : "text-muted"}`}>
                Enviar link
              </Text>
            </Button.Label>
          </Button>

          <Button variant="ghost" onPress={() => router.back()}>
            <Button.Label className="text-muted text-sm">
              Voltar pro login
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
