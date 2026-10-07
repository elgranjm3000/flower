# eccomerce — Sunflower by Company

E-commerce multidivisa (USD / Bs. tasa BCV) para Venezuela, construido con el
design system "Sunflower Retail Experience" (ver `DESIGN.md` si se extrae del
template Stitch original).

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + **Tailwind v4** (`@theme` en `src/app/globals.css`)
- **Turso (libSQL)** + **Drizzle ORM** (`src/db/schema.ts`, config en `drizzle.config.ts`)
- Sin librería de UI: componentes propios en `src/components/store` y `src/components/admin`
- Fuente: Plus Jakarta Sans (next/font), variable `--font-jakarta`

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # producción
node scripts/seed.mjs  # seed demo (omite si ya hay productos)
npx drizzle-kit push --force  # aplicar cambios de schema a Turso
```

## Convenciones del proyecto

- **Dinero en centavos**: `price_usd` y `total_usd` son enteros en centavos USD;
  `bcv_rate` es Bs×100 por 1 USD. Helpers en `src/lib/money.ts`. Los precios en
  Bs. NUNCA se guardan por producto: siempre se calculan con la tasa vigente.
- **Imágenes en BLOB**: `product_images.data` guarda el binario en la DB; se
  sirven por `/api/images/[id]` con caché inmutable (el id nunca cambia; para
  reemplazar se inserta fila nueva). Máx 5 MB por imagen en el form admin.
- **Precios validados en servidor**: `/api/orders` recalcula totales desde la
  tabla `products`; lo que envía el cliente es solo referencia.
- **Roles**: storefront en `src/app/(store)/`, admin en
  `src/app/admin/(protected)/` (guard en layout) + `admin/login` fuera del
  grupo protegido. Auth: cookie firmada HMAC (`src/lib/auth.ts`), credenciales
  en `ADMIN_USERNAME`/`ADMIN_PASSWORD` (.env).
- **Server actions**: todas en `src/app/admin/actions.ts` con `revalidatePath`.
- `cacheComponents` está **desactivado** en `next.config.ts` (sitio dinámico);
  no añadir `export const dynamic = "force-dynamic"` (error con Turbopack/Next 16).
- Design tokens: navy `#0d1b2a`, gold `#d49e35`, whatsapp `#25d366`,
  clases utilitarias `btn-gold`, `btn-outline`, `btn-navy`, `input-sf`,
  `badge-sf`, `container-sf` (definidas en globals.css).

## Estado del pedido

`pending → verifying → paid → shipped → delivered` (o `cancelled`).
Se cambia desde Admin → Pedidos → detalle.
