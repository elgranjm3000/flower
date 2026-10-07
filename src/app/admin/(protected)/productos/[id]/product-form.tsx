"use client";

import { useActionState, useState } from "react";
import { saveProductAction, type ProductFormState } from "../../../actions";

export type ProductFormData = {
  id: number;
  name: string;
  description: string;
  department: string;
  priceUsd: number; // centavos
  compareAtUsd: number | null;
  stock: number;
  sizes: string;
  brand: string;
  collection: string;
  isFeatured: boolean;
  isActive: boolean;
};

const DEPARTMENTS = [
  ["damas", "Damas"],
  ["caballeros", "Caballeros"],
  ["calzado", "Calzado"],
  ["accesorios", "Accesorios"],
];

export function ProductForm({ product }: { product?: ProductFormData }) {
  const [state, action, pending] = useActionState<ProductFormState | undefined, FormData>(
    saveProductAction,
    undefined,
  );
  const [fileCount, setFileCount] = useState(0);

  return (
    <form action={action} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <input type="hidden" name="id" value={product?.id ?? 0} />

      <div className="flex flex-col gap-6 lg:col-span-2">
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Información del producto</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Nombre *</label>
              <input name="name" required defaultValue={product?.name} className="input-sf mt-1" placeholder="Camisa de lino premium" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Departamento</label>
              <select name="department" defaultValue={product?.department ?? "damas"} className="input-sf mt-1">
                {DEPARTMENTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Marca</label>
              <input name="brand" defaultValue={product?.brand ?? "Sunflower"} className="input-sf mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Descripción</label>
              <textarea name="description" rows={5} defaultValue={product?.description} className="input-sf mt-1 h-auto py-2" placeholder="Detalles del tejido, cuidado, origen..." />
            </div>
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Galería (se guarda en binario en la base de datos)</p>
          <p className="mt-1 text-sm text-slate-body">
            Puedes seleccionar varias imágenes a la vez. JPG, PNG o WEBP · máx. 5 MB por imagen.
          </p>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
            className="mt-3 block w-full text-sm text-slate-body file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-navy-light"
          />
          {fileCount > 0 && (
            <p className="mt-2 text-sm font-semibold text-green-700">
              {fileCount} imagen(es) lista(s) para subir.
            </p>
          )}
        </section>
      </div>

      <aside className="flex h-fit flex-col gap-6">
        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Precio e inventario</p>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Precio USD *</label>
              <input name="priceUsd" type="number" step="0.01" min="0" required defaultValue={product ? product.priceUsd / 100 : ""} className="input-sf mt-1" placeholder="25.00" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Precio antes (opcional)</label>
              <input name="compareAtUsd" type="number" step="0.01" min="0" defaultValue={product?.compareAtUsd ? product.compareAtUsd / 100 : ""} className="input-sf mt-1" placeholder="35.00" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Stock</label>
              <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 10} className="input-sf mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Tallas (separadas por coma)</label>
              <input name="sizes" defaultValue={product?.sizes} className="input-sf mt-1" placeholder="S,M,L,XL" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-body">Colección</label>
              <input name="collection" defaultValue={product?.collection} className="input-sf mt-1" placeholder="Sunflower Signature" />
            </div>
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-bold">Visibilidad</p>
          <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} className="h-4 w-4" />
            ★ Producto destacado
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="h-4 w-4" />
            Visible en la tienda
          </label>
        </section>

        {state?.error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>
        )}

        <button disabled={pending} className="btn-gold w-full">
          {pending ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
        </button>
      </aside>
    </form>
  );
}
