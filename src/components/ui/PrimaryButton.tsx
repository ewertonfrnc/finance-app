import { Pressable, Text, type PressableProps } from "react-native";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  disabled?: boolean;
  tone?: "light" | "dark";
}

export function PrimaryButton({
  label,
  disabled = false,
  tone = "light",
  className = "",
  ...props
}: PrimaryButtonProps & { className?: string }) {
  const enabledClass = tone === "dark" ? "bg-ds-bg" : "bg-ds-canvas-bg";
  const disabledClass = "bg-surface-tertiary";
  const textClass = tone === "dark" ? "text-ds-green-deep" : "text-foreground";

  return (
    <Pressable
      disabled={disabled}
      className={`rounded-pill h-14 items-center justify-center ${
        disabled ? disabledClass : enabledClass
      } ${className}`}
      {...props}
    >
      <Text
        className={`text-base font-semibold ${
          disabled ? "text-muted" : textClass
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
