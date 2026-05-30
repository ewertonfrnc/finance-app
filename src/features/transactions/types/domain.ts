import type { RecurrenceType, TransactionType } from "./api";

/** Tipos usados internamente pelo app — campos normalizados, datas sem timezone. */

export interface TagRef {
  id: string;
  name: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // centavos
  description: string;
  date: string; // normalizado: "2026-04-12" (sem hora/timezone)
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: TagRef[];
  recurrence: RecurrenceType;
  seriesId?: string; // id da série recorrente (ausente em avulsas)
  recurrenceEndDate?: string; // "YYYY-MM-DD" ou ausente
  sourceSeriesId?: string; // série de origem, se for avulsa editada via "single"
  sourceOccurrenceDate?: string; // "YYYY-MM-DD" — data original da ocorrência substituída
  occurrenceKey: string; // chave única por ocorrência p/ keyExtractor
}

export interface DayBalance {
  date: string; // "2026-04-12"
  endBalance: number; // centavos — saldo acumulado ao fim do dia
  totalIncome: number; // centavos — soma das entradas do dia
  totalSpending: number; // centavos — soma de saida + diario + economia
  income: number; // centavos — entradas
  expense: number; // centavos — saídas
  daily: number; // centavos — daily_actual + daily_projected
  dailyProjected: number; // centavos — só a projeção (0 para passado/hoje)
  savings: number; // centavos — economia
}

export interface MonthSummary {
  currentBalance: number; // saldo do último dia com dados
  peak: number; // maior saldo do mês
  valley: number; // menor saldo do mês
  totalIncome: number; // soma de todas entradas do mês
  totalExpenses: number; // soma de todas saídas do mês
}

export interface FormValues {
  type: TransactionType;
  amountCents: number;
  description: string;
  date: string; // "YYYY-MM-DD"
  recurrence?: RecurrenceType; // default "none" — coletado no form a partir do Slice 2
  recurrenceEndDate?: string; // "YYYY-MM-DD" — data da última ocorrência (opcional)
}
