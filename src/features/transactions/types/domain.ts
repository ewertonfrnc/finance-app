import type { TransactionType } from './api';

/** Tipos usados internamente pelo app — campos normalizados, datas sem timezone. */

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // centavos
  description: string;
  date: string; // normalizado: "2026-04-12" (sem hora/timezone)
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DayBalance {
  date: string; // "2026-04-12"
  endBalance: number; // centavos — saldo acumulado ao fim do dia
  totalIncome: number; // centavos — soma das entradas do dia
  totalSpending: number; // centavos — soma de saida + diario + economia
  income: number; // centavos — entradas
  expense: number; // centavos — saídas
  daily: number; // centavos — diários
  savings: number; // centavos — economia
}

export interface MonthSummary {
  currentBalance: number; // saldo do último dia com dados
  peak: number; // maior saldo do mês
  valley: number; // menor saldo do mês
  totalIncome: number; // soma de todas entradas do mês
  totalExpenses: number; // soma de todas saídas do mês
}
