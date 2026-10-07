import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatUsd } from "@/lib/money";
import { StatusPill } from "@/components/admin/status-pill";

export const metadata = { title: "Pedidos" };

export default async function AdminOrders() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">
        Pedidos <span className="text-slate-body">({rows.length})</span>
      </h1>

      <div className="mt-6 overflow-x-auto rounded-card border border-line bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-slate-body">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Pago</th>
              <th className="p-3">Envío</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((o) => (
              <tr key={o.id} className="hover:bg-canvas/60">
                <td className="p-3">
                  <Link href={`/admin/pedidos/${o.id}`} className="font-bold hover:text-gold-dark">
                    {o.code}
                  </Link>
                </td>
                <td className="p-3">
                  {o.customerName}
                  <span className="block text-xs text-slate-body">{o.customerPhone}</span>
                </td>
                <td className="p-3 capitalize">{o.paymentMethod}</td>
                <td className="p-3">{o.shippingMethod}</td>
                <td className="p-3 font-bold">{formatUsd(o.totalUsd)}</td>
                <td className="p-3"><StatusPill status={o.status} /></td>
                <td className="p-3 text-xs text-slate-body">{o.createdAt}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-body">
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
