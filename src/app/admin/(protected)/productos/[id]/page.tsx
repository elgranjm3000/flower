import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductImages } from "@/lib/queries";
import { deleteImageAction, deleteProductAction } from "../../../actions";
import { ProductForm } from "./product-form";

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) notFound();

  const images = await getProductImages(product.id);

  return (
    <div>
      <nav className="text-xs text-slate-body">
        <Link href="/admin/productos" className="hover:text-navy">Productos</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-navy">{product.name}</span>
      </nav>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Editar producto</h1>

      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          department: product.department,
          priceUsd: product.priceUsd,
          compareAtUsd: product.compareAtUsd,
          stock: product.stock,
          sizes: product.sizes,
          brand: product.brand,
          collection: product.collection,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
        }}
      />

      {/* Galería existente */}
      <section className="mt-8 rounded-card border border-line bg-white p-5 shadow-card">
        <p className="font-bold">
          Imágenes actuales <span className="text-slate-body">({images.length})</span>
        </p>
        {images.length === 0 ? (
          <p className="mt-2 text-sm text-slate-body">
            Este producto todavía no tiene imágenes. Súbelas desde el formulario de arriba.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((img, i) => (
              <div key={img.id} className="group relative overflow-hidden rounded-lg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/images/${img.id}`} alt="" className="aspect-4/5 w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 badge-sf bg-gold text-navy">Portada</span>
                )}
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  {Math.max(1, Math.round(img.bytes / 1024))} KB
                </span>
                <form action={deleteImageAction} className="absolute right-1 top-1">
                  <input type="hidden" name="imageId" value={img.id} />
                  <button
                    className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Eliminar imagen"
                  >
                    ✕
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Zona de peligro */}
      <section className="mt-8 rounded-card border border-red-200 bg-red-50 p-5">
        <p className="font-bold text-red-800">Eliminar producto</p>
        <p className="mt-1 text-sm text-red-700">
          Se eliminan también todas sus imágenes. Esta acción no se puede deshacer.
        </p>
        <form action={deleteProductAction} className="mt-3">
          <input type="hidden" name="id" value={product.id} />
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
            Eliminar definitivamente
          </button>
        </form>
      </section>
    </div>
  );
}
