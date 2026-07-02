import { schemeKey, TAG_PALETTE, type Scheme } from "@/src/lib/designTokens";

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

const DARK_TAG_COLOR_PALETTE = TAG_COLOR_PALETTE.map((item) => ({
  ...item,
  ...DARK_TAG_COLORS[item.key],
}));

// The palette is fully static per scheme, so build each variant once at module
// load instead of remapping on every call.
const PALETTE_BY_SCHEME = {
  light: TAG_COLOR_PALETTE,
  dark: DARK_TAG_COLOR_PALETTE,
} as const;

type TagColors = {
  label: string;
  hex: string;
  bg: string;
  ink: string;
  dot: string;
};

// O(1) color lookup keyed by every lowercased field a stored color might hold.
// First palette entry wins per value, matching the previous `find` order.
function buildColorLookup(palette: readonly TagColors[]) {
  const lookup = new Map<string, TagColors>();
  palette.forEach((item) => {
    for (const value of [item.hex, item.bg, item.dot, item.ink]) {
      const key = value.toLowerCase();
      if (!lookup.has(key)) lookup.set(key, item);
    }
  });
  return lookup;
}

const COLOR_LOOKUP_BY_SCHEME = {
  light: buildColorLookup(TAG_COLOR_PALETTE),
  dark: buildColorLookup(DARK_TAG_COLOR_PALETTE),
} as const;

export function getTagPaletteForScheme(scheme: Scheme | null | undefined) {
  return PALETTE_BY_SCHEME[schemeKey(scheme)];
}

export function getTagColors(color: string, scheme?: Scheme | null) {
  const match = COLOR_LOOKUP_BY_SCHEME[schemeKey(scheme)].get(
    color.toLowerCase(),
  );
  return (
    match ?? {
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
    return selectedTagIds.length === 1
      ? "1 tag"
      : `${selectedTagIds.length} tags`;
  }

  if (selectedNames.length <= 2) return selectedNames.join(", ");

  return `${selectedNames[0]} +${selectedNames.length - 1}`;
}
