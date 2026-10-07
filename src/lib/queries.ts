import { and, asc, desc, eq, gte, inArray, like, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, productImages, products } from "@/db/schema";

export type ProductWithImage = {
  id: number;
  slug: string;
  name: string;
  description: string;
  department: string;
  priceUsd: number;
  compareAtUsd: number | null;
  stock: number;
  sizes: string;
  brand: string;
  collection: string;
  isFeatured: boolean;
  imageId: number | null;
  categoryName: string | null;
};

const withFirstImage = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  description: products.description,
  department: products.department,
  priceUsd: products.priceUsd,
  compareAtUsd: products.compareAtUsd,
  stock: products.stock,
  sizes: products.sizes,
  brand: products.brand,
  collection: products.collection,
  isFeatured: products.isFeatured,
  isActive: products.isActive,
  imageId: sql<number | null>`(
    SELECT pi.id FROM product_images pi
    WHERE pi.product_id = ${products.id}
    ORDER BY pi.sort_order, pi.id LIMIT 1
  )`,
  categoryName: categories.name,
};

export async function listProducts(opts: {
  department?: string;
  search?: string;
  size?: string;
  minPrice?: number; // centavos USD
  maxPrice?: number;
  featured?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
  includeInactive?: boolean;
}): Promise<ProductWithImage[]> {
  const conds = [];
  if (!opts.includeInactive) conds.push(eq(products.isActive, true));
  if (opts.department) conds.push(eq(products.department, opts.department));
  if (opts.featured) conds.push(eq(products.isFeatured, true));
  if (opts.size)
    conds.push(sql`',' || ${products.sizes} || ',' LIKE ${`%,${opts.size},%`}`);
  if (opts.minPrice != null) conds.push(gte(products.priceUsd, opts.minPrice));
  if (opts.maxPrice != null) conds.push(lte(products.priceUsd, opts.maxPrice));
  if (opts.search) {
    const q = `%${opts.search.toLowerCase()}%`;
    conds.push(
      sql`(lower(${products.name}) like ${q} or lower(${products.description}) like ${q} or lower(${products.brand}) like ${q})`,
    );
  }

  const order =
    opts.sort === "price-asc"
      ? asc(products.priceUsd)
      : opts.sort === "price-desc"
        ? desc(products.priceUsd)
        : opts.sort === "name"
          ? asc(products.name)
          : desc(products.createdAt);

  return db
    .select(withFirstImage)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(order)
    .limit(opts.limit ?? 48)
    .offset(opts.offset ?? 0);
}

export async function countProducts(opts: {
  department?: string;
  search?: string;
}): Promise<number> {
  const conds = [eq(products.isActive, true)];
  if (opts.department) conds.push(eq(products.department, opts.department));
  if (opts.search) {
    const q = `%${opts.search.toLowerCase()}%`;
    conds.push(sql`lower(${products.name}) like ${q}`);
  }
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(products)
    .where(and(...conds));
  return Number(row?.n ?? 0);
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select(withFirstImage)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  if (!product) return null;
  const images = await db
    .select({ id: productImages.id, sortOrder: productImages.sortOrder })
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.sortOrder), asc(productImages.id));
  return { ...product, images };
}

export async function getProductImages(productId: number) {
  return db
    .select({
      id: productImages.id,
      fileName: productImages.fileName,
      bytes: productImages.bytes,
      sortOrder: productImages.sortOrder,
    })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.sortOrder), asc(productImages.id));
}

export async function listCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function relatedProducts(
  department: string,
  excludeId: number,
): Promise<ProductWithImage[]> {
  return db
    .select(withFirstImage)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        eq(products.department, department),
        sql`${products.id} != ${excludeId}`,
      ),
    )
    .limit(4);
}

export async function productsByIds(ids: number[]) {
  if (!ids.length) return [];
  return db.select().from(products).where(inArray(products.id, ids));
}
