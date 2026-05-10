const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Converte centavos para string BRL. Ex.: 208930 → "R$ 2.089,30" */
export function formatBRL(centavos: number): string {
  return formatter.format(centavos / 100);
}
