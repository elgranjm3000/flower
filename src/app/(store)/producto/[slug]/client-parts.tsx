"use client";

import { useState } from "react";
import { useCurrency } from "@/components/store/currency-provider";
import { useCart } from "@/components/store/cart-provider";
import { formatBs, formatUsd, usdToBs } from "@/lib/money";

export function Gallery({
  imageIds,
  name,
}: {
  imageIds: number[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = imageIds[active];

  return (
    <div>
      <div className="aspect-4/5 overflow-hidden rounded-card border border-line bg-[#f1f5f9]">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/images/${current}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-6xl text-slate-body/30">
            🌻
          </span>
        )}
      </div>
      {imageIds.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {imageIds.map((id, i) => (
            <button
              key={id}
              onClick={() => setActive(i)}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-gold" : "border-line hover:border-slate-body"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/images/${id}`} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PriceDetail({
  priceUsd,
  compareAtUsd,
}: {
  priceUsd: number;
  compareAtUsd: number | null;
}) {
  const { bcvRateCents } = useCurrency();
  const off =
    compareAtUsd && compareAtUsd > priceUsd
      ? Math.round(100 - (priceUsd / compareAtUsd) * 100)
      : 0;

  return (
    <div>
      {off > 0 && (
        <p className="flex items-center gap-2">
          <span className="badge-sf bg-red-600 text-white">-{off}% OFF</span>
          <span className="text-sm text-slate-body line-through">
            {formatUsd(compareAtUsd!)}
          </span>
        </p>
      )}
      <p className="text-3xl font-extrabold text-navy">{formatUsd(priceUsd)}</p>
      <p className="text-sm font-semibold text-slate-body">
        {formatBs(usdToBs(priceUsd, bcvRateCents))}{" "}
        <span className="text-xs">· Tasa oficial BCV</span>
      </p>
    </div>
  );
}

export function AddToCartBlock({
  productId,
  slug,
  name,
  priceUsd,
  imageId,
  sizes,
  stock,
}: {
  productId: number;
  slug: string;
  name: string;
  priceUsd: number;
  imageId: number | null;
  sizes: string[];
  stock: number;
}) {
  const { add } = useCart();
  const [size, setSize] = useState(sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock === 0) {
    return (
      <button disabled className="btn-gold mt-6 w-full opacity-60">
        Producto agotado
      </button>
    );
  }

  return (
    <div className="mt-6">
      {sizes.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-body">
            Selecciona tu talla
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-10 min-w-10 rounded-lg border-[1.5px] px-3 text-sm font-bold transition-colors ${
                  size === s
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-navy hover:border-navy"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 items-center rounded-lg border border-line bg-white">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="h-full px-3 text-lg font-bold text-slate-body hover:text-navy"
          >
            −
          </button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty(Math.min(stock, qty + 1))}
            className="h-full px-3 text-lg font-bold text-slate-body hover:text-navy"
          >
            +
          </button>
        </div>
        <button
          onClick={() => {
            add({ productId, slug, name, size, priceUsd, imageId, quantity: qty });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="btn-gold flex-1"
        >
          {added ? "✓ Añadido al carrito" : "🛒 Añadir al Carrito"}
        </button>
      </div>
      <a href="/carrito" className="btn-outline mt-3 w-full">
        Ver carrito y finalizar compra
      </a>
    </div>
  );
}
