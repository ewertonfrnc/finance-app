import { Pressable, Text, type PressableProps } from "react-native";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  disabled = false,
  className = "",
  ...props
}: PrimaryButtonProps & { className?: string }) {
  return (
    <Pressable
      disabled={disabled}
      className={`rounded-pill h-14 items-center justify-center ${
        disabled ? "bg-surface-tertiary" : "bg-accent"
      } ${className}`}
      {...props}
    >
      <Text
        className={`text-base font-semibold ${
          disabled ? "text-muted" : "text-accent-foreground"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
