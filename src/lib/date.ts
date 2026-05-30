import { addDays, format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Primeira letra maiúscula. Útil pros nomes de mês do date-fns (vêm minúsculos). */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** "2026-04-12" → "12/04/2026" */
export function formatFullDate(date: string): string {
  return format(parseISO(date), "dd/MM/yyyy", { locale: ptBR });
}

export function isIsoDate(date: string): boolean {
  const parsed = parseISO(date);
  return !Number.isNaN(parsed.getTime()) && format(parsed, "yyyy-MM-dd") === date;
}

/** "2026-04-12" → "12/04" */
export function formatDayHeader(date: string): string {
  return format(parseISO(date), "dd/MM");
}

/** "2026-04-12" → "TER" (abreviação em português, maiúsculo) */
export function formatWeekday(date: string): string {
  return format(parseISO(date), "EEEEEE", { locale: ptBR })
    .replace(".", "")
    .toUpperCase();
}

/** "2026-04-12" → "TER-FEIRA" | "SÁBADO" | "DOMINGO" (para o header da tela de detalhe) */
export function formatWeekdayLong(date: string): string {
  const parsed = parseISO(date);
  const day = parsed.getDay();
  if (day === 0) return "DOMINGO";
  if (day === 6) return "SÁBADO";
  return format(parsed, "EEE", { locale: ptBR }).replace(".", "").toUpperCase() + "-FEIRA";
}

/** "2026-04-12" → true se sábado ou domingo */
export function isWeekend(date: string): boolean {
  const day = parseISO(date).getDay();
  return day === 0 || day === 6;
}

/** "2026-04-12" → "2026-04-11" */
export function prevDay(date: string): string {
  return format(subDays(parseISO(date), 1), "yyyy-MM-dd");
}

/** "2026-04-12" → "2026-04-13" */
export function nextDay(date: string): string {
  return format(addDays(parseISO(date), 1), "yyyy-MM-dd");
}

/** Monta o header do mês. Ex.: year=2026, month=5 → "Mai / 26" */
export function formatMonthHeader(year: number, month: number): string {
  const monthName = format(new Date(year, month - 1), "MMM", { locale: ptBR });
  const capitalized =
    monthName.charAt(0).toUpperCase() + monthName.slice(1).replace(".", "");
  const shortYear = String(year).slice(-2);
  return `${capitalized} / ${shortYear}`;
}
