import { Text, View } from "react-native";

interface ErrorBannerProps {
  message?: string | null;
  className?: string;
}

export function ErrorBanner({ message, className }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <View className={`bg-danger/10 rounded-xl px-4 py-3 ${className ?? ""}`}>
      <Text className="text-danger text-sm">{message}</Text>
    </View>
  );
}
