const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Converte centavos para string BRL. Ex.: 208930 → "R$ 2.089,30" */
export function formatBRL(centavos: number): string {
  return formatter.format(centavos / 100);
}

/** Converte string BRL para centavos. Ex.: "2.089,30" → 208930 */
export function parseBRL(value: string): number {
  const normalized = value.replace(/\./g, '').replace(',', '.');
  return Math.round(parseFloat(normalized) * 100);
}
