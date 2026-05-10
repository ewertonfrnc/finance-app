import { FABButton } from "@/src/components/ui/FABButton";
import { Tabs, useRouter } from "expo-router";
import { Activity, Menu } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#1e3d2b";
const INACTIVE_COLOR = "#7a9485";
const TAB_BAR_BG = "#ffffff";

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
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
            href: null,
          }}
        />
        <Tabs.Screen
          name="tags"
          options={{
            href: null,
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
      <FABButton
        onPress={() => router.push("/transaction/new")}
        bottom={56 + bottom + 12}
      />
    </View>
  );
}
