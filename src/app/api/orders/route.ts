import { NextResponse } from "next/server";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { getBcvRateCents } from "@/lib/settings";

type Body = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingMethod: string;
  shippingAddress?: string;
  paymentMethod: "pagomovil" | "zelle" | "efectivo";
  paymentReference?: string;
  notes?: string;
  items: { productId: number; size: string; quantity: number }[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (
    !body.customerName?.trim() ||
    !body.customerPhone?.trim() ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json(
      { error: "Faltan datos del cliente o del pedido" },
      { status: 400 },
    );
  }

  // Los precios SIEMPRE se validan contra la base de datos, nunca contra el cliente.
  const ids = [...new Set(body.items.map((i) => i.productId))];
  const rows = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r]));

  let totalUsd = 0;
  const lines: {
    productId: number;
    productName: string;
    size: string;
    unitPriceUsd: number;
    quantity: number;
  }[] = [];

  for (const item of body.items) {
    const p = byId.get(item.productId);
    if (!p || !p.isActive || p.stock < item.quantity) {
      return NextResponse.json(
        { error: `Producto no disponible o sin stock: ${p?.name ?? item.productId}` },
        { status: 409 },
      );
    }
    totalUsd += p.priceUsd * item.quantity;
    lines.push({
      productId: p.id,
      productName: p.name,
      size: item.size ?? "",
      unitPriceUsd: p.priceUsd,
      quantity: item.quantity,
    });
  }

  const bcvRate = await getBcvRateCents();
  const code = `SF-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

  const created = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        code,
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        customerEmail: body.customerEmail?.trim() ?? "",
        shippingMethod: body.shippingMethod || "MRW",
        shippingAddress: body.shippingAddress?.trim() ?? "",
        paymentMethod: body.paymentMethod,
        paymentReference: body.paymentReference?.trim() ?? "",
        status: "verifying",
        totalUsd,
        bcvRate,
        notes: body.notes?.trim() ?? "",
      })
      .returning();

    await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));

    for (const l of lines) {
      await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${l.quantity}` })
        .where(eq(products.id, l.productId));
    }
    return order;
  });

  return NextResponse.json({ code: created.code, id: created.id });
}
