import { formatBRL } from "@/src/lib/currency";
import { PRIVACY_MASK } from "@/src/lib/privacy";
import { Text, type TextProps } from "react-native";

type Variant = "large" | "regular" | "small";
type Sign = "positive" | "negative" | "neutral";

interface CurrencyTextProps extends Omit<TextProps, "children"> {
  value: number; // centavos
  variant?: Variant;
  sign?: Sign;
  /** Render the privacy placeholder instead of the value, keeping the same styling. */
  masked?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  large: "font-mono-semibold text-balance-highlight",
  regular: "text-base font-mono-medium",
  small: "text-sm font-mono-medium",
};

const SIGN_CLASSES: Record<Sign, string> = {
  positive: "text-accent",
  negative: "text-danger",
  neutral: "text-foreground",
};

export function CurrencyText({
  value,
  variant = "regular",
  sign,
  masked = false,
  className = "",
  ...props
}: CurrencyTextProps) {
  const resolvedSign: Sign = sign ?? (value >= 0 ? "positive" : "negative");
  return (
    <Text
      className={`${VARIANT_CLASSES[variant]} ${SIGN_CLASSES[resolvedSign]} ${className}`}
      {...props}
    >
      {masked ? PRIVACY_MASK : formatBRL(value)}
    </Text>
  );
}
