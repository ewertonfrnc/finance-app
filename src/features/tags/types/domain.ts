/** Tipos usados internamente pelo app — campos normalizados em camelCase. */

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagWithTotal extends Tag {
  monthlyTotal: number; // centavos
  transactionCount: number;
}
