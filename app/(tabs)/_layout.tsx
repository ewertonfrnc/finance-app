import { Tabs, useRouter } from "expo-router";
import { Activity, Menu, Plus, Tag } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#1e3d2b";
const INACTIVE_COLOR = "#7a9485";
const TAB_BAR_BG = "#ffffff";

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarStyle: {
            backgroundColor: TAB_BAR_BG,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: "#e5ebe8",
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
                <View style={styles.fabCircle}>
                  <Plus color="#fff" size={24} strokeWidth={2.5} />
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
    borderRadius: 26,
    backgroundColor: "#1e3d2b",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
