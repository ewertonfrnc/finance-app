import { Stack } from "expo-router";

export default function TagsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="form" options={{ presentation: "modal" }} />
      <Stack.Screen name="pick" />
    </Stack>
  );
}
