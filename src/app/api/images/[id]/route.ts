import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productImages } from "@/db/schema";

/**
 * Sirve las imágenes guardadas como BLOB en la base de datos.
 * Cache inmutable: el contenido de una imagen nunca cambia (para
 * reemplazarla se inserta una fila nueva con otro id).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const [img] = await db
    .select({
      data: productImages.data,
      mimeType: productImages.mimeType,
    })
    .from(productImages)
    .where(eq(productImages.id, imageId))
    .limit(1);

  if (!img) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(img.data as unknown as BodyInit, {
    headers: {
      "Content-Type": img.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(img.data.byteLength),
    },
  });
}
