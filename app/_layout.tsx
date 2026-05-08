import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";

SplashScreen.preventAutoHideAsync();

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
        <HeroUINativeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              // contentStyle: { backgroundColor: "transparent" },
              // animation: "fade",
              // statusBarStyle: "inverted",
              // navigationBarColor: "transparent",
            }}
          />
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
