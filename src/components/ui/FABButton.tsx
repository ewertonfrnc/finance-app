import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FABButtonProps {
  onPress: () => void;
  bottom?: number;
}

export function FABButton({ onPress, bottom = 80 }: FABButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom }]}
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
