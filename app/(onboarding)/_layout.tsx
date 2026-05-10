import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "default" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[step]" />
      <Stack.Screen name="resumo" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="saldo" />
    </Stack>
  );
}
