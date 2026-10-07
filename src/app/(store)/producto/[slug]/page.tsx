import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, relatedProducts } from "@/lib/queries";
import { ProductCard } from "@/components/store/product-card";
import { AddToCartBlock, Gallery, PriceDetail } from "./client-parts";
import { getSiteUrl } from "@/lib/site";
import { formatUsd } from "@/lib/money";


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  const description =
    product.description.slice(0, 155) ||
    `${product.name} — ${formatUsd(product.priceUsd)} con envíos a toda Venezuela. Precios en USD y Bs. a tasa BCV.`;
  const ogImage = product.imageId
    ? { url: `/api/images/${product.imageId}`, width: 800, height: 1000, alt: product.name }
    : { url: "/og-image.jpg", width: 1200, height: 630, alt: product.name };

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: `${getSiteUrl()}/producto/${product.slug}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [ogImage.url],
    },
    alternates: { canonical: `/producto/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();
  const related = await relatedProducts(product.department, product.id);

  // Datos estructurados para Google / WhatsApp / redes sociales
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    sku: `SF-${product.id}`,
    brand: { "@type": "Brand", name: product.brand },
    image: product.imageId ? [`${getSiteUrl()}/api/images/${product.imageId}`] : undefined,
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/producto/${product.slug}`,
      priceCurrency: "USD",
      price: (product.priceUsd / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="container-sf py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-xs text-slate-body">
        <Link href="/" className="hover:text-navy">Inicio</Link>
        <span className="mx-1">/</span>
        <Link href={`/productos?department=${product.department}`} className="capitalize hover:text-navy">
          {product.department}
        </Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-navy">{product.name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Gallery imageIds={product.images.map((i) => i.id)} name={product.name} />

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-body">
            {product.department} · {product.brand}
            {product.collection ? ` · ${product.collection}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{product.name}</h1>

          <div className="mt-3">
            <PriceDetail priceUsd={product.priceUsd} compareAtUsd={product.compareAtUsd} />
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <span className="badge-sf bg-green-100 text-green-800">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="badge-sf bg-red-100 text-red-700">Agotado</span>
            )}
            {product.sizes.split(",").filter(Boolean).map((s) => s.trim()).length > 0 && (
              <span className="text-slate-body">Tallas: {product.sizes}</span>
            )}
          </div>

          {product.description && (
            <div className="mt-6 rounded-card border border-line bg-white p-4 text-sm leading-7 text-slate-body">
              {product.description.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {/* Acciones */}
          <AddToCartBlock
            productId={product.id}
            slug={product.slug}
            name={product.name}
            priceUsd={product.priceUsd}
            imageId={product.imageId}
            sizes={product.sizes.split(",").map((s) => s.trim()).filter(Boolean)}
            stock={product.stock}
          />

          <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-card border border-line bg-white p-3">
              <p className="font-bold">🚚 Envíos nacionales</p>
              <p className="mt-1 text-slate-body">MRW · Tealca · Zoom · Domesa</p>
            </div>
            <div className="rounded-card border border-line bg-white p-3">
              <p className="font-bold">💳 Pagos verificados</p>
              <p className="mt-1 text-slate-body">Pago Móvil · Zelle · Efectivo</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight">También te puede interesar</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
