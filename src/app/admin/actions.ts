"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, productImages, products, settings } from "@/db/schema";
import {
  checkCredentials,
  clearAdminCookie,
  getAdminSession,
  setAdminCookie,
} from "@/lib/auth";
import { slugify } from "@/lib/money";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
}

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  if (!checkCredentials(username, password)) {
    return { error: "Usuario o contraseña incorrectos" };
  }
  await setAdminCookie(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminCookie();
  redirect("/admin/login");
}

/* ---------- Productos ---------- */

export type ProductFormState = { error?: string; ok?: boolean };

export async function saveProductAction(
  _prev: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const id = Number(formData.get("id") || 0);
  const name = String(formData.get("name") || "").trim();
  const priceUsd = Math.round(parseFloat(String(formData.get("priceUsd") || "0")) * 100);
  if (!name || !(priceUsd > 0)) {
    return { error: "El nombre y el precio (USD) son obligatorios" };
  }

  const compareRaw = parseFloat(String(formData.get("compareAtUsd") || ""));
  const values = {
    name,
    slug: slugify(name) || `producto-${Date.now()}`,
    description: String(formData.get("description") || ""),
    department: String(formData.get("department") || "damas"),
    priceUsd,
    compareAtUsd: compareRaw > 0 ? Math.round(compareRaw * 100) : null,
    stock: Math.max(0, parseInt(String(formData.get("stock") || "0")) || 0),
    sizes: String(formData.get("sizes") || "")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
      .join(","),
    brand: String(formData.get("brand") || "Sunflower").trim(),
    collection: String(formData.get("collection") || "").trim(),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
    updatedAt: new Date().toISOString(),
  };

  let productId = id;
  if (id > 0) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    const [created] = await db.insert(products).values(values).returning();
    productId = created.id;
  }

  // Subida de imágenes: se guardan en BINARIO (BLOB) en la base de datos.
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  let orderBase =
    (
      await db
        .select({ sortOrder: productImages.sortOrder })
        .from(productImages)
        .where(eq(productImages.productId, productId))
    ).at(-1)?.sortOrder ?? -1;

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    if (file.size > 5 * 1024 * 1024) continue; // máx 5 MB por imagen
    const buffer = Buffer.from(await file.arrayBuffer());
    orderBase += 1;
    await db.insert(productImages).values({
      productId,
      data: buffer,
      mimeType: file.type,
      fileName: file.name,
      bytes: buffer.byteLength,
      sortOrder: orderBase,
    });
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect(`/admin/productos/${productId}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  if (id > 0) await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function deleteImageAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("imageId") || 0);
  if (id > 0) await db.delete(productImages).where(eq(productImages.id, id));
  revalidatePath("/admin/productos");
}

export async function toggleProductActiveAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const active = formData.get("active") === "1";
  if (id > 0) {
    await db
      .update(products)
      .set({ isActive: active, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id));
  }
  revalidatePath("/admin/productos");
  revalidatePath("/");
}

/* ---------- Pedidos ---------- */

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const status = String(formData.get("status") || "");
  const allowed = ["pending", "verifying", "paid", "shipped", "delivered", "cancelled"];
  if (id > 0 && allowed.includes(status)) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}

/* ---------- Configuración ---------- */

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const keys = [
    "bcv_rate",
    "whatsapp",
    "store_name",
    "payment_pagomovil_phone",
    "payment_pagomovil_bank",
    "payment_pagomovil_rif",
    "payment_zelle_email",
    "payment_zelle_name",
    "free_shipping_min",
  ];
  for (const key of keys) {
    const value = formData.get(key);
    if (value == null) continue;
    await db
      .insert(settings)
      .values({ key, value: String(value), updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: String(value), updatedAt: new Date().toISOString() },
      });
  }
  revalidatePath("/", "layout");
}
