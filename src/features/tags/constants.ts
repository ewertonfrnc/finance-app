export const TAG_COLOR_PALETTE = [
  { label: "Marrom", hex: "#D4A87A" },
  { label: "Laranja", hex: "#F4934A" },
  { label: "Rosa", hex: "#E86FA8" },
  { label: "Roxo", hex: "#C4A4F4" },
  { label: "Azul", hex: "#4A7CE0" },
  { label: "Verde", hex: "#7EC8A0" },
  { label: "Cinza", hex: "#9E9E9E" },
  { label: "Marfim", hex: "#E8D5A3" },
] as const;

export function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#333333" : "#FFFFFF";
}
