/** URL pública del sitio (sin barra final). Configurar NEXT_PUBLIC_SITE_URL en .env al desplegar. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
