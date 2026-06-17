import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, ChevronLeft, Eye, EyeOff } from "lucide-react-native";
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
import { colorsForScheme, DS_COLORS } from "@/src/lib/designTokens";
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

const STRENGTH_LABELS: Record<PasswordStrength, string> = {
  fraca: "Fraca",
  média: "Média",
  forte: "Forte",
};

const SUCCESS_COLORS = DS_COLORS.dark;
const SUCCESS_BUTTON = DS_COLORS.light.bg;

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
    (submitted || confirmPassword.length > 0) &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword
      ? "As senhas não batem."
      : null;

  const strength = password.length > 0 ? getStrength(password) : null;
  const strengthColors = strength
    ? {
        fraca: [colors.red, colors.hairStrong, colors.hairStrong],
        média: [colors.amber, colors.amber, colors.hairStrong],
        forte: [colors.green, colors.green, colors.green],
      }[strength]
    : null;

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
      <Screen style={{ backgroundColor: SUCCESS_COLORS.greenDeep }}>
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="mb-8 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: SUCCESS_COLORS.greenTint }}
          >
            <CheckCircle size={30} color={SUCCESS_COLORS.green} strokeWidth={1.8} />
          </View>

          <Text
            className="mb-4 font-bold"
            style={{
              color: SUCCESS_COLORS.text,
              fontSize: 36,
              lineHeight: 42,
              textAlign: "center",
            }}
          >
            {"Senha\nredefinida."}
          </Text>
          <Text
            style={{
              color: SUCCESS_COLORS.mute,
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
            style={{ backgroundColor: SUCCESS_BUTTON }}
            className="h-14 rounded-4xl"
          >
            <Button.Label>
              <Text style={{ color: SUCCESS_COLORS.greenDeep }} className="font-semibold">
                Entrar agora
              </Text>
            </Button.Label>
          </Button>
        </View>
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

          {/* Heading */}
          <Text
            className="text-foreground mb-2 font-bold"
            style={{ fontSize: 32, lineHeight: 38 }}
          >
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
                  <Text
                    style={{
                      color: strengthColors[0],
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
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
            isDisabled={!isValid || isPending}
            className={`h-14 rounded-4xl ${isValid ? "bg-ds-canvas-bg" : "bg-surface-tertiary"}`}
          >
            <Button.Label>
              <Text
                className={`font-semibold ${isValid ? "text-foreground" : "text-muted"}`}
              >
                Confirmar nova senha
              </Text>
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
