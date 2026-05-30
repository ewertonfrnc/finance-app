import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { colorsForScheme, DS_RADIUS, DS_SHADOWS } from "@/src/lib/designTokens";

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
        DS_SHADOWS.fab,
        { bottom, backgroundColor: colors.green, borderRadius: DS_RADIUS.pill },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Plus color="#fff" size={24} strokeWidth={2.5} />
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
