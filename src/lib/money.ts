/** Precios se guardan en centavos (USD) en la DB. */

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Convierte centavos USD a bolívares usando la tasa (centavos Bs por 1 USD). */
export function usdToBs(centsUsd: number, bcvRateCents: number): number {
  return Math.round(centsUsd * (bcvRateCents / 100));
}

export function formatBs(centsBs: number): string {
  return `Bs. ${(centsBs / 100).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/ñ/g, "n")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
