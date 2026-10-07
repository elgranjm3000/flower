import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "../../actions";

export const metadata = { title: "Configuración" };

export default async function AdminConfig() {
  const s = await getSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">Configuración</h1>
      <form action={saveSettingsAction} className="mt-6 flex flex-col gap-6">
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">General</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Nombre de la tienda</label>
              <input name="store_name" defaultValue={s.store_name} className="input-sf mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">WhatsApp (58412...)</label>
              <input name="whatsapp" defaultValue={s.whatsapp} className="input-sf mt-1" />
            </div>
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Tasa BCV</p>
          <p className="mt-1 text-sm text-slate-body">
            Todos los precios en bolívares se calculan con esta tasa. Actualízala cada día.
          </p>
          <div className="mt-3 max-w-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-body">
              Bs. por 1 USD
            </label>
            <input name="bcv_rate" type="number" step="0.01" min="0" defaultValue={s.bcv_rate} className="input-sf mt-1" />
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Pago Móvil</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Teléfono</label>
              <input name="payment_pagomovil_phone" defaultValue={s.payment_pagomovil_phone} className="input-sf mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Banco</label>
              <input name="payment_pagomovil_bank" defaultValue={s.payment_pagomovil_bank} className="input-sf mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">RIF</label>
              <input name="payment_pagomovil_rif" defaultValue={s.payment_pagomovil_rif} className="input-sf mt-1" />
            </div>
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Zelle</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Correo</label>
              <input name="payment_zelle_email" defaultValue={s.payment_zelle_email} className="input-sf mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Titular</label>
              <input name="payment_zelle_name" defaultValue={s.payment_zelle_name} className="input-sf mt-1" />
            </div>
          </div>
        </section>

        <button className="btn-gold w-full sm:w-auto sm:self-start">Guardar configuración</button>
      </form>
    </div>
  );
}
