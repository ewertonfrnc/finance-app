import {
  BALANCE_TIER_COLORS,
  type Scheme,
  schemeKey,
} from "@/src/lib/designTokens";

export type BalanceTier =
  | "darkGreen"
  | "lightGreen"
  | "yellow"
  | "lightRed"
  | "darkRed";

export function getBalanceTier(balance: number): BalanceTier {
  if (balance >= 200000) return "darkGreen";
  if (balance >= 100000) return "lightGreen";
  if (balance >= 0) return "yellow";
  if (balance > -50000) return "lightRed";
  return "darkRed";
}

export function getBalanceTierColors(
  balance: number,
  scheme: Scheme | null | undefined,
) {
  return BALANCE_TIER_COLORS[schemeKey(scheme)][getBalanceTier(balance)];
}
