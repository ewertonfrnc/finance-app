import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import {
  colorsForScheme,
  DS_RADIUS,
  fabShadowForScheme,
} from "@/src/lib/designTokens";

interface FABButtonProps {
  onPress: () => void;
  bottom?: number;
}

export function FABButton({ onPress, bottom = 80 }: FABButtonProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        fabShadowForScheme(scheme),
        { bottom, backgroundColor: colors.green, borderRadius: DS_RADIUS.pill },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Plus color={colors.accentForeground} size={24} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    marginLeft: -26,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
