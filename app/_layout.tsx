import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Regular": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/inter/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
    "JetBrainsMono-Regular": require("../assets/fonts/jetbrains/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Medium": require("../assets/fonts/jetbrains/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <HeroUINativeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="day/[date]" />
              <Stack.Screen
                name="transaction/new"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen name="transaction/[id]" />
            </Stack>
          </HeroUINativeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
