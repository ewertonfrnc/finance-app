import { type ViewProps, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

export function Screen({ children, className, style, ...props }: ScreenProps) {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View
      className={`bg-background flex-1 ${className ?? ""}`}
      style={[{ paddingTop: top, paddingBottom: bottom }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
