import { Tabs, useRouter } from "expo-router";
import { Activity, Menu, Plus, Tag } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  colorsForScheme,
  DS_RADIUS,
  fabShadowForScheme,
} from "@/src/lib/designTokens";

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View className="bg-background flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.green,
          tabBarInactiveTintColor: colors.mute,
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.hair,
            height: 56 + bottom,
            paddingBottom: bottom || 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: "Inter-Medium",
          },
          animation: "shift",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Saldos",
            tabBarIcon: ({ color, size }) => (
              <Activity color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="totais"
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.fabTab}
                onPress={() => router.push("/transaction/new")}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.fabCircle,
                    fabShadowForScheme(scheme),
                    {
                      backgroundColor: colors.green,
                      borderRadius: DS_RADIUS.pill,
                    },
                  ]}
                >
                  <Plus
                    color={colors.accentForeground}
                    size={24}
                    strokeWidth={2.5}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="tags"
          options={{
            title: "Tags",
            tabBarIcon: ({ color, size }) => <Tag color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  fabTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fabCircle: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
