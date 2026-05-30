import { TAG_PALETTE } from "@/src/lib/designTokens";

export const TAG_COLOR_PALETTE = TAG_PALETTE.map((item) => ({
  ...item,
  hex: item.bg,
})) as ((typeof TAG_PALETTE)[number] & { hex: string })[];

export function getTagColors(color: string) {
  return (
    TAG_COLOR_PALETTE.find(
      (item) =>
        item.bg.toLowerCase() === color.toLowerCase() ||
        item.dot.toLowerCase() === color.toLowerCase() ||
        item.ink.toLowerCase() === color.toLowerCase(),
    ) ?? {
      label: "Personalizada",
      hex: color,
      bg: color,
      ink: getTextColor(color),
      dot: color,
    }
  );
}

export function getTextColor(hex: string): string {
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#333333" : "#FFFFFF";
}
