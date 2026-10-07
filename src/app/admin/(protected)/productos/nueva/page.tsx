import Link from "next/link";
import { ProductForm } from "../[id]/product-form";

export const metadata = { title: "Nuevo producto" };

export default function NewProductPage() {
  return (
    <div>
      <nav className="text-xs text-slate-body">
        <Link href="/admin/productos" className="hover:text-navy">Productos</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-navy">Nuevo</span>
      </nav>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
