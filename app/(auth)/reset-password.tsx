import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Eye, EyeOff } from "lucide-react-native";
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

import { colorsForScheme } from "@/src/lib/designTokens";
import { resetPasswordSchema } from "@/src/features/auth/schemas";
import { useResetPassword } from "@/src/features/auth/hooks/useResetPassword";
import { Button } from "heroui-native";

type PasswordStrength = "fraca" | "média" | "forte";

function getStrength(password: string): PasswordStrength {
  if (password.length < 8) return "fraca";
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score >= 2) return "forte";
  if (score >= 1) return "média";
  return "fraca";
}

const STRENGTH_COLORS: Record<PasswordStrength, string[]> = {
  fraca: ["#e65a4a", "#2e4037", "#2e4037"],
  média: ["#c89f22", "#c89f22", "#2e4037"],
  forte: ["#14874e", "#14874e", "#14874e"],
};

const STRENGTH_LABELS: Record<PasswordStrength, string> = {
  fraca: "Fraca",
  média: "Média",
  forte: "Forte",
};

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  const { mutate: doReset, isPending, error: resetError } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const confirmRef = useRef<TextInput>(null);

  const parseResult = resetPasswordSchema.safeParse({ password, confirmPassword });
  const isValid = parseResult.success;

  const confirmError =
    submitted && !isValid && password.length > 0 && confirmPassword.length > 0
      ? "As senhas não batem."
      : null;

  const strength = password.length > 0 ? getStrength(password) : null;
  const strengthColors = strength ? STRENGTH_COLORS[strength] : null;

  function handleSubmit() {
    setSubmitted(true);
    if (!isValid || isPending) return;
    doReset(
      { token: token ?? "", password },
      { onSuccess: () => setSuccess(true) },
    );
  }

  if (success) {
    return (
      <View className="flex-1" style={{ backgroundColor: "#062015" }}>
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="mb-8 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          >
            <CheckCircle size={30} color="#5ab87a" strokeWidth={1.8} />
          </View>

          <Text
            className="mb-4 font-bold"
            style={{ color: "#e8ede9", fontSize: 36, lineHeight: 42, textAlign: "center" }}
          >
            {"Senha\nredefinida."}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 15,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Tudo certo. Agora é só entrar com a sua senha nova e continuar de onde parou.
          </Text>
        </View>

        <View className="px-6 pb-8">
          <Button
            onPress={() => router.replace("/(auth)/login")}
            className="bg-background h-14 rounded-4xl"
          >
            <Button.Label>
              <Text className="text-foreground font-semibold">Entrar agora</Text>
            </Button.Label>
          </Button>
        </View>
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

          {/* Heading */}
          <Text className="text-foreground mb-2 font-bold" style={{ fontSize: 32, lineHeight: 38 }}>
            {"Cria uma\nsenha nova."}
          </Text>
          <Text className="text-muted mb-10" style={{ fontSize: 15 }}>
            Escolhe algo que você lembra, mas que os outros não adivinham.
          </Text>

          {/* Campos */}
          <View className="gap-8">
            {/* Nova senha */}
            <View className="gap-2">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                Nova senha
              </Text>
              <View className="border-b-2 border-surface-tertiary flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (submitted) setSubmitted(false);
                  }}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  className="text-foreground text-input flex-1 py-2 font-medium"
                  placeholderTextColor={colors.mute}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.mute} />
                  ) : (
                    <Eye size={18} color={colors.mute} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              {password.length > 0 && strength && strengthColors && (
                <View className="gap-1">
                  <View className="flex-row gap-1">
                    {strengthColors.map((color, i) => (
                      <View
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </View>
                  <Text style={{ color: strengthColors[0], fontSize: 12, fontWeight: "600" }}>
                    {STRENGTH_LABELS[strength]}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirmar senha */}
            <View className="gap-2">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                Confirmar senha
              </Text>
              <View
                className={`flex-row items-center border-b-2 ${
                  confirmError ? "border-danger" : "border-surface-tertiary"
                }`}
              >
                <TextInput
                  ref={confirmRef}
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    if (submitted) setSubmitted(false);
                  }}
                  secureTextEntry={!showConfirm}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  className="text-foreground text-input flex-1 py-2 font-medium"
                  placeholderTextColor={colors.mute}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((v) => !v)}
                  hitSlop={8}
                  activeOpacity={0.7}
                >
                  {showConfirm ? (
                    <EyeOff size={18} color={colors.mute} />
                  ) : (
                    <Eye size={18} color={colors.mute} />
                  )}
                </TouchableOpacity>
              </View>
              {confirmError && (
                <Text className="text-danger text-xs">{confirmError}</Text>
              )}
            </View>
          </View>

          {resetError && (
            <View className="bg-danger/10 mt-6 rounded-xl px-4 py-3">
              <Text className="text-danger text-sm">
                {resetError.message?.toLowerCase().includes("unauthorized") ||
                resetError.message?.toLowerCase().includes("invalid") ||
                resetError.message?.toLowerCase().includes("expired") ||
                resetError.message?.includes("401")
                  ? "O link expirou. Solicite um novo."
                  : "Não foi possível conectar. Tente novamente."}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Rodapé */}
        <View className="px-6 pb-4">
          <Button
            onPress={handleSubmit}
            isDisabled={isPending}
            className={`h-14 rounded-4xl ${isValid ? "bg-foreground" : "bg-surface-secondary"}`}
          >
            <Button.Label>
              <Text className={`font-semibold ${isValid ? "text-background" : "text-muted"}`}>
                Confirmar nova senha
              </Text>
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
