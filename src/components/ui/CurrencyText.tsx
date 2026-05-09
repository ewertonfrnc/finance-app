import { formatBRL } from "@/src/lib/currency";
import { Text, type TextProps } from "react-native";

type Variant = "large" | "regular" | "small";
type Sign = "positive" | "negative" | "neutral";

interface CurrencyTextProps extends Omit<TextProps, "children"> {
  value: number; // centavos
  variant?: Variant;
  sign?: Sign;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  large: "text-2xl font-semibold",
  regular: "text-base font-semibold",
  small: "text-sm font-medium",
};

const SIGN_CLASSES: Record<Sign, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-foreground",
};

export function CurrencyText({
  value,
  variant = "regular",
  sign,
  className = "",
  ...props
}: CurrencyTextProps) {
  const resolvedSign: Sign = sign ?? (value >= 0 ? "positive" : "negative");
  return (
    <Text
      className={`${VARIANT_CLASSES[variant]} ${SIGN_CLASSES[resolvedSign]} ${className}`}
      {...props}
    >
      {formatBRL(value)}
    </Text>
  );
}
