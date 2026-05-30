import type { LucideIcon } from "lucide-react-native";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  useColorScheme,
} from "react-native";

import { colorsForScheme, DS_RADIUS } from "@/src/lib/designTokens";

interface IconButtonProps extends Omit<PressableProps, "style"> {
  Icon: LucideIcon;
  color?: string;
  size?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  variant?: "plain" | "soft";
}

export function IconButton({
  Icon,
  color,
  size = 20,
  strokeWidth = 2,
  variant = "plain",
  style,
  ...props
}: IconButtonProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);
  const iconColor = color ?? colors.green;

  return (
    <Pressable
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        variant === "soft"
          ? {
              width: 36,
              height: 36,
              borderRadius: DS_RADIUS.iconButton,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.greenTint,
            }
          : undefined,
        style,
      ]}
      {...props}
    >
      <Icon color={iconColor} size={size} strokeWidth={strokeWidth} />
    </Pressable>
  );
}
