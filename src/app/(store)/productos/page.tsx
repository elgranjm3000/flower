import type { Metadata } from "next";
import Link from "next/link";
import { listProducts, countProducts } from "@/lib/queries";
import { ProductCard } from "@/components/store/product-card";

export const metadata: Metadata = {
  title: "Catálogo — Moda, calzado y accesorios",
  description:
    "Explora todo el catálogo Sunflower: ropa para damas y caballeros, calzado y accesorios. Precios en USD y Bs. a tasa BCV con envíos a toda Venezuela.",
  alternates: { canonical: "/productos" },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICE_MAX = 200; // USD

type Params = Promise<Record<string, string | undefined>>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const sp = await searchParams;
  const department = sp.department;
  const search = sp.search;
  const size = sp.size;
  const sort = sp.sort ?? "recent";
  const maxPrice = sp.maxPrice ? Math.round(parseFloat(sp.maxPrice) * 100) : undefined;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const perPage = 24;

  const [items, total] = await Promise.all([
    listProducts({
      department,
      search,
      size,
      maxPrice,
      sort,
      limit: perPage,
      offset: (page - 1) * perPage,
    }),
    countProducts({ department, search }),
  ]);

  const pages = Math.max(1, Math.ceil(total / perPage));
  const buildUrl = (over: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    const merged = { department, search, size, sort, maxPrice: sp.maxPrice, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    const s = qs.toString();
    return `/productos${s ? `?${s}` : ""}`;
  };

  return (
    <div className="container-sf py-8">
      {/* Breadcrumb + toolbar */}
      <nav className="text-xs text-slate-body">
        <Link href="/" className="hover:text-navy">Inicio</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-navy">
          {department ? department[0].toUpperCase() + department.slice(1) : "Catálogo"}
        </span>
      </nav>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {search ? `Resultados: “${search}”` : department ? department[0].toUpperCase() + department.slice(1) : "Todo el catálogo"}
        </h1>
        <form className="flex items-center gap-2 text-sm">
          {department && <input type="hidden" name="department" value={department} />}
          {search && <input type="hidden" name="search" value={search} />}
          <label className="text-slate-body">Ordenar por:</label>
          <select
            name="sort"
            defaultValue={sort}
            className="input-sf h-9 w-auto"
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre (A–Z)</option>
          </select>
          <button className="btn-navy h-9 px-3 text-xs">Aplicar</button>
        </form>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Filtros */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="rounded-card border border-line bg-white p-4 shadow-card">
            <p className="flex items-center justify-between font-bold">
              Filtros
              <Link href={buildUrl({ size: undefined, maxPrice: undefined, page: undefined })} className="text-xs font-semibold text-gold-dark hover:underline">
                Limpiar todo
              </Link>
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-body">Tallas</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SIZES.map((s) => (
                <Link
                  key={s}
                  href={buildUrl({ size: size === s ? undefined : s, page: undefined })}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    size === s ? "bg-navy text-white" : "border border-line text-slate-body hover:border-navy"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-body">
              Precio máximo {sp.maxPrice ? `(hasta $${sp.maxPrice})` : ""}
            </p>
            <form className="mt-2 flex gap-2">
              {department && <input type="hidden" name="department" value={department} />}
              {search && <input type="hidden" name="search" value={search} />}
              {size && <input type="hidden" name="size" value={size} />}
              <input
                name="maxPrice"
                type="number"
                min={1}
                max={PRICE_MAX}
                defaultValue={sp.maxPrice}
                placeholder={`Hasta: $${PRICE_MAX} USD`}
                className="input-sf h-9 flex-1"
              />
              <button className="btn-navy h-9 px-3 text-xs">Filtrar</button>
            </form>

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-body">Departamentos</p>
            <div className="mt-2 flex flex-col gap-1 text-sm">
              <Link href={buildUrl({ department: undefined, page: undefined })} className={`rounded px-2 py-1 hover:bg-canvas ${!department ? "font-bold text-navy" : "text-slate-body"}`}>
                Todos
              </Link>
              {["damas", "caballeros", "calzado", "accesorios"].map((d) => (
                <Link key={d} href={buildUrl({ department: d, page: undefined })} className={`rounded px-2 py-1 capitalize hover:bg-canvas ${department === d ? "font-bold text-navy" : "text-slate-body"}`}>
                  {d}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-slate-body">{total} productos disponibles</p>
          {items.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-white p-12 text-center">
              <p className="text-3xl">🌻</p>
              <p className="mt-3 font-bold">No hay productos con estos filtros</p>
              <Link href="/productos" className="btn-gold mt-4 h-10 text-sm">Ver todo el catálogo</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 xl:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={buildUrl({ page: String(page - 1) })} className="btn-outline h-9 px-3 text-sm">
                  ← Anterior
                </Link>
              )}
              <span className="text-sm font-semibold">
                Página {page} de {pages}
              </span>
              {page < pages && (
                <Link href={buildUrl({ page: String(page + 1) })} className="btn-outline h-9 px-3 text-sm">
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
