import { getSettings } from "@/lib/settings";
import { CheckoutForm } from "./checkout-form";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const s = await getSettings();
  return (
    <div className="container-sf py-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Finalizar compra</h1>
      <p className="mt-1 text-sm text-slate-body">
        Completa tus datos y elige tu método de pago. Verificamos cada pago por
        WhatsApp antes de despachar.
      </p>
      <CheckoutForm
        payment={{
          pagomovil: {
            phone: s.payment_pagomovil_phone,
            bank: s.payment_pagomovil_bank,
            rif: s.payment_pagomovil_rif,
          },
          zelle: {
            email: s.payment_zelle_email,
            name: s.payment_zelle_name,
          },
        }}
      />
    </div>
  );
}
