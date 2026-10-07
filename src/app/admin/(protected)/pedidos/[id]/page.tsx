import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatBs, formatUsd } from "@/lib/money";
import { updateOrderStatusAction } from "../../../actions";
import { StatusPill } from "@/components/admin/status-pill";

export const metadata = { title: "Detalle de pedido" };

const STATUSES = [
  ["pending", "Pendiente de pago"],
  ["verifying", "Pago por verificar"],
  ["paid", "Pago confirmado"],
  ["shipped", "Despachado"],
  ["delivered", "Entregado"],
  ["cancelled", "Cancelado"],
] as const;

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const totalBs = Math.round(order.totalUsd * (order.bcvRate / 100));

  const waMessage = encodeURIComponent(
    `Hola ${order.customerName}, te escribimos de Sunflower por tu pedido ${order.code}.`,
  );

  return (
    <div>
      <nav className="text-xs text-slate-body">
        <Link href="/admin/pedidos" className="hover:text-navy">Pedidos</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-navy">{order.code}</span>
      </nav>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Pedido {order.code}</h1>
        <StatusPill status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-card border border-line bg-white p-5 shadow-card">
            <p className="font-bold">Artículos</p>
            <div className="mt-3 flex flex-col divide-y divide-line text-sm">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between py-2">
                  <span>
                    {i.quantity}× <span className="font-semibold">{i.productName}</span>
                    {i.size && <span className="ml-1 text-slate-body">(talla {i.size})</span>}
                  </span>
                  <span className="font-bold">{formatUsd(i.unitPriceUsd * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3">
              <span className="font-bold">Total</span>
              <div className="text-right">
                <p className="text-xl font-extrabold">{formatUsd(order.totalUsd)}</p>
                <p className="text-xs font-semibold text-slate-body">
                  {formatBs(totalBs)} · tasa captada: Bs. {(order.bcvRate / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {order.notes && (
            <section className="rounded-card border border-line bg-white p-5 shadow-card">
              <p className="font-bold">Notas del cliente</p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-body">{order.notes}</p>
            </section>
          )}
        </div>

        <aside className="flex h-fit flex-col gap-6">
          <section className="rounded-card border border-line bg-white p-5 shadow-card text-sm">
            <p className="font-bold">Cliente</p>
            <p className="mt-2 font-semibold">{order.customerName}</p>
            <p className="text-slate-body">📞 {order.customerPhone}</p>
            {order.customerEmail && <p className="text-slate-body">✉️ {order.customerEmail}</p>}
            <p className="mt-3 font-bold">Entrega</p>
            <p className="text-slate-body">
              {order.shippingMethod}
              {order.shippingAddress && ` — ${order.shippingAddress}`}
            </p>
            <p className="mt-3 font-bold">Pago</p>
            <p className="capitalize text-slate-body">{order.paymentMethod}</p>
            {order.paymentReference && (
              <p className="text-slate-body">
                Referencia: <span className="font-mono font-bold text-navy">{order.paymentReference}</span>
              </p>
            )}
            {order.paymentAmountBs && (
              <p className="text-slate-body">Monto reportado: {formatBs(order.paymentAmountBs)}</p>
            )}
            <a
              href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-whatsapp px-3 py-1.5 text-xs font-bold text-white"
            >
              💬 Contactar por WhatsApp
            </a>
          </section>

          <section className="rounded-card border border-line bg-white p-5 shadow-card">
            <p className="font-bold">Cambiar estado</p>
            <form action={updateOrderStatusAction} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={order.id} />
              <select name="status" defaultValue={order.status} className="input-sf mt-0 flex-1">
                {STATUSES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <button className="btn-navy h-11 px-4 text-sm">Guardar</button>
            </form>
            <p className="mt-2 text-xs text-slate-body">Registrado: {order.createdAt}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
