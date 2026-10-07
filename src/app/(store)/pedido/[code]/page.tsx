import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { formatBs, formatUsd } from "@/lib/money";

export const metadata = { title: "Pedido confirmado" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente de pago",
  verifying: "Pago por verificar",
  paid: "Pago confirmado ✓",
  shipped: "Despachado 🚚",
  delivered: "Entregado ✓",
  cancelled: "Cancelado",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code))
    .limit(1);
  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  const s = await getSettings();
  const totalBs = Math.round(order.totalUsd * (order.bcvRate / 100));

  return (
    <div className="container-sf max-w-2xl py-10">
      <div className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
        <p className="text-4xl">🌻</p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
          ¡Gracias por tu compra, {order.customerName.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-body">
          Tu pedido{" "}
          <span className="font-bold text-navy">{order.code}</span> quedó
          registrado con estado{" "}
          <span className="font-bold">{STATUS_LABEL[order.status] ?? order.status}</span>.
          Te contactaremos por WhatsApp ({order.customerPhone}) para confirmar
          el pago y coordinar el despacho por {order.shippingMethod}.
        </p>

        <div className="mt-6 rounded-lg bg-canvas p-4 text-sm">
          <p className="font-bold">Resumen</p>
          <div className="mt-2 flex flex-col gap-1">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="text-slate-body">
                  {i.quantity}× {i.productName} {i.size && `(${i.size})`}
                </span>
                <span className="font-semibold">{formatUsd(i.unitPriceUsd * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 font-extrabold">
            <span>Total</span>
            <span>
              {formatUsd(order.totalUsd)}{" "}
              <span className="text-xs font-semibold text-slate-body">
                ({formatBs(totalBs)})
              </span>
            </span>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-body">
          <p>
            ¿Dudas con tu pago? Escríbenos por WhatsApp con tu número de pedido:{" "}
            <a
              href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(
                `Hola, consulto por mi pedido ${order.code}`,
              )}`}
              className="font-bold text-whatsapp-dark hover:underline"
            >
              Chatear con soporte →
            </a>
          </p>
        </div>

        <Link href="/productos" className="btn-outline mt-8 w-full">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
