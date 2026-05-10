import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useRouter, useSegments, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "@/src/stores/useAuthStore";
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

function AuthGuard() {
  const token = useAuthStore((s) => s.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Cast necessário enquanto (auth) não tem telas registradas no sistema de tipos
    const segment = segments[0] as string;
    const inUnprotected = segment === "(auth)" || segment === "(onboarding)";

    if (!token && !inUnprotected) {
      router.replace("/(onboarding)");
    } else if (token && inUnprotected) {
      router.replace("/(tabs)");
    }
  }, [token, segments, router]);

  return null;
}

function QuerySessionSync() {
  const userId = useAuthStore((s) => s.userId);
  const queryClient = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (previousUserId.current === undefined) {
      previousUserId.current = userId;
      return;
    }

    if (previousUserId.current !== userId) {
      queryClient.clear();
      previousUserId.current = userId;
    }
  }, [userId, queryClient]);

  return null;
}

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
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="day/[date]" />
              <Stack.Screen
                name="transaction/new"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen name="transaction/[id]" />
            </Stack>
            <QuerySessionSync />
            <AuthGuard />
          </HeroUINativeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
