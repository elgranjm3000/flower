"use client";

import Link from "next/link";
import type { ProductWithImage } from "@/lib/queries";
import { useCurrency } from "./currency-provider";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: ProductWithImage }) {
  const { price } = useCurrency();
  const { add } = useCart();
  const off =
    product.compareAtUsd && product.compareAtUsd > product.priceUsd
      ? Math.round(100 - (product.priceUsd / product.compareAtUsd) * 100)
      : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-card-hover">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-4/5 overflow-hidden bg-[#f1f5f9]">
        {product.imageId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/images/${product.imageId}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-4xl text-slate-body/30">
            🌻
          </span>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {off > 0 && (
            <span className="badge-sf bg-red-600 text-white">-{off}% OFF</span>
          )}
          {product.stock === 0 && (
            <span className="badge-sf bg-slate-body text-white">Agotado</span>
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <span className="badge-sf bg-gold text-navy">¡Últimas!</span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-body">
          {product.department} · {product.brand}
        </p>
        <Link
          href={`/producto/${product.slug}`}
          className="line-clamp-2 text-sm font-bold leading-5 hover:text-gold-dark"
        >
          {product.name}
        </Link>
        {product.sizes && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.split(",").filter(Boolean).slice(0, 6).map((s) => (
              <span
                key={s}
                className="rounded border border-line px-1.5 py-0.5 text-[10px] font-semibold text-slate-body"
              >
                {s.trim()}
              </span>
            ))}
          </div>
        )}
        <p className="mt-auto text-lg font-extrabold text-navy">{price(product.priceUsd)}</p>
        <div className="flex gap-2">
          <button
            disabled={product.stock === 0}
            onClick={() =>
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                size: product.sizes.split(",")[0]?.trim() || "",
                priceUsd: product.priceUsd,
                imageId: product.imageId,
                quantity: 1,
              })
            }
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold text-sm font-bold text-navy transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            🛒 Comprar
          </button>
          <Link
            href={`/producto/${product.slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy text-sm text-navy hover:bg-navy/5"
            aria-label="Ver detalle"
          >
            👁
          </Link>
        </div>
      </div>
    </div>
  );
}
