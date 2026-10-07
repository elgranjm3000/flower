import Link from "next/link";
import { listProducts } from "@/lib/queries";
import { ProductCard } from "@/components/store/product-card";


const DEPARTMENTS = [
  { href: "/productos?department=damas", label: "Damas", emoji: "👗" },
  { href: "/productos?department=caballeros", label: "Caballeros", emoji: "👔" },
  { href: "/productos?department=calzado", label: "Calzado", emoji: "👟" },
  { href: "/productos?department=accesorios", label: "Accesorios", emoji: "👜" },
];

export default async function HomePage() {
  const featured = await listProducts({ featured: true, limit: 8 });
  const latest = await listProducts({ limit: 8 });

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {/* Imagen de fondo a pantalla completa */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand-logo.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* Velo oscuro para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />

        <div className="container-sf flex min-h-[520px] flex-col justify-center py-16 lg:min-h-[600px]">
          <div className="max-w-2xl">
            <span className="badge-sf border border-gold/40 bg-gold/10 text-gold backdrop-blur-sm">
              Men &amp; Women&apos;s Apparel · Envíos a toda Venezuela
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Ropa de <span className="text-gold">dama y caballero</span> con
              estilo y autenticidad
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Camisas, vestidos, jeans, calzado y accesorios seleccionados
              para cada ocasión. Precios en dólares y bolívares a la tasa
              oficial BCV, con despacho nacional asegurado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/productos?department=damas" className="btn-gold">
                Colección Damas
              </Link>
              <Link href="/productos?department=caballeros" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-bold text-navy transition-colors hover:bg-white/85">
                Colección Caballeros
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
              <span>✓ Pago Móvil y Zelle verificados</span>
              <span>🚚 MRW · Tealca · Zoom · Domesa</span>
              <span>💬 Soporte WhatsApp 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Departamentos */}
      <section className="container-sf mt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {DEPARTMENTS.map((d) => (
            <Link
              key={d.label}
              href={d.href}
              className="flex items-center gap-3 rounded-card border border-line bg-white p-4 font-bold shadow-card transition-all hover:border-gold/60 hover:shadow-card-hover"
            >
              <span className="text-2xl">{d.emoji}</span> {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="container-sf mt-12">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight">
              ★ Colección Sunflower — Destacados
            </h2>
            <Link href="/productos" className="text-sm font-bold text-gold-dark hover:underline">
              Ver todo →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Novedades */}
      <section className="container-sf mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Novedades</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Confianza */}
      <section className="mt-14 bg-[#eef0fa]">
        <div className="container-sf grid grid-cols-1 gap-4 py-12 md:grid-cols-3">
          <div className="rounded-card bg-white p-5 shadow-card">
            <p className="text-lg font-bold">💳 Métodos de Pago Transparentes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Pago Móvil", "Zelle", "Efectivo en Tienda", "Binance Pay"].map((m) => (
                <span key={m} className="badge-sf bg-canvas text-slate-body">{m}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card bg-white p-5 shadow-card">
            <p className="text-lg font-bold">🚚 Envíos a Toda Venezuela</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["MRW", "TEALCA", "ZOOM", "DOMESA", "Pick-up"].map((m) => (
                <span key={m} className="badge-sf bg-canvas text-slate-body">{m}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card bg-white p-5 shadow-card">
            <p className="text-lg font-bold">💬 Garantía y Asistencia</p>
            <p className="mt-3 text-sm leading-6 text-slate-body">
              Nuestro equipo de soporte te acompaña por WhatsApp antes y
              después de tu compra.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
