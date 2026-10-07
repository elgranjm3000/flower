import Link from "next/link";
import { listProducts } from "@/lib/queries";
import { formatUsd } from "@/lib/money";
import { toggleProductActiveAction } from "../../actions";

export const metadata = { title: "Productos" };

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const items = await listProducts({
    search: sp.search,
    includeInactive: true,
    limit: 200,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Productos <span className="text-slate-body">({items.length})</span>
        </h1>
        <div className="flex gap-2">
          <form className="flex gap-2">
            <input name="search" defaultValue={sp.search} placeholder="Buscar..." className="input-sf h-10 w-48" />
            <button className="btn-navy h-10 px-4 text-sm">Buscar</button>
          </form>
          <Link href="/admin/productos/nueva" className="btn-gold h-10 px-4 text-sm">
            + Nuevo producto
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card border border-line bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-slate-body">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Depto.</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-canvas/60">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[#f1f5f9]">
                      {p.imageId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/api/images/${p.imageId}`} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center">🌻</span>
                      )}
                    </div>
                    <div>
                      <Link href={`/admin/productos/${p.id}`} className="font-bold hover:text-gold-dark">
                        {p.name}
                      </Link>
                      {p.isFeatured && <span className="ml-2 badge-sf bg-gold/20 text-gold-dark">★ Destacado</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3 capitalize text-slate-body">{p.department}</td>
                <td className="p-3 font-semibold">{formatUsd(p.priceUsd)}</td>
                <td className={`p-3 font-bold ${p.stock <= 3 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="p-3">
                  <span className={`badge-sf ${p.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                    {p.stock > 0 ? "Activo" : "Sin stock"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleProductActiveAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="active" value={p.stock > 0 ? "0" : "1"} />
                      <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-canvas">
                        {p.stock > 0 ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-light"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-body">
                  No hay productos todavía.{" "}
                  <Link href="/admin/productos/nueva" className="font-bold text-gold-dark hover:underline">
                    Crear el primero →
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
