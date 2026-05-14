import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthHydration, useAuthStore } from "@/src/stores/useAuthStore";
import "../global.css";

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/src/lib/reactotron");
}

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

function AuthGuard({
  hasHydrated,
  onResolvedChange,
}: {
  hasHydrated: boolean;
  onResolvedChange: (resolved: boolean) => void;
}) {
  const token = useAuthStore((s) => s.token);
  const segments = useSegments();
  const router = useRouter();
  const segment = segments[0] as string | undefined;
  const inUnprotected = segment === "(auth)" || segment === "(onboarding)";
  const authResolved =
    hasHydrated && ((!!token && !inUnprotected) || (!token && inUnprotected));

  const onResolvedChangeRef = useRef(onResolvedChange);
  onResolvedChangeRef.current = onResolvedChange;

  useEffect(() => {
    onResolvedChangeRef.current(authResolved);
  }, [authResolved]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token && !inUnprotected) {
      router.replace("/(onboarding)");
    } else if (token && inUnprotected) {
      router.replace("/(tabs)");
    }
  }, [hasHydrated, inUnprotected, token, router]);

  if (!authResolved) {
    return (
      <View className="bg-background" style={StyleSheet.absoluteFillObject} />
    );
  }

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
  const hasHydrated = useAuthHydration();
  const [authResolved, setAuthResolved] = useState(false);
  const [loaded, error] = useFonts({
    "Inter-Regular": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/inter/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
    "JetBrainsMono-Regular": require("../assets/fonts/jetbrains/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Medium": require("../assets/fonts/jetbrains/JetBrainsMono-Medium.ttf"),
  });
  const assetsReady = hasHydrated && (loaded || error);

  useEffect(() => {
    if (assetsReady && authResolved) {
      SplashScreen.hideAsync();
    }
  }, [assetsReady, authResolved]);

  if (!assetsReady) {
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
            <AuthGuard
              hasHydrated={hasHydrated}
              onResolvedChange={setAuthResolved}
            />
          </HeroUINativeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
