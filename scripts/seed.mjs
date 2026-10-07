// Seed inicial: categorías + productos demo con imágenes SVG guardadas como BLOB.
// Uso: node scripts/seed.mjs
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

function svg(color, label) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
      <rect width="800" height="1000" fill="${color}"/>
      <text x="400" y="500" font-family="sans-serif" font-size="56" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
      <text x="400" y="570" font-family="sans-serif" font-size="32" fill="#ffffff" text-anchor="middle">Sunflower by Company</text>
    </svg>`,
  );
}

const categories = [
  ["damas", "Damas", 1],
  ["caballeros", "Caballeros", 2],
  ["calzado", "Calzado", 3],
  ["accesorios", "Accesorios", 4],
];

const products = [
  {
    name: "Vestido Lino Bel Air",
    department: "damas", price: 3999, compare: 4999, stock: 12, sizes: "S,M,L,XL",
    featured: true, collection: "Sunflower Signature", color: "#0d1b2a",
    desc: "Vestido en lino premium, fresco y elegante para cualquier ocasión.\nCorte midi con detalle en cintura.\nLavar en frío con colores similares.",
  },
  {
    name: "Blusa Satén Amanecer",
    department: "damas", price: 2499, compare: null, stock: 20, sizes: "S,M,L",
    featured: true, collection: "Casual Wear", color: "#d49e35",
    desc: "Blusa de satén con caída suave y brillo natural.",
  },
  {
    name: "Jeans Slim Denim Co.",
    department: "caballeros", price: 3299, compare: 3999, stock: 15, sizes: "30,32,34,36",
    featured: true, collection: "Denim Co.", color: "#1a2744",
    desc: "Jean slim fit en denim stretch de alta durabilidad.",
  },
  {
    name: "Camisa Lino Premium",
    department: "caballeros", price: 2899, compare: null, stock: 18, sizes: "S,M,L,XL,XXL",
    featured: false, collection: "Casual Wear", color: "#4a5568",
    desc: "Camisa de lino transpirable, ideal para el clima venezolano.",
  },
  {
    name: "Zapatillas Urbanas Sky",
    department: "calzado", price: 4599, compare: 5599, stock: 8, sizes: "38,39,40,41,42",
    featured: true, collection: "", color: "#128c7e",
    desc: "Zapatillas urbanas con suela ligera y cobertura reforzada.",
  },
  {
    name: "Bolso Tote Girasol",
    department: "accesorios", price: 1899, compare: null, stock: 25, sizes: "",
    featured: false, collection: "Sunflower Signature", color: "#c59b27",
    desc: "Bolso tote en lona reforzada con estampado exclusivo Sunflower.",
  },
];

const existing = await db.execute("SELECT count(*) as n FROM products");
if (Number(existing.rows[0].n) > 0) {
  console.log("La base de datos ya tiene productos; seed omitido.");
  process.exit(0);
}

for (const [slug, name, order] of categories) {
  await db.execute({
    sql: "INSERT INTO categories (slug, name, sort_order) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
    args: [slug, name, order],
  });
}
const cats = await db.execute("SELECT id, slug FROM categories");
const catId = Object.fromEntries(cats.rows.map((r) => [r.slug, r.id]));

for (const p of products) {
  const res = await db.execute({
    sql: `INSERT INTO products (slug, name, description, department, category_id, price_usd, compare_at_usd, stock, sizes, collection, is_featured, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          ON CONFLICT (slug) DO NOTHING RETURNING id`,
    args: [
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      p.name, p.desc, p.department, catId[p.department] ?? null,
      p.price, p.compare, p.stock, p.sizes, p.collection, p.featured ? 1 : 0,
    ],
  });
  const id = res.rows[0]?.id;
  if (id) {
    await db.execute({
      sql: "INSERT INTO product_images (product_id, data, mime_type, file_name, bytes, sort_order) VALUES (?, ?, ?, ?, ?, 0)",
      args: [id, svg(p.color, p.name), "image/svg+xml", "demo.svg", 0],
    });
  }
  console.log("✔", p.name);
}

await db.execute({
  sql: "INSERT INTO settings (key, value) VALUES ('bcv_rate', '4200') ON CONFLICT DO NOTHING",
});

console.log("Seed completado.");
