"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { CurrencyToggle, useCurrency } from "./currency-provider";
import { formatUsd } from "@/lib/money";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/productos?department=damas", label: "Damas" },
  { href: "/productos?department=caballeros", label: "Caballeros" },
  { href: "/productos?department=calzado", label: "Calzado" },
  { href: "/productos?department=accesorios", label: "Accesorios" },
  { href: "/productos?sort=price-asc", label: "🔥 Ofertas" },
];

export function Header({
  storeName,
  bcvRate,
  whatsapp,
}: {
  storeName: string;
  bcvRate: string;
  whatsapp: string;
}) {
  const { count, totalUsd } = useCart();
  const { bcvRateCents } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-[0_4px_12px_0_rgba(13,27,42,0.06)]">
      {/* Barra superior: tasa BCV + toggle divisa */}
      <div className="bg-navy text-white">
        <div className="container-sf flex h-9 items-center justify-between gap-2 text-xs">
          <p className="truncate">
            <span className="font-bold text-gold">Tasa BCV del día:</span>{" "}
            Bs. {Number(bcvRate).toLocaleString("es-VE", { minimumFractionDigits: 2 })} / USD
          </p>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <CurrencyToggle />
            </div>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 rounded-full bg-whatsapp px-3 py-1 font-bold text-white sm:flex"
            >
              💬 Asesoría
            </a>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="bg-white">
        <div className="container-sf flex h-16 items-center gap-4">
          <button
            className="rounded-lg p-2 hover:bg-canvas md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-2xl">🌻</span>
            <span className="hidden text-lg font-extrabold tracking-tight sm:block">
              {storeName}
            </span>
          </Link>

          <form action="/productos" className="flex h-10 flex-1 items-center overflow-hidden rounded-full border border-line">
            <input
              name="search"
              placeholder="Buscar productos..."
              className="h-full min-w-0 flex-1 px-4 text-sm outline-none"
            />
            <button className="h-full bg-gold px-4 text-navy" aria-label="Buscar">
              🔍
            </button>
          </form>

          <Link
            href="/carrito"
            className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-navy px-4 text-sm font-bold text-white"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">{formatUsd(totalUsd)}</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-extrabold text-navy">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* Nav desktop */}
        <nav className="hidden bg-navy md:block">
          <div className="container-sf flex h-11 items-center gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-1.5 font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <span className="ml-auto text-xs font-bold text-gold">
              ✓ Pago Móvil &amp; Zelle Verificados
            </span>
          </div>
        </nav>

        {/* Nav móvil desplegable */}
        {open && (
          <nav className="border-t border-line bg-navy md:hidden">
            <div className="container-sf flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2.5 font-semibold text-white/80 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-2 py-3">
                <CurrencyToggle />
              </div>
            </div>
          </nav>
        )}
      </div>
      {/* bcvRateCents se expone vía provider; referencia para lint */}
      <span className="hidden">{String(bcvRateCents)}</span>
    </header>
  );
}

export function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-2xl text-white shadow-float transition-transform hover:scale-105"
    >
      💬
    </a>
  );
}
