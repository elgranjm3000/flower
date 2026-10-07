import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { formatUsd } from "@/lib/money";
import { StatusPill } from "@/components/admin/status-pill";

export const metadata = { title: "Resumen" };

export default async function AdminDashboard() {
  const [prodStats] = await db
    .select({
      total: sql<number>`count(*)`,
      active: sql<number>`sum(case when is_active then 1 else 0 end)`,
      lowStock: sql<number>`sum(case when stock <= 3 then 1 else 0 end)`,
    })
    .from(products);

  const [orderStats] = await db
    .select({
      total: sql<number>`count(*)`,
      pending: sql<number>`sum(case when status in ('pending','verifying') then 1 else 0 end)`,
      revenue: sql<number>`coalesce(sum(case when status in ('paid','shipped','delivered') then total_usd else 0 end), 0)`,
    })
    .from(orders);

  const recent = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(8);

  const lowStock = await db
    .select({ id: products.id, name: products.name, stock: products.stock })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(products.stock)
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Resumen</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Productos activos" value={`${prodStats?.active ?? 0} / ${prodStats?.total ?? 0}`} href="/admin/productos" />
        <StatCard label="Pedidos por verificar" value={String(orderStats?.pending ?? 0)} href="/admin/pedidos" highlight />
        <StatCard label="Ventas confirmadas" value={formatUsd(Number(orderStats?.revenue ?? 0))} />
        <StatCard label="Stock bajo (≤3)" value={String(prodStats?.lowStock ?? 0)} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-bold">Últimos pedidos</p>
            <Link href="/admin/pedidos" className="text-sm font-bold text-gold-dark hover:underline">Ver todos →</Link>
          </div>
          <div className="mt-3 flex flex-col divide-y divide-line text-sm">
            {recent.length === 0 && <p className="py-4 text-slate-body">Aún no hay pedidos.</p>}
            {recent.map((o) => (
              <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="flex items-center justify-between gap-2 py-2 hover:text-gold-dark">
                <span className="font-semibold">{o.code}</span>
                <span className="text-slate-body">{o.customerName}</span>
                <StatusPill status={o.status} />
                <span className="font-bold">{formatUsd(o.totalUsd)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Stock más bajo</p>
          <div className="mt-3 flex flex-col divide-y divide-line text-sm">
            {lowStock.map((p) => (
              <Link key={p.id} href={`/admin/productos/${p.id}`} className="flex items-center justify-between py-2 hover:text-gold-dark">
                <span>{p.name}</span>
                <span className={`font-bold ${p.stock <= 3 ? "text-red-600" : "text-slate-body"}`}>
                  {p.stock} uds
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div className={`rounded-card border p-4 shadow-card ${highlight ? "border-gold bg-gold/10" : "border-line bg-white"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-body">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
