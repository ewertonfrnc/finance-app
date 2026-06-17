import { TAG_PALETTE, type Scheme, schemeKey } from "@/src/lib/designTokens";

export const TAG_COLOR_PALETTE = TAG_PALETTE.map((item) => ({
  ...item,
  hex: item.bg,
})) as ((typeof TAG_PALETTE)[number] & { hex: string })[];

const DARK_TAG_COLORS: Record<
  (typeof TAG_PALETTE)[number]["key"],
  { bg: string; ink: string; dot: string }
> = {
  gray: { bg: "#343a36", ink: "#d3d8d5", dot: "#8c938f" },
  blue: { bg: "#0d4358", ink: "#9ed8f2", dot: "#59a9cc" },
  yellow: { bg: "#4d430b", ink: "#ead56e", dot: "#c8ad31" },
  green: { bg: "#075234", ink: "#85e0ad", dot: "#4fbe7c" },
  red: { bg: "#642623", ink: "#f1a39e", dot: "#dc7972" },
  purple: { bg: "#433460", ink: "#c9bbf1", dot: "#9d8ad1" },
  pink: { bg: "#5d263e", ink: "#efabc2", dot: "#d780a0" },
  brown: { bg: "#4b3322", ink: "#ddbd9f", dot: "#aa7e5f" },
};

export function getTagPaletteForScheme(scheme: Scheme | null | undefined) {
  if (schemeKey(scheme) !== "dark") return TAG_COLOR_PALETTE;

  return TAG_COLOR_PALETTE.map((item) => ({
    ...item,
    ...DARK_TAG_COLORS[item.key],
  }));
}

export function getTagColors(color: string, scheme?: Scheme | null) {
  const palette = getTagPaletteForScheme(scheme);
  return (
    palette.find(
      (item) =>
        item.hex.toLowerCase() === color.toLowerCase() ||
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
