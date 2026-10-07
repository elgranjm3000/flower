"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { useCurrency } from "@/components/store/currency-provider";
import { formatBs, formatUsd, usdToBs } from "@/lib/money";

const SHIPPING = ["MRW", "TEALCA", "ZOOM", "DOMESA", "RETIRO en tienda"];

type PaymentInfo = {
  pagomovil: { phone: string; bank: string; rif: string };
  zelle: { email: string; name: string };
};

export function CheckoutForm({ payment }: { payment: PaymentInfo }) {
  const { items, totalUsd, clear } = useCart();
  const { bcvRateCents } = useCurrency();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payMethod, setPayMethod] = useState<"pagomovil" | "zelle" | "efectivo">("pagomovil");

  const totalBs = usdToBs(totalUsd, bcvRateCents);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (items.length === 0) return;
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fd.get("customerName"),
          customerPhone: fd.get("customerPhone"),
          customerEmail: fd.get("customerEmail") ?? "",
          shippingMethod: fd.get("shippingMethod"),
          shippingAddress: fd.get("shippingAddress") ?? "",
          paymentMethod: payMethod,
          paymentReference: fd.get("paymentReference") ?? "",
          notes: fd.get("notes") ?? "",
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pedido");
      clear();
      router.push(`/pedido/${data.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-card border border-dashed border-line bg-white p-10 text-center">
        <p className="font-bold">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Datos personales */}
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">1. Tus datos</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Nombre y apellido *</label>
              <input name="customerName" required className="input-sf mt-1" placeholder="María Pérez" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Teléfono / WhatsApp *</label>
              <input name="customerPhone" required className="input-sf mt-1" placeholder="0412-1234567" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Email (opcional)</label>
              <input name="customerEmail" type="email" className="input-sf mt-1" placeholder="tucorreo@email.com" />
            </div>
          </div>
        </section>

        {/* Envío */}
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">2. Entrega</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Encomienda / Retiro *</label>
              <select name="shippingMethod" className="input-sf mt-1" defaultValue="MRW">
                {SHIPPING.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Agencia / Dirección</label>
              <input name="shippingAddress" className="input-sf mt-1" placeholder="Agencia MRW Chacao, Av...." />
            </div>
          </div>
        </section>

        {/* Pago */}
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">3. Método de pago</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["pagomovil", "Pago Móvil"],
                ["zelle", "Zelle"],
                ["efectivo", "Efectivo en tienda"],
              ] as const
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => setPayMethod(value)}
                className={`rounded-lg border-[1.5px] px-4 py-2 text-sm font-bold transition-colors ${
                  payMethod === value ? "border-navy bg-navy text-white" : "border-line hover:border-navy"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {payMethod === "pagomovil" && (
            <div className="mt-4 rounded-lg bg-canvas p-4 text-sm">
              <p className="font-bold">Datos para Pago Móvil:</p>
              <p className="mt-1">Banco: {payment.pagomovil.bank}</p>
              <p>Teléfono: {payment.pagomovil.phone}</p>
              <p>RIF: {payment.pagomovil.rif}</p>
              <p className="mt-2 font-bold text-navy">
                Monto exacto a transferir: {formatBs(totalBs)} (tasa BCV)
              </p>
            </div>
          )}
          {payMethod === "zelle" && (
            <div className="mt-4 rounded-lg bg-canvas p-4 text-sm">
              <p className="font-bold">Datos para Zelle:</p>
              <p className="mt-1">Correo: {payment.zelle.email}</p>
              <p>Titular: {payment.zelle.name}</p>
              <p className="mt-2 font-bold text-navy">Monto exacto: {formatUsd(totalUsd)}</p>
            </div>
          )}
          {payMethod === "efectivo" && (
            <div className="mt-4 rounded-lg bg-canvas p-4 text-sm">
              <p>Coordina el pago en efectivo al retirar tu pedido en tienda.</p>
            </div>
          )}

          {(payMethod === "pagomovil" || payMethod === "zelle") && (
            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">
                Referencia / Nº de confirmación *
              </label>
              <input name="paymentReference" required className="input-sf mt-1" placeholder="Ej: 001234567890" />
            </div>
          )}

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-body">
              Notas para el vendedor
            </label>
            <textarea name="notes" rows={2} className="input-sf mt-1 h-auto py-2" placeholder="Indicaciones de entrega, captura de pago, etc." />
          </div>
        </section>
      </div>

      {/* Resumen */}
      <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-card">
        <p className="font-bold">Tu pedido</p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          {items.map((i) => (
            <div key={`${i.productId}-${i.size}`} className="flex justify-between gap-2">
              <span className="text-slate-body">
                {i.quantity}× {i.name} {i.size && `(${i.size})`}
              </span>
              <span className="shrink-0 font-semibold">{formatUsd(i.priceUsd * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span className="font-bold">Total</span>
          <div className="text-right">
            <p className="text-xl font-extrabold">{formatUsd(totalUsd)}</p>
            <p className="text-xs font-semibold text-slate-body">{formatBs(totalBs)}</p>
          </div>
        </div>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-700">{error}</p>
        )}
        <button disabled={loading} className="btn-gold mt-5 w-full">
          {loading ? "Procesando..." : "Confirmar pedido"}
        </button>
        <p className="mt-3 text-xs leading-5 text-slate-body">
          Al confirmar, registraremos tu pedido con estado «Pago por verificar».
          Te contactaremos por WhatsApp para confirmar la transferencia y el despacho.
        </p>
      </aside>
    </form>
  );
}
