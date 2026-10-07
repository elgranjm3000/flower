"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Usuario</label>
        <input name="username" required autoComplete="username" className="input-sf mt-1" defaultValue="admin" />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Contraseña</label>
        <input name="password" type="password" required autoComplete="current-password" className="input-sf mt-1" />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-700">{state.error}</p>
      )}
      <button disabled={pending} className="btn-navy w-full">
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
