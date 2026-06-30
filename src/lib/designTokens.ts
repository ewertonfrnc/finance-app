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
    surface: "#f8fafa",
    canvasBg: "#eef2f2",
    text: "#1a2e35",
    mute: "#4a6269",
    faint: "#93a3a7",
    future: "#818e90",
    futureMute: "#b4c0c1",
    hair: "#e8ebec",
    hairStrong: "#d4dcdb",
    dragHandle: "#d7d7d7",
    weekendBg: "rgba(200, 160, 60, 0.13)",
    greenDeep: "#2f6a4a",
    green: "#328f97",
    greenMid: "#4fb8b2",
    greenSoft: "#a3d9d4",
    greenTint: "#e3f4f2",
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
    bg: "#0b1114",
    surface: "#131d21",
    canvasBg: "#080e11",
    text: "#e0ede9",
    mute: "#a0bfba",
    faint: "#6f8884",
    future: "#74908b",
    futureMute: "#4a5d5a",
    hair: "#1c2a2c",
    hairStrong: "#2e4244",
    dragHandle: "#2e4244",
    weekendBg: "rgba(120, 100, 60, 0.25)",
    greenDeep: "#21453f",
    green: "#8de5db",
    greenMid: "#6ec89a",
    greenSoft: "#4f9b94",
    greenTint: "#163230",
    accentForeground: "#0b1114",
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
    shadowColor: "#328f97",
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

export const CATEGORY_COLORS: Record<TransactionType, ColorTriple> = {
  entrada: { dot: "#129868", bg: "#dff5eb", ink: "#0b593f" },
  saida: { dot: "#bf5317", bg: "#ffe9dc", ink: "#79320d" },
  diario: { dot: "#a623cd", bg: "#f6ddff", ink: "#6c1984" },
  economia: { dot: "#7cab2d", bg: "#edf7db", ink: "#4d7014" },
};

export const CATEGORY_COLORS_BY_SCHEME: Record<
  Scheme,
  Record<TransactionType, ColorTriple>
> = {
  light: CATEGORY_COLORS,
  dark: {
    entrada: { dot: "#1e8f68", bg: "#1d3d32", ink: "#ebfff6" },
    saida: { dot: "#b15c2d", bg: "#432a20", ink: "#fff2ea" },
    diario: { dot: "#9f4bc0", bg: "#3d2548", ink: "#f8eaff" },
    economia: { dot: "#779f47", bg: "#303d25", ink: "#f4ffe8" },
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
    darkGreen: { bg: "#214f3c", ink: "#baf5d7" },
    lightGreen: { bg: "#1a3f31", ink: "#a6efca" },
    yellow: { bg: "#493f25", ink: "#f4d98e" },
    lightRed: { bg: "#4a2b31", ink: "#f8b8c3" },
    darkRed: { bg: "#5a2530", ink: "#ffd2da" },
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
    activeFg: DS_COLORS.dark.bg,
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
