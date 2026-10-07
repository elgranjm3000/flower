import { sql } from "drizzle-orm";
import {
  blob,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    // Departamento: damas | caballeros | calzado | accesorios
    department: text("department").notNull().default("damas"),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    // Precio base en USD (única fuente de verdad; Bs. se calcula con la tasa BCV)
    priceUsd: integer("price_usd").notNull(), // centavos
    compareAtUsd: integer("compare_at_usd"), // precio tachado, centavos
    stock: integer("stock").notNull().default(0),
    // Tallas separadas por coma: "S,M,L,XL"
    sizes: text("sizes").notNull().default(""),
    brand: text("brand").notNull().default("Sunflower"),
    collection: text("collection").notNull().default(""),
    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_department_idx").on(t.department),
    index("products_active_idx").on(t.isActive),
  ],
);

/**
 * Galería de productos. Las imágenes se guardan en BINARIO (BLOB)
 * directamente en la base de datos, como pidió el cliente.
 * Se sirven vía /api/images/[id] con caché inmutable.
 */
export const productImages = sqliteTable(
  "product_images",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    data: blob("data", { mode: "buffer" }).notNull(),
    mimeType: text("mime_type").notNull().default("image/jpeg"),
    fileName: text("file_name").notNull().default(""),
    bytes: integer("bytes").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull(), // SF-2026-0001
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email").notNull().default(""),
    // Dirección / agencia de encomienda
    shippingMethod: text("shipping_method").notNull().default("MRW"), // MRW|TEALCA|ZOOM|DOMESA|RETIRO
    shippingAddress: text("shipping_address").notNull().default(""),
    // pago: pagomovil | zelle | efectivo
    paymentMethod: text("payment_method").notNull().default("pagomovil"),
    paymentReference: text("payment_reference").notNull().default(""),
    paymentAmountBs: integer("payment_amount_bs"), // centavos de bolívares
    // pending | verifying | paid | shipped | delivered | cancelled
    status: text("status").notNull().default("pending"),
    totalUsd: integer("total_usd").notNull(), // centavos
    bcvRate: integer("bcv_rate").notNull(), // céntimos de Bs por 1 USD (x100)
    notes: text("notes").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("orders_code_idx").on(t.code),
    index("orders_status_idx").on(t.status),
  ],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    size: text("size").notNull().default(""),
    unitPriceUsd: integer("unit_price_usd").notNull(), // centavos
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

/** Configuración clave-valor: tasa BCV, WhatsApp, datos de pago, etc. */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
