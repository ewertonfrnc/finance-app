import { addDays, format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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

/** "2026-04-12" → "TER-FEIRA" (para o header da tela de detalhe) */
export function formatWeekdayLong(date: string): string {
  return format(parseISO(date), "EEE'-feira'", { locale: ptBR }).toUpperCase();
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
