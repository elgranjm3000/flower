"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";
import { useCurrency } from "@/components/store/currency-provider";
import { formatUsd } from "@/lib/money";

export default function CartPage() {
  const { items, remove, setQuantity, totalUsd, count, clear } = useCart();
  const { bcvRateCents } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="container-sf py-20 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mt-2 text-slate-body">Descubre nuestra nueva colección.</p>
        <Link href="/productos" className="btn-gold mt-6">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container-sf py-8">
      <h1 className="text-2xl font-extrabold tracking-tight">
        Tu carrito <span className="text-slate-body">({count} artículos)</span>
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 rounded-card border border-line bg-white p-3 shadow-card"
            >
              <Link href={`/producto/${item.slug}`} className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f1f5f9]">
                {item.imageId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/images/${item.imageId}`} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-2xl">🌻</span>
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/producto/${item.slug}`} className="font-bold hover:text-gold-dark">
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="text-xs font-semibold uppercase text-slate-body">Talla: {item.size}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(item.productId, item.size)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex h-9 items-center rounded-lg border border-line">
                    <button onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)} className="px-3 font-bold text-slate-body hover:text-navy">−</button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)} className="px-3 font-bold text-slate-body hover:text-navy">+</button>
                  </div>
                  <p className="font-extrabold text-navy">
                    {formatUsd(item.priceUsd * item.quantity)}
                    <span className="ml-2 text-xs font-semibold text-slate-body">
                      Bs. {((item.priceUsd * item.quantity * bcvRateCents) / 100 / 100).toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clear} className="self-start text-sm text-slate-body hover:text-red-600">
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Resumen del pedido</p>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-slate-body">Subtotal</span>
            <span className="font-bold">{formatUsd(totalUsd)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-slate-body">Envío</span>
            <span className="font-bold text-green-700">
              {totalUsd >= 5000 ? "Gratis" : "A coordinar"}
            </span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span className="font-bold">Total</span>
            <span className="text-xl font-extrabold">{formatUsd(totalUsd)}</span>
          </div>
          <Link href="/checkout" className="btn-gold mt-5 w-full">
            Continuar al pago →
          </Link>
          <Link href="/productos" className="mt-3 block text-center text-sm text-slate-body hover:text-navy">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
