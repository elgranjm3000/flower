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
      <section className="bg-navy text-white">
        <div className="container-sf grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="badge-sf border border-gold/40 bg-gold/10 text-gold">
              Nueva Colección Exclusiva · Tasa Oficial BCV
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Viste con estilo y autenticidad en cada ocasión
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/70">
              Precios claros en dólares y bolívares a la tasa oficial BCV.
              Paga con Pago Móvil, Zelle o en efectivo. Envíos a toda
              Venezuela con MRW, Tealca y Zoom.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/productos?department=damas" className="btn-gold">
                Ver Colección Damas
              </Link>
              <Link href="/productos?department=caballeros" className="btn-outline border-white text-white hover:bg-white/10">
                Colección Caballeros
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-white/60">
              <span>✓ Pago Móvil y Zelle verificados</span>
              <span>🚚 Envíos nacionales</span>
              <span>💬 Soporte WhatsApp 24/7</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:ml-auto lg:max-w-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Beneficio exclusivo · Hoy
            </p>
            <p className="mt-2 text-2xl font-extrabold">Envío Nacional Gratis</p>
            <p className="mt-1 text-sm text-white/70">En compras desde $50 USD</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["MRW", "TEALCA", "ZOOM", "DOMESA"].map((c) => (
                <span key={c} className="badge-sf border border-white/20 text-white/80">
                  {c}
                </span>
              ))}
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
