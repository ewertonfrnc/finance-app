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

export function formatTagSelectionSummary(
  selectedTagIds: string[],
  tags: { id: string; name: string }[],
): string {
  if (selectedTagIds.length === 0) return "Sem tag";

  const selectedNames = selectedTagIds
    .map((id) => tags.find((tag) => tag.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  if (selectedNames.length === 0) {
    return selectedTagIds.length === 1 ? "1 tag" : `${selectedTagIds.length} tags`;
  }

  if (selectedNames.length <= 2) return selectedNames.join(", ");

  return `${selectedNames[0]} +${selectedNames.length - 1}`;
}
