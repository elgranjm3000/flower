import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { logoutAction } from "../actions";


const NAV = [
  { href: "/admin", label: "📊 Resumen" },
  { href: "/admin/productos", label: "👗 Productos" },
  { href: "/admin/pedidos", label: "📦 Pedidos" },
  { href: "/admin/config", label: "⚙️ Configuración" },
];

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
      <aside className="flex shrink-0 flex-col bg-navy text-white lg:w-60">
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
          <span className="text-xl">🌻</span>
          <span className="font-extrabold">Sunflower Admin</span>
        </div>
        <nav className="flex flex-row overflow-x-auto p-2 lg:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden p-3 lg:block">
          <p className="px-3 text-xs text-white/50">Sesión: {session}</p>
          <form action={logoutAction}>
            <button className="mt-2 w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
