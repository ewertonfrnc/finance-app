import { useSegments } from "expo-router";
import { type ViewProps, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

export function Screen({ children, className, style, ...props }: ScreenProps) {
  const { top, bottom } = useSafeAreaInsets();
  const segments = useSegments();
  const paddingBottom = segments[0] === "(tabs)" ? 0 : bottom;
  return (
    <View
      className={`bg-surface flex-1 ${className ?? ""}`}
      style={[{ paddingTop: top, paddingBottom }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
