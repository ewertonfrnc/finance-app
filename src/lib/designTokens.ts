import type { TransactionType } from "@/src/features/transactions/types";

export type Scheme = "light" | "dark";
type ColorTriple = {
  bg: string;
  ink: string;
  dot: string;
};
type DatePickerColors = {
  sheet: string;
  text: string;
  muted: string;
  disabled: string;
  activeBg: string;
  activeFg: string;
  startBg: string;
  startFg: string;
  summaryBg: string;
  summaryBorder: string;
};

export const DS_COLORS = {
  light: {
    bg: "#ffffff",
    surface: "#f7fbf9",
    canvasBg: "#eff3f1",
    text: "#0e1310",
    mute: "#616462",
    faint: "#a2a5a3",
    future: "#818884",
    futureMute: "#b5b8b6",
    hair: "#e5e9e7",
    hairStrong: "#ced2d0",
    dragHandle: "#d7d7d7",
    weekendBg: "rgba(200, 160, 60, 0.13)",
    greenDeep: "#062015",
    green: "#103c28",
    greenMid: "#35835b",
    greenSoft: "#92c5a6",
    greenTint: "#dff5e7",
    accentForeground: "#ffffff",
    red: "#bd413f",
    redStrong: "#b32228",
    redSoftBg: "#ffece9",
    redSoftText: "#ac3031",
    redSoftSurface: "#fff6f4",
    redRing: "#f0c5c1",
    amber: "#a06200",
    amberBg: "#ffeec5",
    amberRing: "#e5cdad",
    overlayStandard: "rgba(20, 30, 25, 0.32)",
    overlayDelete: "rgba(15, 25, 20, 0.22)",
  },
  dark: {
    bg: "#141b17",
    surface: "#1c221e",
    canvasBg: "#0e1411",
    text: "#ecefed",
    mute: "#9aa09d",
    faint: "#6d736f",
    future: "#7b827e",
    futureMute: "#515753",
    hair: "#2a2f2c",
    hairStrong: "#424a45",
    dragHandle: "#424a45",
    weekendBg: "rgba(120, 100, 60, 0.25)",
    greenDeep: "#183b2b",
    green: "#73cd9f",
    greenMid: "#5db384",
    greenSoft: "#3d7757",
    greenTint: "#1e3327",
    accentForeground: "#0a100d",
    red: "#ed756e",
    redStrong: "#ed756e",
    redSoftBg: "#572825",
    redSoftText: "#ffaea6",
    redSoftSurface: "#44241f",
    redRing: "#713b43",
    amber: "#baa44d",
    amberBg: "#42370d",
    amberRing: "#725f34",
    overlayStandard: "rgba(0, 0, 0, 0.35)",
    overlayDelete: "rgba(15, 25, 20, 0.35)",
  },
} as const;

export const DS_SHADOWS = {
  phone: {
    shadowColor: "rgba(0, 40, 20, 0.25)",
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 6,
  },
  sheet: {
    shadowColor: "rgba(20, 40, 30, 0.20)",
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 10,
  },
  summary: {
    shadowColor: "rgba(20, 40, 30, 0.18)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  fab: {
    shadowColor: "#103c28",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
  },
  fabDark: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

export const DS_RADIUS = {
  pill: 26,
  sheet: 24,
  cardLarge: 22,
  iconButton: 18,
  card: 16,
  control: 14,
  swatch: 12,
  chip: 8,
  subLabel: 4,
} as const;

export const CATEGORY_COLORS: Record<TransactionType | "cartao", ColorTriple> =
  {
    entrada: { dot: "#129868", bg: "#dff5eb", ink: "#0b593f" },
    saida: { dot: "#bf5317", bg: "#ffe9dc", ink: "#79320d" },
    diario: { dot: "#a623cd", bg: "#f6ddff", ink: "#6c1984" },
    economia: { dot: "#7cab2d", bg: "#edf7db", ink: "#4d7014" },
    cartao: { dot: "#7457d1", bg: "#e4f7ec", ink: "#103c28" },
  };

export const CATEGORY_COLORS_BY_SCHEME: Record<
  Scheme,
  Record<TransactionType | "cartao", ColorTriple>
> = {
  light: CATEGORY_COLORS,
  dark: {
    entrada: { dot: "#1e8f68", bg: "#1d3d32", ink: "#ebfff6" },
    saida: { dot: "#b15c2d", bg: "#432a20", ink: "#fff2ea" },
    diario: { dot: "#9f4bc0", bg: "#3d2548", ink: "#f8eaff" },
    economia: { dot: "#779f47", bg: "#303d25", ink: "#f4ffe8" },
    cartao: { dot: "#b6a4ee", bg: "#3d3158", ink: "#e2d8ff" },
  },
};

export const TAG_PALETTE = [
  {
    key: "gray",
    label: "Cinza",
    bg: "#e2e6e3",
    ink: "#3b3e3c",
    dot: "#b5b8b6",
  },
  { key: "blue", label: "Azul", bg: "#c2e4f8", ink: "#014867", dot: "#78b3d6" },
  {
    key: "yellow",
    label: "Amarelo",
    bg: "#f4e8bb",
    ink: "#544714",
    dot: "#dbc77a",
  },
  {
    key: "green",
    label: "Verde",
    bg: "#97e5b8",
    ink: "#073d25",
    dot: "#5abb88",
  },
  {
    key: "red",
    label: "Vermelho",
    bg: "#f6c2bd",
    ink: "#742e2b",
    dot: "#dc8c85",
  },
  {
    key: "purple",
    label: "Roxo",
    bg: "#d3caf5",
    ink: "#4c3c73",
    dot: "#a89bd2",
  },
  { key: "pink", label: "Rosa", bg: "#f4cbd9", ink: "#6c314a", dot: "#dda5ba" },
  {
    key: "brown",
    label: "Marrom",
    bg: "#d8bfab",
    ink: "#4d3827",
    dot: "#b0927a",
  },
] as const;

export type TagPaletteItem = (typeof TAG_PALETTE)[number];

export const BALANCE_TIER_COLORS = {
  light: {
    darkGreen: { bg: "#b8ecd4", ink: "#114d36" },
    lightGreen: { bg: "#dbf4e7", ink: "#185b43" },
    yellow: { bg: "#f8edc8", ink: "#73580f" },
    lightRed: { bg: "#f8d9dd", ink: "#852035" },
    darkRed: { bg: "#efbcc5", ink: "#701529" },
  },
  dark: {
    darkGreen: { bg: "#1a4a38", ink: "#96eec6" },
    lightGreen: { bg: "#1e4032", ink: "#96e2be" },
    yellow: { bg: "#463c1e", ink: "#eed48e" },
    lightRed: { bg: "#46262d", ink: "#f0a2ae" },
    darkRed: { bg: "#4e2029", ink: "#f8b0ba" },
  },
} as const;

export const DATE_PICKER_COLORS: Record<Scheme, DatePickerColors> = {
  light: {
    sheet: DS_COLORS.light.bg,
    text: DS_COLORS.light.text,
    muted: DS_COLORS.light.mute,
    disabled: DS_COLORS.light.faint,
    activeBg: DS_COLORS.light.green,
    activeFg: DS_COLORS.light.bg,
    startBg: DS_COLORS.light.greenTint,
    startFg: DS_COLORS.light.green,
    summaryBg: DS_COLORS.light.surface,
    summaryBorder: DS_COLORS.light.hair,
  },
  dark: {
    sheet: DS_COLORS.dark.surface,
    text: DS_COLORS.dark.text,
    muted: DS_COLORS.dark.mute,
    disabled: DS_COLORS.dark.hairStrong,
    activeBg: DS_COLORS.dark.green,
    activeFg: "#0a100d",
    startBg: DS_COLORS.dark.greenTint,
    startFg: DS_COLORS.dark.green,
    summaryBg: DS_COLORS.dark.canvasBg,
    summaryBorder: DS_COLORS.dark.hair,
  },
};

export function colorsForScheme(scheme: Scheme | null | undefined) {
  return DS_COLORS[scheme === "dark" ? "dark" : "light"];
}

export function categoryColorsForScheme(scheme: Scheme | null | undefined) {
  return CATEGORY_COLORS_BY_SCHEME[schemeKey(scheme)];
}

export function schemeKey(scheme: Scheme | null | undefined): Scheme {
  return scheme === "dark" ? "dark" : "light";
}

export function fabShadowForScheme(scheme: Scheme | null | undefined) {
  return schemeKey(scheme) === "dark" ? DS_SHADOWS.fabDark : DS_SHADOWS.fab;
}
