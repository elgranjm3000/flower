import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";

export const DEFAULTS = {
  bcv_rate: "4200", // Bs por 1 USD
  whatsapp: "584120000000",
  store_name: "Sunflower by Company",
  payment_pagomovil_phone: "0412-0000000",
  payment_pagomovil_bank: "Banco de Venezuela",
  payment_pagomovil_rif: "J-00000000-0",
  payment_zelle_email: "pagos@sunflower.com",
  payment_zelle_name: "Sunflower by Company",
  free_shipping_min: "50", // USD
} as const;

export type SettingsKey = keyof typeof DEFAULTS;

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function getSetting(key: SettingsKey): Promise<string> {
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  return row?.value ?? DEFAULTS[key];
}

/** Tasa BCV en centavos de Bs por 1 USD. */
export async function getBcvRateCents(): Promise<number> {
  const rate = await getSetting("bcv_rate");
  const n = parseFloat(rate);
  return Number.isFinite(n) ? Math.round(n * 100) : 420000;
}
