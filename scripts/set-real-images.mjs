// Reemplaza las imágenes demo por fotos reales (Unsplash, licencia abierta).
// Descarga cada foto, la guarda en BINARIO como BLOB en Turso.
// Uso: node scripts/set-real-images.mjs
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

// slug del producto -> URLs de fotos (portada primero)
const PHOTOS = {
  "vestido-lino-bel-air": [
    "photo-1490481651871-ab68de25d43d",
    "photo-1515886657613-9f3515b0c78f",
    "photo-1503342217505-b0a15ec3261c",
  ],
  "blusa-saten-amanecer": [
    "photo-1594633312681-425c7b97ccd1",
    "photo-1483985988355-763728e1935b",
  ],
  "jeans-slim-denim-co": [
    "photo-1542272604-787c3835535d",
    "photo-1541099649105-f69ad21f3246",
  ],
  "camisa-lino-premium": [
    "photo-1598554747436-c9293d6a588f",
    "photo-1602810318383-e386cc2a3ccf",
  ],
  "zapatillas-urbanas-sky": [
    "photo-1542291026-7eec264c27ff",
    "photo-1549298916-b41d501d3772",
  ],
  "bolso-tote-girasol": [
    "photo-1553062407-98eeb64c6a62",
    "photo-1590874103328-eac38a683ce7",
  ],
};

async function download(id) {
  const url = `https://images.unsplash.com/${id}?w=800&h=1000&fit=crop&q=80&fm=jpg`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < 5000) throw new Error(`${id}: imagen inválida`);
  return buf;
}

const prods = await db.execute("SELECT id, slug FROM products");
const byslug = Object.fromEntries(prods.rows.map((r) => [r.slug, r.id]));

await db.execute("DELETE FROM product_images");

for (const [slug, ids] of Object.entries(PHOTOS)) {
  const productId = byslug[slug];
  if (!productId) {
    console.log("⚠ producto no encontrado:", slug);
    continue;
  }
  let order = 0;
  for (const id of ids) {
    try {
      const buf = await download(id);
      await db.execute({
        sql: "INSERT INTO product_images (product_id, data, mime_type, file_name, bytes, sort_order) VALUES (?, ?, 'image/jpeg', ?, ?, ?)",
        args: [productId, buf, `${id}.jpg`, buf.byteLength, order],
      });
      console.log(`✔ ${slug} [${order}] ${(buf.byteLength / 1024).toFixed(0)} KB`);
      order++;
    } catch (e) {
      console.log("✖", e.message);
    }
  }
}
console.log("Listo.");
