import { View } from "react-native";

const MAX_WIDTH = 80;

interface BalanceBarProps {
  value: number;
  maxAbsValue: number;
}

export function BalanceBar({ value, maxAbsValue }: BalanceBarProps) {
  const ratio = maxAbsValue > 0 ? Math.abs(value) / maxAbsValue : 0;
  const width = Math.max(2, Math.round(ratio * MAX_WIDTH));

  return (
    <View style={{ width: MAX_WIDTH }} className="justify-center">
      <View
        style={{ width }}
        className={`h-2 rounded-full ${value < 0 ? "bg-danger" : "bg-accent"}`}
      />
    </View>
  );
}
