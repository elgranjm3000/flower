import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Acceso administrativo" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-float">
        <p className="text-center text-3xl">🌻</p>
        <h1 className="mt-2 text-center text-xl font-extrabold">
          Panel de Administración
        </h1>
        <p className="mt-1 text-center text-sm text-slate-body">
          Sunflower by Company
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
