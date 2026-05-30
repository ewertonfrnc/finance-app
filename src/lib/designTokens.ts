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
    surface: "#f7faf8",
    canvasBg: "#eef2f0",
    text: "#0e1310",
    mute: "#616462",
    faint: "#a2a5a3",
    future: "#818884",
    futureMute: "#b5b8b6",
    hair: "#e5e9e7",
    hairStrong: "#ced2d0",
    dragHandle: "#e0e0e0",
    greenDeep: "#062015",
    green: "#103c28",
    greenMid: "#35835b",
    greenSoft: "#92c5a6",
    greenTint: "#dff5e7",
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
    bg: "#102219",
    surface: "#1e2a24",
    canvasBg: "#18251f",
    text: "#e8ede9",
    mute: "rgba(255, 255, 255, 0.55)",
    faint: "rgba(255, 255, 255, 0.78)",
    future: "#818884",
    futureMute: "#b5b8b6",
    hair: "#2e4037",
    hairStrong: "rgba(255, 255, 255, 0.30)",
    dragHandle: "rgba(255, 255, 255, 0.30)",
    greenDeep: "#062015",
    green: "#5ab87a",
    greenMid: "#4c8a62",
    greenSoft: "#92c5a6",
    greenTint: "rgba(255, 255, 255, 0.08)",
    red: "#e65a4a",
    redStrong: "#e65a4a",
    redSoftBg: "#4a2b31",
    redSoftText: "#f8b8c3",
    redSoftSurface: "#2f2023",
    redRing: "#713b43",
    amber: "#c89f22",
    amberBg: "#493f25",
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
    entrada: { dot: "#14874e", bg: "#dff5e7", ink: "#103c28" },
    saida: { dot: "#bc4527", bg: "#ffe9e5", ink: "#7a342b" },
    diario: { dot: "#af7c00", bg: "#f5eee0", ink: "#5b4404" },
    economia: { dot: "#1b8abd", bg: "#dbf3ff", ink: "#0b4e6c" },
    cartao: { dot: "#7457d1", bg: "#e4f7ec", ink: "#103c28" },
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
    activeFg: "#0f1a14",
    startBg: DS_COLORS.dark.greenTint,
    startFg: DS_COLORS.dark.green,
    summaryBg: DS_COLORS.dark.canvasBg,
    summaryBorder: DS_COLORS.dark.hair,
  },
};

export function colorsForScheme(scheme: Scheme | null | undefined) {
  return DS_COLORS[scheme === "dark" ? "dark" : "light"];
}

export function schemeKey(scheme: Scheme | null | undefined): Scheme {
  return scheme === "dark" ? "dark" : "light";
}
